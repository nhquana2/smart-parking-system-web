import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthRoute({ children }) {
    const { token } = useAuth();
    return token ? <Navigate to="/" replace /> : children;
}
