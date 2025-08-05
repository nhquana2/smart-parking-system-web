import { useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Search } from "lucide-react";
import { columns } from "@/components/RFID/columns";
import { DataTable } from "@/components/DataTable";
import RfidFormDialog from "@/components/RFID/RfidFormDialog";
import { useRfidCards } from "@/queries/rfid";
import { useAuth } from "@/contexts/AuthContext";

export default function RFID() {
    const { token } = useAuth();
    const { data = [], isLoading, error } = useRfidCards(token);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const uid = row.getValue("uid");
            return uid?.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 7,
            },
        },
    });

    return (
        <>
            <AppHeader pageName="Quản lý thẻ RFID" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6">
                            <div>
                                <h2 className="text-lg font-bold">Quản lý thẻ RFID</h2>
                                <p className="text-muted-foreground text-sm mt-2">Thêm và quản lý thẻ RFID</p>
                            </div>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <CirclePlus />
                                Thêm thẻ RFID mới
                            </Button>
                        </div>

                        <div className="px-4 lg:px-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm theo UID..."
                                        value={globalFilter ?? ""}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">Đang tải dữ liệu...</div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
                            ) : (
                                <DataTable table={table} columns={columns} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <RfidFormDialog isOpen={showAddDialog} onClose={() => setShowAddDialog(false)} mode="create" />
        </>
    );
}
