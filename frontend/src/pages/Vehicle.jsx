import { useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { columns } from "@/components/Vehicle/columns";
import { DataTable } from "@/components/DataTable";
import { useVehicles } from "@/queries/vehicle";
import { useAuth } from "@/contexts/AuthContext";

export default function Vehicle() {
    const { token } = useAuth();
    const [statusFilter, setStatusFilter] = useState("parking");
    const { data = [], isLoading, error } = useVehicles(token, statusFilter === "all" ? null : statusFilter);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const licensePlate = row.getValue("licensePlate");
            return licensePlate?.toLowerCase().includes(filterValue.toLowerCase()) ?? false;
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
            <AppHeader pageName="Quản lý xe" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-4 lg:px-6">
                            <div>
                                <h2 className="text-lg font-bold">Quản lý xe</h2>
                                <p className="text-muted-foreground text-sm mt-2">Quản lý thông tin xe trong bãi đỗ</p>
                            </div>
                        </div>

                        <div className="px-4 lg:px-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm theo biển số xe..."
                                        value={globalFilter ?? ""}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Lọc theo trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="parking">Đang đỗ</SelectItem>
                                        <SelectItem value="exit">Đã ra</SelectItem>
                                    </SelectContent>
                                </Select>
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
        </>
    );
}
