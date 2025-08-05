import { useState } from "react";
import { Button } from "@/components/ui/button";
import RfidFormDialog from "./RfidFormDialog";
import RfidDeleteDialog from "./RfidDeleteDialog";
import { Edit, Trash2 } from "lucide-react";

const ActionsCell = ({ row }) => {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const rfidData = row.original;

    return (
        <>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)} className="h-8">
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)} className="h-8 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                    Xóa
                </Button>
            </div>

            <RfidFormDialog isOpen={showEditDialog} onClose={() => setShowEditDialog(false)} rfidData={rfidData} mode="edit" />

            <RfidDeleteDialog isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} rfidData={rfidData} />
        </>
    );
};

export const columns = [
    {
        accessorKey: "uid",
        header: "UID",
    },
    {
        accessorKey: "balance",
        header: "Số dư",
        cell: ({ row }) => {
            const amount = parseInt(row.getValue("balance"));
            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status");
            return status === "active" ? "Hoạt động" : "Không hoạt động";
        },
    },
    {
        accessorKey: "dateAdded",
        header: "Ngày thêm",
        cell: ({ row }) => {
            const dateValue = row.getValue("dateAdded");
            if (!dateValue) return "-";

            let date;
            if (dateValue._seconds) {
                // Firestore timestamp format
                date = new Date(dateValue._seconds * 1000);
            } else if (typeof dateValue === "string") {
                date = new Date(dateValue);
            } else {
                date = dateValue;
            }

            return date.toLocaleDateString("vi-VN");
        },
    },
    {
        id: "actions",
        header: "Thao tác",
        cell: ActionsCell,
    },
];
