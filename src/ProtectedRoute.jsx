import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const authStatus = useSelector((state) => state.auth.user); // from authSlice

  // If not logged in → go to signup page
  if (!authStatus) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}
