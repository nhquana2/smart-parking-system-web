import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    CarFront,
    CreditCard,
    Car,
    Coins,
    ScrollText,
    Microchip,
    ChevronUp,
    LogOut,
    User,
} from "lucide-react";
import { useDashboardStats } from "@/queries/dashboard";
import { useAuth } from "@/contexts/AuthContext";

function StatCard({ description, title, icon, footer }) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription className="text-normal">{description}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{title}</CardTitle>
                <CardAction>{icon}</CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">{footer}</CardFooter>
        </Card>
    );
}

export function StatCards() {
    const { token } = useAuth();
    const { data: stats, isLoading, error } = useDashboardStats(token);

    // Format currency for display
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <StatCard
                description="Số xe trong bãi"
                title={isLoading ? "..." : stats?.vehiclesInParking || 0}
                icon={<CarFront />}
                footer={<div className="text-muted-foreground">Số xe đang giữ thời điểm hiện tại</div>}
            />
            <StatCard
                description="Số lượng thẻ RFID"
                title={isLoading ? "..." : stats?.activeRfidCount || 0}
                icon={<CreditCard />}
                footer={<div className="text-muted-foreground">Số thẻ RFID đang hoạt động</div>}
            />
            <StatCard
                description="Doanh thu trong ngày"
                title={isLoading ? "..." : formatCurrency(stats?.todayRevenue || 0)}
                icon={<Coins />}
                footer={<div className="text-muted-foreground">Doanh thu trong hôm nay</div>}
            />
            <StatCard
                description="Mức giá cơ bản"
                title={isLoading ? "..." : formatCurrency(stats?.basePricePerHour || 5000)}
                icon={<Badge variant="outline">Chưa gồm phí</Badge>}
                footer={<div className="text-muted-foreground">Giá cơ bản cho 1 giờ gửi</div>}
            />
        </div>
    );
}
