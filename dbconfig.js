import pg from "pg"; // Importamos el cliente de pg (recordar que para utilizar 'import' es necesario usar "type": "module" en el package.json)

const { Pool } = pg;

// Pueden (y deberían) utilizar variables de entorno para almacenar los datos de conexión (dotenv)
export const pool = new Pool({
    user: "default",
    host: "ep-green-recipe-a4g3nggs-pooler.us-east-1.aws.neon.tech",
    database: "verceldb",
    password: "dqLgAMT0B2NZ",
    port: 5432,
    ssl: true,
});