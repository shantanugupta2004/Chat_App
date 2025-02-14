import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
const server = http.createServer(app);
const io =new Server(server, {cors: {origin: "*"}});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));