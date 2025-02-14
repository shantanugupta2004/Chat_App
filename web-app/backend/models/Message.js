import pool from "../config/db.js";

export const saveMessage = async (username, message) => {
    console.log("📡 Executing DB Query: INSERT INTO messages (username, message) VALUES ($1, $2)");
    
    try {
        const result = await pool.query(
            "INSERT INTO messages (username, message) VALUES ($1, $2) RETURNING *",
            [username, message]
        );
        console.log("✅ Query Success:", result.rows[0]);
        return result.rows[0]; // Return the inserted message
    } catch (error) {
        console.error("❌ Database Error:", error);
        throw error;
    }
};

export const getMessages = async () => {
    const result = await pool.query("SELECT * FROM messages ORDER BY timestamp ASC");
    return result.rows;   
};