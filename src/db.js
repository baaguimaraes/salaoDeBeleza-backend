const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
})

pool.on('error', (err) => {
    console.error('Erro no pool de conexão:', err)
})

async function inicializarBanco() {
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    const client = await pool.connect()
    try {
        await client.query(schema)
        console.log('✅ Banco de dados inicializado com sucesso')
    } catch (err) {
        console.error('❌ Erro ao inicializar banco de dados:', err.message)
        throw err
    } finally {
        client.release()
    }
}

pool.inicializarBanco = inicializarBanco

module.exports = pool
