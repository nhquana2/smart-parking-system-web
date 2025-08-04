import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { columns } from "@/components/RFID/columns";
import { DataTable } from "@/components/DataTable";

function dummyGetData() {
    // Fetch data from your API here.
    return [
        {
            uid: "728ED52F",
            balance: 100,
            dateAdded: "July 31, 2025 at 11:13:05 PM UTC+7",
            status: "active",
        },
    ];
}

export default function RFID() {
    const data = dummyGetData();
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
                            <Button>
                                <CirclePlus />
                                Thêm thẻ RFID mới
                            </Button>
                        </div>
                        <div className="px-4 lg:px-6">
                            <DataTable columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
