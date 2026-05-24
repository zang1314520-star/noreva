import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'medusa',
  user: 'medusa',
  password: 'Medusa2026!Noreva',
  max: 5,
})

export default pool
