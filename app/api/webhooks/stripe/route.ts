import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import pool from '@/lib/db'
import { ensureOrderSchema } from '@/lib/orderSchema'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    try {
      await ensureOrderSchema()
      const existingOrder = await pool.query(
        'SELECT id FROM orders WHERE stripe_session_id = $1',
        [session.id]
      )
      if (existingOrder.rows.length > 0) {
        return NextResponse.json({ received: true, duplicate: true })
      }

      const customerEmail = session.customer_details?.email || ''
      const customerName = session.customer_details?.name || session.metadata?.customer_name || ''
      const customerPhone = session.customer_details?.phone || ''
      const shippingName = session.shipping_details?.name || customerName
      const shippingAddress = session.shipping_details?.address || null
      const amountTotal = (session.amount_total || 0) / 100

      const existingCustomer = await pool.query(
        'SELECT id FROM customers WHERE email = $1',
        [customerEmail]
      )

      let customerId: number
      if (existingCustomer.rows.length > 0) {
        customerId = existingCustomer.rows[0].id
      } else {
        const newCustomer = await pool.query(
          'INSERT INTO customers (email, name, stripe_customer_id) VALUES ($1, $2, $3) RETURNING id',
          [customerEmail, customerName, session.customer as string]
        )
        customerId = newCustomer.rows[0].id
      }

      const year = String(new Date().getFullYear()).slice(-2)
      const orderNumber = `N${year}${String(Date.now()).slice(-8)}`

      const order = await pool.query(
        `INSERT INTO orders (
          order_number, customer_id, status, payment_status, fulfillment_status,
          subtotal, total, currency, stripe_session_id, stripe_payment_intent,
          shipping_address, shipping_name, customer_phone
        )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
        [
          orderNumber,
          customerId,
          'paid',
          session.payment_status || 'paid',
          'unfulfilled',
          amountTotal,
          amountTotal,
          session.currency || 'eur',
          session.id,
          typeof session.payment_intent === 'string' ? session.payment_intent : '',
          shippingAddress ? JSON.stringify(shippingAddress) : null,
          shippingName,
          customerPhone,
        ]
      )

      const orderId = order.rows[0].id

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product'],
      })

      for (const item of lineItems.data) {
        const product = item.price?.product as Stripe.Product | string | null
        const productId = typeof product === 'object' && product ? product.metadata?.product_id || product.id : String(product || '')
        const productImage = typeof product === 'object' && product ? product.images?.[0] || '' : ''

        await pool.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            orderId,
            productId,
            item.description || 'Product',
            productImage,
            (item.price?.unit_amount || 0) / 100,
            item.quantity || 1,
          ]
        )
      }

      console.log(`Order ${orderNumber} created successfully`)
    } catch (err: any) {
      console.error('Order creation error:', err)
    }
  }

  return NextResponse.json({ received: true })
}
