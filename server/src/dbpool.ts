import {Pool} from "pg";
import dotenv from "dotenv";

dotenv.config();

const dbPool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
});


export default dbPool;