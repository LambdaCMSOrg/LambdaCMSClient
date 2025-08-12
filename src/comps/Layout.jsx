import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Gallery from "./Gallery";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

function Layout() {
    const location = useLocation();
    const hideSidebar = location.pathname === "/login";

    return (
        <div className="flex h-screen">
            {!hideSidebar && <Sidebar />}

            <div className="flex-1 overflow-auto">
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
                        path="/gallery"
                        element={
                            <ProtectedRoute>
                                <Gallery />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default Layout;
