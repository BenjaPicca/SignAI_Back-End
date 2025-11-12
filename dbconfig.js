import pg from "pg"; 
import "dotenv/config";

const { Pool } = pg;


export const pool = new Pool({
    user: "default",
    host: process.env.HOST_DB,
    database: "verceldb",
    password: process.env.PASS_DB,
    port: 5432,
    ssl: true,
});