import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DB_URL, //use DOCKER_DB_URL when running through a docker container
});

export default pool;