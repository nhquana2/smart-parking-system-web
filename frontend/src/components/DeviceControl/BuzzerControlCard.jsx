import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useBuzzerControl } from "@/queries/deviceControl";
import { useAuth } from "@/contexts/AuthContext";

export default function BuzzerControlCard() {
    const { token } = useAuth();
    const buzzerControl = useBuzzerControl(token);

    const handlePlay = () => {
        buzzerControl.mutate();
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-orange-600" />
                    <CardTitle>Điều khiển Buzzer</CardTitle>
                </div>
                <CardDescription>Kích hoạt âm thanh buzzer</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handlePlay} className="w-full" disabled={buzzerControl.isPending}>
                    {buzzerControl.isPending ? "Đang phát..." : "Phát âm thanh"}
                </Button>
            </CardContent>
        </Card>
    );
}
