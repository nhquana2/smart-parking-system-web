import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicRoute({ children }) {
    const { token } = useAuth();
    return token ? <Navigate to="/" replace /> : children;
}
