import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import { saveMessage } from "./models/Message.js";

const app = express();
const server = http.createServer(app);
const io =new Server(server, {cors: {origin: "*"}});

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

io.on("connection", (socket)=>{
    console.log("User connected:", socket.id);
    socket.on("message", async (data)=>{
        try {
            await saveMessage(data.username, data.message);
            io.emit("message", data);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
    socket.on("disconnect", ()=>{
        console.log("User disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));