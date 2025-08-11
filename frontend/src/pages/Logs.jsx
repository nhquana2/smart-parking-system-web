import { useState } from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { AppHeader } from "@/components/AppHeader";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { columns } from "@/components/Log/columns";
import { DataTable } from "@/components/DataTable";
import { useLogs } from "@/queries/logs";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Logs() {
    const { token } = useAuth();
    const [typeFilter, setTypeFilter] = useState("all");
    const { data = [], isLoading, error } = useLogs(token, typeFilter === "all" ? null : typeFilter);
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const message = row.getValue("message");
            const type = row.getValue("type");
            const searchValue = filterValue.toLowerCase();

            return message?.toLowerCase().includes(searchValue) || type?.toLowerCase().includes(searchValue);
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <>
            <AppHeader pageName="Log hệ thống" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-4 px-4 lg:px-6">
                            <div>
                                <h2 className="text-lg font-bold">Log hệ thống</h2>
                                <p className="text-muted-foreground text-sm mt-2">Xem và quản lý nhật ký hoạt động của hệ thống</p>
                            </div>
                        </div>

                        <div className="px-4 lg:px-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm log..."
                                        value={globalFilter ?? ""}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Lọc theo loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả loại</SelectItem>
                                        <SelectItem value="vehicle_in">Xe vào</SelectItem>
                                        <SelectItem value="vehicle_out">Xe ra</SelectItem>
                                        <SelectItem value="device">Thiết bị</SelectItem>
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
