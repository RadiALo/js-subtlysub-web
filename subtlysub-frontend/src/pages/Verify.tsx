import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Verify = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [resendActive, setResendActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch(`${apiUrl}/api/users/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        setErrorMsg(t('verificationError'));
        return;
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
      
      navigate("/home");
    } catch (error) {
      console.error("Error fetching verification code:", error);
      setErrorMsg(t('verificationError'));
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setResendActive(false);
    setCountdown(30);

    try {
      await fetch(`${apiUrl}/api/users/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
    } catch (error) {
      console.error("Error fetching verification code:", error);
      setErrorMsg(t('verificationError'));
    }
  };

  useEffect(() => {
    if (countdown === 0) {
      setResendActive(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const getVerificationCode = async () => {
      try {
        await fetch(`${apiUrl}/api/users/verify`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        });
      } catch (error) {
        console.error("Error fetching verification code:", error);
        setErrorMsg(t('verificationError'));
      }
    };

    getVerificationCode();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-200 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-bold text-center text-gray-800">{t('verifyLabel')}</h2>
          {errorMsg && <p className="text-red-500 text-center">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">{t('code')}</label>
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required 
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-purple-200 focus:border-purple-400"
              />
            </div>
            
            <button
              type="button"
              onClick={handleResend}
              disabled={!resendActive}
              className={`primary-button ${!resendActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resendActive ? t('resend') : `${t('resend')} (${countdown})`}
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {t('submit')}
            </button>
          </form>
        </div>
    </div>    
  );
};

export default Verify;
