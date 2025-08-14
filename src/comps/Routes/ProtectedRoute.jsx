import { Navigate } from "react-router-dom";
import { hasValidToken } from "../../common/ApiService";

function ProtectedRoute({ children }) {
    return hasValidToken() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;