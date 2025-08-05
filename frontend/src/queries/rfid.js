import { useQuery } from "@tanstack/react-query";

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
