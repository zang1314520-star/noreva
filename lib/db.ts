import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  database: process.env.POSTGRES_DATABASE ?? 'medusa',
  user: process.env.POSTGRES_USER ?? 'medusa',
  password: process.env.POSTGRES_PASSWORD,
  max: Number(process.env.POSTGRES_POOL_MAX ?? 5),
})

export default pool
