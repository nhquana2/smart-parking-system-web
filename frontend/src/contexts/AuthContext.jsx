import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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
            setUser({ email: data.email, uid: data.localId });
        },
    });

    const login = (email, password) => loginMutation.mutate({ email, password });
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return <AuthContext.Provider value={{ user, token, login, logout, loginMutation }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
