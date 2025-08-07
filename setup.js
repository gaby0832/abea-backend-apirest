import sql from './src/config/sql.js'

const createTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `

  console.log('✅ Tabela criada (ou já existia)')
  await sql.end() // Fecha a conexão
}

createTable().catch((err) => {
  console.error('Erro ao criar tabela:', err)
  sql.end()
})