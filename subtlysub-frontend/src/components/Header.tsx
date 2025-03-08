import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-purple-400 transition-colors">
          SubtlySub
        </Link>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors"
              >
                Log In
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg border border-purple-500 hover:bg-purple-500 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
