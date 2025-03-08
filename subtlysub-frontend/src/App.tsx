import "./App.css";
import Header from "./components/Header"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Router>
      <Header></Header>      
      <div className="min-h-screen bg-gray-800">
        <Routes>
          <Route path="/login" element={<LogIn />}/>
          <Route path="/signup" element={<SignUp />}/>
        </Routes>      
      </div>
    </Router>
  );
}

export default App;
