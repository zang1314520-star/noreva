import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureOrderSchema } from "@/lib/orderSchema";

export async function GET(request: Request) {
  try {
    await ensureOrderSchema();

    const { searchParams } = new URL(request.url);
    const order = searchParams.get("order")?.trim();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!order || !email) {
      return NextResponse.json({ error: "Order number and email are required" }, { status: 400 });
    }

    const result = await pool.query(
      `
        SELECT
          o.id, o.order_number, o.status, o.payment_status, o.fulfillment_status,
          o.total, o.currency, o.created_at, o.updated_at, o.shipped_at, o.delivered_at,
          o.tracking_carrier, o.tracking_number, o.tracking_url,
          c.email as customer_email
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        WHERE (LOWER(o.order_number) = LOWER($1) OR CAST(o.id AS TEXT) = $1)
          AND LOWER(c.email) = $2
        LIMIT 1
      `,
      [order.replace(/^#/, ""), email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const foundOrder = result.rows[0];
    const items = await pool.query(
      `SELECT product_id, product_name, product_image, price, quantity FROM order_items WHERE order_id = $1 ORDER BY id ASC`,
      [foundOrder.id]
    );

    return NextResponse.json({
      order: {
        ...foundOrder,
        customer_email: undefined,
        items: items.rows,
      },
    });
  } catch (error: any) {
    console.error("Track lookup error:", error);
    return NextResponse.json({ error: error.message || "Track lookup failed" }, { status: 500 });
  }
}
