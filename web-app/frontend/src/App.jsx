import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  return(
    <Router>
      <Navbar/>
      <Routes>
       <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
