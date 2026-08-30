import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loader from "./Loader";

// Keeps logged in users away from the login and register screens.
function PublicRoute() {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <Loader label="Checking your session" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
