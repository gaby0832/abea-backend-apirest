import dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config();

const sql = postgres({
  host: 'localhost',
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_PUBLIC_USER,
  password: process.env.DB_USER_PASS,
})

async function connectionTest(){
  try {
    await sql`SELECT 1`;
    console.log('Conectado ao banco com sucesso')
  } catch(error) {
    console.log("Erro ao conectar ao banco", error.message)
  }
}

connectionTest();


export default sql;


