import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/AppHeader";
import { StatCards } from "@/components/Dashboard/StatCards";
import { StatChart } from "@/components/Dashboard/StatChart";
export default function Dashboard() {
    return (
        <>
            <AppHeader pageName="Thông tin tổng quan" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <StatCards />
                        <div className="px-4 lg:px-6">
                            <StatChart />
                        </div>
                        {/* <DataTable data={data} /> */}
                    </div>
                </div>
            </div>
        </>
    );
}
