import "./App.css";
import Header from "./components/Header"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import EditPost from "./pages/EditPost";

function App() {
  return (
    <Router>
      <Header></Header>      
      <div className="py-6 min-h-screen bg-gray-800">
        <Routes>
          <Route path="/login" element={<LogIn />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/explore" element={<Explore />}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/posts/create" element={<CreatePost />}/>
          <Route path="/posts/:id/edit" element={<EditPost />}/>
          <Route path="/posts/:id" element={<PostDetail />}/>
        </Routes>      
      </div>
    </Router>
  );
}

export default App;
