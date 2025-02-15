import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Chat App</Link>
            <div className="space-x-4">
                {username ? (
                    <>
                        <span className="font-semibold">Hello, {username}!</span>
                        <button 
                            onClick={handleLogout} 
                            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
