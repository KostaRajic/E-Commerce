import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sektor11!',
    database: 'e-commercewebsite'
}).promise()

async function checkConnection(params) {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successfull!');
        connection.release()
    }
    catch (e) {
        console.error(e.message)
    }
}

export { pool, checkConnection }