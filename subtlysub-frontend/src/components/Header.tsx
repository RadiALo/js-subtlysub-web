import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import i18next from "i18next";

const Header = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isEnglish, setIsEnglish] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleLanguage = () => {
    i18next.changeLanguage(isEnglish ? 'ua' : 'en');
    setIsEnglish(!isEnglish);
  };

  useEffect(() => {
    setIsEnglish(i18next.language === 'en');
  }, [t]);

  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-purple-400 transition-colors">
          SubtlySub
        </Link>

        { token ? (
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/home"
                  className="header-button"
                >
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="header-button"
                >
                  {t('explore')}
                </Link>
              </li>
              <li>
                <Link
                  to="/posts/create"
                  className="header-button"
                >
                  {t('create')}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="header-accent-button"
                >
                  {t('logout')}
                </button>
              </li>
              <li className="flex gap-2 items-center">
                <img className="w-6 h-6 rounded-full object-cover" src="/ua.png" alt="" />
                <div 
                  onClick={toggleLanguage} 
                  className={`relative inline-flex items-center cursor-pointer w-14 h-8 rounded-full ${isEnglish ? 'bg-purple-500' : 'bg-orange-300'}`}
                >
                  <span 
                    className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${isEnglish ? 'transform translate-x-6' : ''}`}
                  ></span>
                </div>
                <img className="w-6 h-6 rounded-full object-cover" src="/en.png" alt="" />
              </li>
            </ul>
          </nav>
        ) : (
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/login"
                  className="header-button"
                >
                  {t('login')}
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="header-accent-button"
                >
                  {t('signup')}
                </Link>
              </li>
              <li className="flex gap-2 items-center">
                <img className="w-6 h-6 rounded-full object-cover" src="/ua.png" alt="" />
                <div 
                  onClick={toggleLanguage} 
                  className={`relative inline-flex items-center cursor-pointer w-14 h-8 rounded-full ${isEnglish ? 'bg-purple-500' : 'bg-orange-500'}`}
                >
                  <span 
                    className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${isEnglish ? 'transform translate-x-6' : ''}`}
                  ></span>
                </div>
                <img className="w-6 h-6 rounded-full object-cover" src="/en.png" alt="" />
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
