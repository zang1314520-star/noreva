import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export async function POST(request: Request) {
  try {
    const { items, customer_email, customer_name } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items' }, { status: 400 })
    }

    const line_items = items.map((item: any) => {
      // Parse price - handle both "€890" string format and raw numbers
      let unitAmount: number
      if (typeof item.price === 'number') {
        unitAmount = Math.round(item.price * 100)
      } else {
        unitAmount = Math.round(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * 100)
      }
      
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${item.brand ? item.brand + ' - ' : ''}${item.name}`,
            images: item.image ? [item.image] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity || 1,
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'alipay', 'wechat_pay'],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://noreva.cc'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://noreva.cc'}`,
      customer_email,
      line_items,
      shipping_address_collection: {
        allowed_countries: ['CN', 'HK', 'TW', 'JP', 'KR', 'SG', 'US', 'GB', 'FR', 'IT', 'DE', 'ES'],
      },
      metadata: {
        customer_name: customer_name || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
