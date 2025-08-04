import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem("user");
        return u ? JSON.parse(u) : null;
    });
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }) => {
            const resp = await fetch(`${backendUrl}/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!resp.ok) throw new Error("Login failed");
            return resp.json();
        },
        onSuccess: (data) => {
            setToken(data.idToken);
            localStorage.setItem("token", data.idToken);
            const userObj = { email: data.email, uid: data.localId };
            setUser(userObj);
            localStorage.setItem("user", JSON.stringify(userObj));
        },
        onError: (error) => {
            console.error("Login error:", error);
            toast.error("Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.");
        },
    });

    const login = (email, password) => loginMutation.mutate({ email, password });
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        loginMutation.reset(); // Must clear, avoid Login component navigating to dashboard
    };

    return <AuthContext.Provider value={{ user, token, login, logout, loginMutation }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
