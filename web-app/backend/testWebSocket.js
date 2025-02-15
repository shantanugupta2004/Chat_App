import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("✅ Connected to WebSocket!", socket.id);
    socket.emit("message", { username: "shantanu", message: "Hello WebSocket!" });
});

socket.on("message", (data) => {
    console.log("📩 Received:", data);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket.");
});
