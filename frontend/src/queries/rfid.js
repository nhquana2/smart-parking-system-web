import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useRfidCards(token) {
    return useQuery({
        queryKey: ["rfidCards"],
        queryFn: async () => {
            const response = await fetch(`${backendUrl}/rfid/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch RFID cards");
            }
            return response.json();
        },
        enabled: !!token,
    });
}

export function useCreateRfidCard(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (rfidData) => {
            const response = await fetch(`${backendUrl}/rfid/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(rfidData),
            });
            if (!response.ok) {
                throw new Error("Failed to create RFID card");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rfidCards"] });
        },
    });
}

export function useUpdateRfidCard(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ uid, ...rfidData }) => {
            const response = await fetch(`${backendUrl}/rfid/${uid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ uid, ...rfidData }),
            });
            if (!response.ok) {
                throw new Error("Failed to update RFID card");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rfidCards"] });
        },
    });
}

export function useDeleteRfidCard(token) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (uid) => {
            const response = await fetch(`${backendUrl}/rfid/${uid}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete RFID card");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rfidCards"] });
        },
    });
}
