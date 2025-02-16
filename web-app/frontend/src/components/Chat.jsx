import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import API from "../../utils/api";

const socket = io("http://localhost:5000");

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await API.get("chat/messages");
                setMessages(data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();

        socket.on("message", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const username = localStorage.getItem("username");

            if (!username) {
                alert("Username is missing! Please log in again.");
                return;
            }

            const msgData = { username, message };
            socket.emit("message", msgData);
            setMessage("");
        }
    };

    const deleteMessage = async (id) => {
        try {
            await API.delete(`chat/messages/${id}`);
            setMessages(messages.filter((msg) => msg.id !== id));
        } catch (error) {
            alert("Could not delete message");
            console.error("Error deleting message", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-bold text-center mb-4">Chat Room</h2>
            <div className="border p-4 h-80 overflow-y-auto">
                {messages.map((msg) => (
                    <div key={msg.id} className="mb-2 flex items-center justify-between bg-gray-100 p-2 rounded-md">
                        <p>
                            <strong>{msg.username || "Anonymous"}:</strong> {msg.message}
                        </p>
                        {msg.username === localStorage.getItem("username") && (
                            <button
                                onClick={() => deleteMessage(msg.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border p-2 rounded"
                />
                <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
