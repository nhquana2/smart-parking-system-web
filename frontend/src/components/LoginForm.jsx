import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ email, password, setEmail, setPassword, onSubmit, isLoading, isError, className, ...props }) {
    return (
        <form onSubmit={onSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Đăng nhập</h1>
                <p className="text-muted-foreground text-sm text-balance">Đăng nhập vào hệ thống quản lý bãi xe</p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="vlcntt@23clc01.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <Input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
            </div>
            <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <a href="#" className="underline underline-offset-4">
                    Đăng ký
                </a>
            </div>
        </form>
    );
}
