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
