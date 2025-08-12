import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useServoControl } from "@/queries/deviceControl";
import { useAuth } from "@/contexts/AuthContext";

export default function ServoControlCard() {
    const { token } = useAuth();
    const servoControl = useServoControl(token);

    const handleOpen = () => {
        servoControl.mutate("open");
    };

    const handleClose = () => {
        servoControl.mutate("close");
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    <CardTitle>Điều khiển Servo</CardTitle>
                </div>
                <CardDescription>Điều khiển động cơ servo mở/đóng</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Button onClick={handleOpen} className="flex-1" disabled={servoControl.isPending} variant="default">
                        {servoControl.isPending ? "Đang xử lý..." : "Mở"}
                    </Button>
                    <Button onClick={handleClose} className="flex-1" disabled={servoControl.isPending} variant="outline">
                        {servoControl.isPending ? "Đang xử lý..." : "Đóng"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
