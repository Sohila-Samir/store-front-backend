import dotenv from 'dotenv';
import  { Pool } from 'pg';

dotenv.config();


const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_DB, POSTGRES_DB_TEST, POSTGRES_PASSWORD, ENV } = process.env;

let client: Pool;

if (ENV === 'dev') {
    client =  new Pool ({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
    });
} else {
    client =  new Pool ({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_DB_TEST,
        password: POSTGRES_PASSWORD,
    });
}

export default client;