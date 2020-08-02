import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });

export const executeQuery = async (query) => {
    const client = pool.connect();
    try {
        await client.query('BEGIN');
        const res = await client.query(query);
        await client.query('COMMIT');
        Promise.resolve(res);
    } catch (e){
        await client.query('ROLLBACK');
        Promise.reject(e);
    } finally {
        client.release()
    }
}