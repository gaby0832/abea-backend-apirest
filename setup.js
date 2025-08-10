import sql from './src/config/sqlAdmin.js'

const createTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS dogs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        age INTEGER NOT NULL,
        available BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  console.log('✅ Tabela criada (ou já existia)')
  await sql.end() // Fecha a conexão
}

createTable().catch((err) => {
  console.error('Erro ao criar tabela:', err)
  sql.end()
})