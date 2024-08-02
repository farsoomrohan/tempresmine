import { useNavigate } from "react-router-dom";
import { getToken, decodeToken } from "./auth";
import { isAdmin } from "./roles";
import { useEffect } from "react";

const ProtectedRoute = ({ element, ...rest }) => {
  const navigate = useNavigate();
  const token = getToken();
  const decodedToken = decodeToken(token);
  const userIsAdmin = isAdmin(decodedToken);

  // console.log(userIsAdmin, "admin");

  useEffect(() => {
    if (userIsAdmin === false || userIsAdmin === "false") {
      navigate("/home");
    }
  }, [userIsAdmin]);

  return element;
};

export default ProtectedRoute;