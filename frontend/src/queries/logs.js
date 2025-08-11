import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useLogs(token, type = null) {
    return useQuery({
        queryKey: ["logs", type],
        queryFn: async () => {
            const url = new URL(`${backendUrl}/logs/`);
            if (type) {
                url.searchParams.append("type", type);
            }
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch logs");
            }
            return response.json();
        },
        enabled: !!token,
    });
}

export function useDeleteLog(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (logId) => {
            const response = await fetch(`${backendUrl}/logs/${logId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete log");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logs"] });
        },
    });
}
