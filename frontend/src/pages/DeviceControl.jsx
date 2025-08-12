import { AppHeader } from "@/components/AppHeader";
import LCDControlCard from "@/components/DeviceControl/LCDControlCard";
import BuzzerControlCard from "@/components/DeviceControl/BuzzerControlCard";
import ServoControlCard from "@/components/DeviceControl/ServoControlCard";

export default function DeviceControl() {
    return (
        <>
            <AppHeader pageName="Điều khiển thiết bị" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-4 px-4 lg:px-6">
                            <div>
                                <h2 className="text-lg font-bold">Điều khiển thiết bị</h2>
                                <p className="text-muted-foreground text-sm mt-2">Điều khiển và quản lý các thiết bị trong hệ thống</p>
                            </div>
                        </div>

                        <div className="px-4 lg:px-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <LCDControlCard />
                                <BuzzerControlCard />
                                <ServoControlCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
