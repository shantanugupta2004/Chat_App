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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-semibold text-center">Chat Room</h2>
                </div>

                <div className="h-96 overflow-y-auto p-4 space-y-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded-lg ${
                                msg.username === localStorage.getItem("username")
                                    ? "bg-green-500 text-white self-end ml-auto"
                                    : "bg-gray-700 text-white self-start mr-auto"
                            } max-w-xs`}
                        >
                            <p className="text-sm text-gray-300">{msg.username || "Anonymous"}:</p>
                            <p className="text-lg">{msg.message}</p>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-700 flex">
                    <input
                        type="text"
                        className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-l-md text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-r-md transition duration-200"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
