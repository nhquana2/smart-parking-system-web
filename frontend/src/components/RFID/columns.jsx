import { Button } from "@/components/ui/button";

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
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                        Chỉnh sửa
                    </Button>
                    <Button variant="outline" size="sm">
                        Xóa
                    </Button>
                </div>
            );
        },
    },
];
