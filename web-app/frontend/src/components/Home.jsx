import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Chat App</h1>
            <p className="text-lg text-gray-600 mb-6">Connect and chat with your friends in real-time!</p>
            <Link to="/chat" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Go to Chat
            </Link>
        </div>
    );
};

export default Home;
