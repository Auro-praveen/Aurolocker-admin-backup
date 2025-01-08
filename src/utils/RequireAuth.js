import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./Auth";


function RequireAuth({ children }) {

    const location = useLocation();
    const Auth = useAuth();

    if (!Auth.user) {
        return (<Navigate to="login/" state={{ path: location.pathname }} replace="true"/>)
    } 
    return children;
}

export default RequireAuth;