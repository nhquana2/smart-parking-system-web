import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Clock, IdCard } from "lucide-react";
import { useDeviceInfo } from "@/queries/deviceStatus";
import { useAuth } from "@/contexts/AuthContext";

export default function RFIDStatusCard() {
    const { token } = useAuth();
    const { data: deviceInfo, isLoading, error } = useDeviceInfo(token);

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
        } catch {
            return "Invalid date";
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        RFID Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">Đang tải...</div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        RFID Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-red-500 py-8">Lỗi khi tải dữ liệu</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    RFID Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Trạng thái:</span>
                        <Badge variant={deviceInfo?.rfidUID ? "default" : "secondary"}>{deviceInfo?.rfidUID ? "Hoạt động" : "Không hoạt động"}</Badge>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <IdCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div className="flex-1">
                                <div className="text-sm font-medium">UID gần nhất:</div>
                                <div className="text-sm text-muted-foreground font-mono">{deviceInfo?.rfidUID || "N/A"}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <div className="flex-1">
                                <div className="text-sm font-medium">Lần đọc cuối:</div>
                                <div className="text-sm text-muted-foreground">{formatDateTime(deviceInfo?.rfidLastRead)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
