import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsAuthenticated,selectRole } from "../../features/auth/authSlice";


const ProtectedRoute = ({children, adminOnly = false , userOnly = false }) => {

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const role=useSelector(selectRole)

    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    if(adminOnly && role !== "admin"){
        return <Navigate to="/" replace />
    }

    if(userOnly && role === "admin"){
        return <Navigate to="/admin" />
    }

    return children
}

export default ProtectedRoute
