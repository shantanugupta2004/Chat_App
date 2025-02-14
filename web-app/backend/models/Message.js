import pool from "../config/db";

export const saveMessage = async (username, message)=>{
    await pool.query(
        "INSERT INTO messages (username, message) VALUES ($1, $2)",
        [username, message]
    );
};

export const getMessages = async () => {
    const result = await pool.query("SELECT * FROM messages ORDER BY timestamp ASC");
    return result.rows;   
};