import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken, isTokenExpired } from "./auth";

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getToken();

    // Check if token exists and is not expired
    if (token && !isTokenExpired(token)) {
      // If the user is authenticated and tries to access the login page, redirect to home
      if (location.pathname === "/") {
        navigate("/home");
      }
    } else {
      // If the user is unauthenticated and tries to access any route other than login, redirect to "/"
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [navigate, location.pathname]);

  return children;
}

export default AuthWrapper;