import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import VehicleFormDialog from "./VehicleFormDialog";
import VehicleDeleteDialog from "./VehicleDeleteDialog";

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
        accessorKey: "licensePlate",
        header: "Biển số xe",
        cell: ({ row }) => <div className="font-medium">{row.getValue("licensePlate")}</div>,
    },
    {
        accessorKey: "rfidUID",
        header: "RFID UID",
        cell: ({ row }) => <div>{row.getValue("rfidUID")}</div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status");
            return (
                <Badge
                    variant={status === "parking" ? "default" : "secondary"}
                    className={status === "parking" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                    {status === "parking" ? "Đang đỗ" : "Đã ra"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "timeIn",
        header: "Thời gian vào",
        cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue("timeIn"))}</div>,
    },
    {
        accessorKey: "timeOut",
        header: "Thời gian ra",
        cell: ({ row }) => <div className="text-sm">{formatDateTime(row.getValue("timeOut"))}</div>,
    },
    {
        accessorKey: "fee",
        header: "Phí đỗ xe",
        cell: ({ row }) => {
            const fee = row.getValue("fee");
            const status = row.original.status;

            if (status !== "exit" || fee === null || fee === undefined) {
                return <div className="text-sm">-</div>;
            }

            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(fee);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const vehicle = row.original;
            const [showEditDialog, setShowEditDialog] = useState(false);
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <VehicleFormDialog isOpen={showEditDialog} onClose={() => setShowEditDialog(false)} mode="edit" vehicle={vehicle} />

                    <VehicleDeleteDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} vehicle={vehicle} />
                </>
            );
        },
    },
];
