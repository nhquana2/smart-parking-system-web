import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Get fee configuration
export function useFeeConfig(token) {
    return useQuery({
        queryKey: ["feeConfig"],
        queryFn: async () => {
            const response = await fetch(`${backendUrl}/fee-config/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch fee configuration");
            }
            return response.json();
        },
        enabled: !!token,
    });
}

// Update fee configuration
export function useUpdateFeeConfig(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (feeData) => {
            const response = await fetch(`${backendUrl}/fee-config/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(feeData),
            });
            if (!response.ok) {
                throw new Error("Failed to update fee configuration");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["feeConfig"] });
        },
    });
}
