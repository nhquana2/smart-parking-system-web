import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Toaster } from "@/components/ui/sonner";
import AuthRoute from "./components/AuthRoute";
import { Layout } from "./layouts/DashboardLayout";
import RFID from "./pages/RFID";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster />
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AuthRoute>
                                <Login />
                            </AuthRoute>
                        }
                    />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="rfid" element={<RFID />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
