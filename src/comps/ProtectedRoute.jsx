import { Navigate } from "react-router-dom";
import { hasToken } from "../common/ApiService";

function ProtectedRoute({ children }) {
    return hasToken() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;