import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CarFront } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { toast } from "sonner";

export default function LoginPage() {
    const { login, loginMutation } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    if (loginMutation.isSuccess) {
        navigate("/");
    }

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
                            <CarFront className="h-6 w-6" />
                        </div>
                        Bãi xe thông minh - 23CLC01
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm
                            email={email}
                            password={password}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            onSubmit={handleSubmit}
                            isLoading={loginMutation.isPending}
                            isError={loginMutation.isError}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/img/parking_3d_model.png"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
