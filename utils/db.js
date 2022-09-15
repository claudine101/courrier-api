const { createPool } = require('mysql2/promise')
const dotenv = require('dotenv')

dotenv.config()
const connection = async () => {
          try {
                    const pool = await createPool({
                              host: process.env.BD_HOST,
                              user: process.env.DB_USER,
                              password: process.env.DB_PASSWORD,
                              database: process.env.DB_NAME,
                    })
                    return pool
          } catch (error) {
                    throw error
          }
}

const query = async (query, values) => {
          const pool = await connection()
          return ( await pool.query(query, values))[0]
}

module.exports = {
          connection,
          query
}