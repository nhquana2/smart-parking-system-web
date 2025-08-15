import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertCircle, ArrowUp, ArrowDown, Microchip } from "lucide-react";
import { useState } from "react";
import LogDeleteDialog from "./LogDeleteDialog";

const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Enable 12-hour format with AM/PM
        timeZone: "Asia/Ho_Chi_Minh", // Explicitly set timezone for Vietnam
    });
};

export const columns = [
    {
        accessorKey: "type",
        header: "Loại",
        cell: ({ row }) => {
            const type = row.getValue("type");
            const getTypeConfig = (type) => {
                switch (type) {
                    case "vehicle_in":
                        return { label: "Xe vào", variant: "default", icon: ArrowUp };
                    case "vehicle_out":
                        return { label: "Xe ra", variant: "secondary", icon: ArrowDown };
                    case "device":
                        return { label: "Thiết bị", variant: "outline", icon: Microchip };
                    default:
                        return { label: type, variant: "outline", icon: AlertCircle };
                }
            };

            const config = getTypeConfig(type);
            const Icon = config.icon;

            return (
                <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
                    <Icon className="h-3 w-3" />
                    {config.label}
                </Badge>
            );
        },
    },
    {
        accessorKey: "message",
        header: "Tin nhắn",
        cell: ({ row }) => {
            const message = row.getValue("message");
            return <div className="max-w-[500px] break-words">{message}</div>;
        },
    },
    {
        accessorKey: "dateLogged",
        header: "Thời gian",
        cell: ({ row }) => {
            const date = row.getValue("dateLogged");
            return <div className="text-sm">{formatDateTime(date)}</div>;
        },
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ({ row, table }) => {
            const log = row.original;
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);

            return (
                <>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <LogDeleteDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} logId={log.id} logMessage={log.message} />
                </>
            );
        },
    },
];
