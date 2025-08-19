import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDashboardChartData } from "@/queries/dashboard";
import { useAuth } from "@/contexts/AuthContext";

export const description = "An interactive area chart";

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    revenue: {
        label: "D.thu",
        color: "var(--primary)",
    },
    vehicleCount: {
        label: "Số xe",
        color: "var(--chart-2)",
    },
};

export function StatChart() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState("90d");
    const { user, token } = useAuth();

    const { data: chartDataResponse, isLoading, error } = useDashboardChartData(token);

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d");
        }
    }, [isMobile]);

    const chartData = chartDataResponse?.chartData || [];

    const formatCurrency = (value) => {
        try {
            return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(value) + " ₫";
        } catch (e) {
            return value;
        }
    };

    const formatInteger = (value) => (Number.isFinite(value) ? value : "-");

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return date >= startDate;
    });

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardTitle>Thống kê doanh thu và số xe</CardTitle>
                <CardDescription>
                    <span className="hidden @[540px]/card:block">Total for the last 3 months</span>
                    <span className="@[540px]/card:hidden">Last 3 months</span>
                </CardDescription>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-[250px] w-full">
                        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-[250px] w-full">
                        <div className="text-red-500">Lỗi khi tải dữ liệu biểu đồ</div>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={1.0} />
                                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="fillVehicleCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-vehicleCount)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--color-vehicleCount)" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            {/* Left axis for vehicle count (small numbers) */}
                            <YAxis
                                yAxisId="left"
                                tickFormatter={formatInteger}
                                allowDecimals={false}
                                tickLine={false}
                                axisLine={false}
                                width={48}
                                domain={[0, "dataMax"]}
                                tickCount={5}
                            />
                            {/* Right axis for revenue (separate scale) */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickFormatter={formatCurrency}
                                tickLine={false}
                                axisLine={false}
                                width={96}
                                domain={[0, "auto"]}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        }}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                yAxisId="left"
                                dataKey="vehicleCount"
                                type="natural"
                                fill="url(#fillVehicleCount)"
                                stroke="var(--color-vehicleCount)"
                                fillOpacity={0.9}
                            />
                            <Area
                                yAxisId="right"
                                dataKey="revenue"
                                type="natural"
                                fill="url(#fillRevenue)"
                                stroke="var(--color-revenue)"
                                fillOpacity={0.9}
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
