import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DOCKER_DB_URL,
});

export default pool;