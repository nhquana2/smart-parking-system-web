import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor } from "lucide-react";
import { useLCDControl } from "@/queries/deviceControl";
import { useAuth } from "@/contexts/AuthContext";

export default function LCDControlCard() {
    const { token } = useAuth();
    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const lcdControl = useLCDControl(token);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!line1.trim() && !line2.trim()) {
            return;
        }
        lcdControl.mutate({ line1: line1.trim(), line2: line2.trim() });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    <CardTitle>Điều khiển LCD 16x2</CardTitle>
                </div>
                <CardDescription>Gửi tin nhắn hiển thị lên màn hình LCD</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="line1">Dòng 1</Label>
                        <Input
                            id="line1"
                            value={line1}
                            onChange={(e) => setLine1(e.target.value)}
                            placeholder="Nhập nội dung dòng 1..."
                            maxLength={16}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="line2">Dòng 2</Label>
                        <Input
                            id="line2"
                            value={line2}
                            onChange={(e) => setLine2(e.target.value)}
                            placeholder="Nhập nội dung dòng 2..."
                            maxLength={16}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={lcdControl.isPending}>
                        {lcdControl.isPending ? "Đang gửi..." : "Gửi tin nhắn"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
