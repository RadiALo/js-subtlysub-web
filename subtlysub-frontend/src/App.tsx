import "./App.css";
import Header from "./components/Header"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LogIn from "./pages/LogIn";
import Verify from "./pages/Verify";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import CreatePost from "./pages/Post/CreatePost";
import PostDetail from "./pages/Post/PostDetail";
import CollectionDetail from "./pages/Collection/CollectionDetail";
import EditPost from "./pages/Post/EditPost";
import CreateCollection from "./pages/Collection/CreateCollection";
import EditCollection from "./pages/Collection/EditCollection";
import Learn from "./pages/Learn/Learn";
import LearnApp from "./pages/Learn/LearnApp";
import './i18n';
import ProtectedRoute from "./pages/ProtectedRoute";
import Code from "./Code";

function App() {
  return (
    <Router>
      <Header></Header>      
      <div className="py-6 min-h-screen bg-gray-800">
        <Routes>
          <Route path="/code" element={<Code />}/>
          <Route path="/login" element={<LogIn />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/verify" element={<Verify />}/>
          <Route path="/explore" element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }/>
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }/>
          <Route path="/posts/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }/>
          <Route path="/posts/:id/edit" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }/>
          <Route path="/posts/:id" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }/>
          <Route path="/collections/create" element={
            <ProtectedRoute>
              <CreateCollection />
            </ProtectedRoute>
          }/>
          <Route path="/collections/:id/edit" element={
            <ProtectedRoute>
              <EditCollection />
            </ProtectedRoute>
          }/>
          <Route path="/collections/:id" element={
            <ProtectedRoute>
              <CollectionDetail />
            </ProtectedRoute>
          }/>
          <Route path="/posts/:id/learn/app" element={
            <ProtectedRoute>
              <LearnApp />
            </ProtectedRoute>
          } />
          <Route path="/posts/:id/learn" element={
            <ProtectedRoute>
              <Learn />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
