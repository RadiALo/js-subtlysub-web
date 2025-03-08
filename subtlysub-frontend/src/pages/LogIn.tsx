import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const loginUrl = "http://localhost:3000/auth/login"
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials!");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-200 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Username</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-gray-600">
            Don't have an account? <Link to="/signup" className="text-purple-500 hover:underline">Sign up</Link>
          </p>
        </div>
    </div>    
  );
};

export default LogIn;