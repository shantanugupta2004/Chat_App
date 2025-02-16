import pool from "../config/db.js";
import { getMessages, saveMessage } from "../models/Message.js";

export const sendMessages = async (req, res) => {
    try {
        console.log("Received request to store message:", req.body);
        console.log("Extracted user from JWT:", req.user); // Debugging
        
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        if (!req.user || !req.user.username) {
            console.error("Error: Username not found in token.");
            return res.status(400).json({ error: "Invalid user session" });
        }

        const savedMessage = await saveMessage(req.user.username, message);
        console.log("Message stored:", savedMessage);

        res.json({ message: "Message stored successfully", data: savedMessage });
    } catch (error) {
        console.error("Error storing message:", error);
        res.status(500).json({ error: "Failed to store message" });
    }
};

export const fetchMessages = async (req, res) => {
    try {
        const messages = await getMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};

export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM messages WHERE id = $1 AND username = $2 RETURNING *",
            [id, req.user.username]
        );
        if(result.rowCount === 0){
            return res.status(403).json({error : "Unauthorized to delete this message"});
        }
        res.json({message: "Message deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Error deleting message"});
    }
};
