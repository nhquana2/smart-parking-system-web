import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useVehicles(token, status = null) {
    return useQuery({
        queryKey: ["vehicles", status],
        queryFn: async () => {
            const url = new URL(`${backendUrl}/vehicles/`);
            if (status) {
                url.searchParams.append("status", status);
            }
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch vehicles");
            }
            return response.json();
        },
        enabled: !!token,
    });
}

export function useUpdateVehicle(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, vehicleData }) => {
            const response = await fetch(`${backendUrl}/vehicles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(vehicleData),
            });
            if (!response.ok) {
                throw new Error("Failed to update vehicle");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });
}

export function useDeleteVehicle(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await fetch(`${backendUrl}/vehicles/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete vehicle");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
        },
    });
}
