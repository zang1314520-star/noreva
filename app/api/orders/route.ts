import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let query = `
      SELECT o.*, c.name as customer_name, c.email as customer_email
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
    const { id, status, notes } = await request.json()
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
