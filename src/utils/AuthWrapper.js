import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken, isTokenExpired } from "./auth";
import { useMsal } from "@azure/msal-react";

function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accounts } = useMsal();

  useEffect(() => {
    if (accounts.length > 0) {
      // If user is signed in
      if (location.pathname === "/") {
        navigate("/home");
      }
    } else {
      // If user is not signed in
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [navigate, location.pathname, accounts]);

  return children;
}

export default AuthWrapper;