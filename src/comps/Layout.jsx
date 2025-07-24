import { Routes, Route, useLocation } from "react-router-dom";
import Sidemenu from "./Sidemenu";
import Dashboard from "./Dashboard";
import Galerie from "./Galerie";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

function Layout() {
    const location = useLocation();
    const hideSidebar = location.pathname === "/login";

    return (
        <div className="flex">
            {!hideSidebar && <Sidemenu />}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/galerie"
                    element={
                        <ProtectedRoute>
                            <Galerie />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default Layout;
