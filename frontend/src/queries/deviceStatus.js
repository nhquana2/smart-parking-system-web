import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Get device info
export const useDeviceInfo = (token) => {
    return useQuery({
        queryKey: ["deviceInfo"],
        queryFn: async () => {
            const response = await fetch(`${backendUrl}/device-info/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch device info");
            }

            return response.json();
        },
        enabled: !!token,
        refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    });
};

// Get recent camera image
export const useRecentImage = (token) => {
    return useQuery({
        queryKey: ["recentImage"],
        queryFn: async () => {
            const response = await fetch(`${backendUrl}/plate/recent-image`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // No image available
                }
                throw new Error("Failed to fetch recent image");
            }

            // Return the blob URL for the image
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        },
        enabled: !!token,
        refetchInterval: 1000, // Refetch every 5 seconds for real-time updates
        staleTime: 0, // Always consider data stale to ensure fresh images
    });
};
