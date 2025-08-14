import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertCircle } from "lucide-react";
import { useRecentImage } from "@/queries/deviceStatus";
import { useAuth } from "@/contexts/AuthContext";

export default function CameraStatusCard() {
    const { token } = useAuth();
    const { data: imageUrl, isLoading, error } = useRecentImage(token);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Camera Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-auto bg-muted rounded-lg overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-muted-foreground">Đang tải...</div>
                        </div>
                    ) : error || !imageUrl ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center text-muted-foreground">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                <div className="text-sm">Không có hình ảnh</div>
                            </div>
                        </div>
                    ) : (
                        <img src={imageUrl} alt="Camera capture" className="w-full h-full object-fill" />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Trạng thái:</span>
                    <Badge variant={imageUrl ? "default" : "secondary"}>{imageUrl ? "Hoạt động" : "Không có dữ liệu"}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
