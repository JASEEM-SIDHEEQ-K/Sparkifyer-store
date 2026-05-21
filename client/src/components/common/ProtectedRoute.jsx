import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectRole,
} from "../../features/auth/authSlice";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  userOnly = false,
  noAdminAccess = false,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectRole);

  
  if (adminOnly) {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (role !== "admin") return <Navigate to="/" replace />;
    return children;
  }

  
  if (userOnly) {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
    return children;
  }

  
  if (noAdminAccess) {
    if (isAuthenticated && role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return children;
  }

  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;