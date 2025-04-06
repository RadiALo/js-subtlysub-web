import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  console.log("User:", user);
  if (!user.verified) {
    return <Navigate to="/verify" replace />;
  }
  
  return children;
}

export default ProtectedRoute;
