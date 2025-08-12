import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useLCDControl(token) {
    return useMutation({
        mutationFn: async ({ line1, line2 }) => {
            const response = await fetch(`${backendUrl}/device-control/lcd/display`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ line1, line2 }),
            });
            if (!response.ok) {
                throw new Error("Failed to send LCD message");
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success("Đã gửi tin nhắn LCD thành công!");
        },
        onError: () => {
            toast.error("Không thể gửi tin nhắn LCD");
        },
    });
}

export function useBuzzerControl(token) {
    return useMutation({
        mutationFn: async () => {
            const response = await fetch(`${backendUrl}/device-control/buzzer/play`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to play buzzer");
            }
            return response.json();
        },
        onSuccess: () => {
            toast.success("Đã kích hoạt buzzer thành công!");
        },
        onError: () => {
            toast.error("Không thể kích hoạt buzzer");
        },
    });
}

export function useServoControl(token) {
    return useMutation({
        mutationFn: async (action) => {
            const response = await fetch(`${backendUrl}/device-control/servo/${action}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Failed to ${action} servo`);
            }
            return response.json();
        },
        onSuccess: (data, action) => {
            toast.success(`Đã ${action === "open" ? "mở" : "đóng"} servo thành công!`);
        },
        onError: () => {
            toast.error("Không thể điều khiển servo");
        },
    });
}
