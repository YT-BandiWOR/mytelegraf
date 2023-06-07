import {Pool} from "pg";

const dbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '1Kimonojoom1',
    port: 5432,
});



export default dbPool;