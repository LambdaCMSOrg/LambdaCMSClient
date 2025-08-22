import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "./Pages/Dashboard";
import Gallery from "./Pages/Gallery";
import Login from "./Pages/Login";
import ProtectedRoute from "./Routes/ProtectedRoute";
import AdminProtectedRoute from "./Routes/AdminProtectedRoute";
import {AdminPanel} from "./Pages/AdminPanel";
import {LogPanel} from "./Pages/LogPanel";

function Layout() {
    const location = useLocation();
    const hideSidebar = location.pathname === "/login";

    return (
        <div className="flex h-screen">
            {!hideSidebar && <Sidebar />}

            <div className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/login" element={
                        <Login />
                    }/>

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }/>

                    <Route path="/gallery" element={
                        <ProtectedRoute>
                            <Gallery />
                        </ProtectedRoute>
                    }/>

                    <Route path="/admin/audit" element={
                        <AdminProtectedRoute>
                            <LogPanel />
                        </AdminProtectedRoute>
                    }>/
                    </Route>

                    <Route path="/admin/users" element={
                        <AdminProtectedRoute>
                            <AdminPanel />
                        </AdminProtectedRoute>
                    }/>
                </Routes>
            </div>
        </div>
    );
}

export default Layout;
