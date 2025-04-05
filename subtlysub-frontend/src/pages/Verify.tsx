import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";

const Verify = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [resendActive, setResendActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
  };

  const handleResend = async () => {
    setErrorMsg("");
    setResendActive(false);
    setCountdown(30);
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
