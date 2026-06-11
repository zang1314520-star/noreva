import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { ensureOrderSchema, trackingUrlFor } from '@/lib/orderSchema'

export async function GET(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureOrderSchema()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT
        o.*,
        c.name as customer_name,
        c.email as customer_email,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'product_id', oi.product_id,
                'product_name', oi.product_name,
                'product_image', oi.product_image,
                'price', oi.price,
                'quantity', oi.quantity
              )
              ORDER BY oi.id ASC
            )
            FROM order_items oi
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) as items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
    `
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      query += ` WHERE o.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error: any) {
    console.error('Orders fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ensureOrderSchema()
    const {
      id,
      status,
      notes,
      admin_note,
      tracking_carrier,
      tracking_number,
      tracking_url,
      fulfillment_status,
    } = await request.json()
    const fields: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (status) {
      fields.push(`status = $${paramIndex}`)
      values.push(status)
      paramIndex++
    }
    if (notes !== undefined) {
      fields.push(`notes = $${paramIndex}`)
      values.push(notes)
      paramIndex++
    }
    if (admin_note !== undefined) {
      fields.push(`admin_note = $${paramIndex}`)
      values.push(admin_note)
      paramIndex++
    }
    if (tracking_carrier !== undefined) {
      fields.push(`tracking_carrier = $${paramIndex}`)
      values.push(tracking_carrier)
      paramIndex++
    }
    if (tracking_number !== undefined) {
      fields.push(`tracking_number = $${paramIndex}`)
      values.push(tracking_number)
      paramIndex++
    }
    if (tracking_url !== undefined || tracking_number !== undefined || tracking_carrier !== undefined) {
      fields.push(`tracking_url = $${paramIndex}`)
      values.push(trackingUrlFor(tracking_carrier, tracking_number, tracking_url))
      paramIndex++
    }
    if (fulfillment_status) {
      fields.push(`fulfillment_status = $${paramIndex}`)
      values.push(fulfillment_status)
      paramIndex++
    }
    if (status === 'shipped' || fulfillment_status === 'shipped') {
      fields.push(`shipped_at = COALESCE(shipped_at, NOW())`)
    }
    if (status === 'completed' || fulfillment_status === 'delivered') {
      fields.push(`delivered_at = COALESCE(delivered_at, NOW())`)
    }

    fields.push(`updated_at = NOW()`)
    values.push(id)

    await pool.query(
      `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    )
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
