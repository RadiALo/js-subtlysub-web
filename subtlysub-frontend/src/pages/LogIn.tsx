import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const LogIn = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (!username) {
        setErrorMsg(t("usernameRequired"));
        return;
      }

      if (!password) {
        setErrorMsg(t("passwordRequired"));
        return;
      }

      const loginUrl = `${apiUrl}/auth/login`
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error(t("invalidCredentials"));
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      const decodeToken = (token: string) => {
        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          return JSON.parse(atob(base64));
        } catch {
          return null;
        }
      };
      const decoded = decodeToken(data.token);
      
      if (decoded) {
        localStorage.setItem("user", JSON.stringify(decoded));
      } else {
        console.error("Invalid token");
      }

      navigate("/explore");
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
          <h2 className="text-2xl font-bold text-center text-gray-800">{t('login')}</h2>
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">{t('username')}</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-400"
              />
            </div>

            <div>
              <label className="block text-gray-700">{t('password')}</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-400"
              />
            </div>

            <button
              type="submit"
              className="primary-button"
            >
              {t('login')}
            </button>
          </form>

          <p className="text-center text-gray-600">
            {t('dontHaveAccount')} <Link to="/signup" className="text-purple-600 hover:underline">{t('signup')}</Link>
          </p>
        </div>
    </div>    
  );
};

export default LogIn;