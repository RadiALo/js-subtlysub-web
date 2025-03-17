import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/explore"
                  className="header-button"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/posts/create"
                  className="header-button"
                >
                  Create
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="header-accent-button"
                >
                  Sign out
                </button>
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
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="header-accent-button"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
