import "./App.css";
import Header from "./components/Header"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <Router>
      <Header></Header>      
      <div className="py-6 min-h-screen bg-gray-800">
        <Routes>
          <Route path="/login" element={<LogIn />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/explore" element={<Explore />}/>
          <Route path="/create" element={<CreatePost />}/>
        </Routes>      
      </div>
    </Router>
  );
}

export default App;
