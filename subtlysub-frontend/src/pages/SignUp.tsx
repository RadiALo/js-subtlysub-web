import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import validator from "validator";

const SignUp = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setErrorMsg("");

      if (!email) {
        setErrorMsg(t("emailRequired"));
        return;
      }

      if (!username) {
        setErrorMsg(t("usernameRequired"));
        return;
      }

      if (!password) {
        setErrorMsg(t("passwordRequired"));
        return;
      }

      if (!confirmPassword || password !== confirmPassword) {
        setErrorMsg(t("passwordsDoNotMatch"));
        return;
      }

      if (!validator.isEmail(email)) {
        setErrorMsg(t("invalidEmail"));
        return;
      }

      const registerUrl = `${apiUrl}/auth/register`;
      const response = await fetch(registerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid data!");
      }

      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-200 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {t("signup")}
        </h2>
        {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">{t("email")}</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("username")}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-gray-700">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700">{t("confirmSassword")}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-500"
            />
          </div>

          <button type="submit" className="primary-button">
            {t("signup")}
          </button>

          <p className="text-center text-gray-600">
            {t("alreadyHaveAccount")}{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              {t("login")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
