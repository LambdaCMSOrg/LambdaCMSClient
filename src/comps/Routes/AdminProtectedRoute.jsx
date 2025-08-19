import { Navigate } from "react-router-dom";
import {hasValidToken, isCurrentUserAdmin} from "../../common/ApiService";

export default function AdminProtectedRoute({ children }) {
    return hasValidToken() && isCurrentUserAdmin() ? children : <Navigate to="/" replace />;
}