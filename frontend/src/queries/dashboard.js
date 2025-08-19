import { useQuery } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useDashboardStats(token) {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            const response = await fetch(`${backendUrl}/dashboard/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch dashboard stats");
            }
            return response.json();
        },
        enabled: !!token,
        refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    });
}

export function useDashboardChartData(token) {
    return useQuery({
        queryKey: ["dashboard", "chart-data"],
        queryFn: async () => {
            const response = await fetch(`${backendUrl}/dashboard/chart-data`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch chart data");
            }
            return response.json();
        },
        enabled: !!token,
        refetchInterval: 60000, // Refetch every 60 seconds
    });
}
