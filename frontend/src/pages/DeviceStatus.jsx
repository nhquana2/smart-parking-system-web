import { AppHeader } from "@/components/AppHeader";
import CameraStatusCard from "@/components/DeviceStatus/CameraStatusCard";
import RFIDStatusCard from "@/components/DeviceStatus/RFIDStatusCard";

export default function DeviceStatus() {
    return (
        <>
            <AppHeader pageName="Trạng thái thiết bị" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-4 px-4 lg:px-6">
                            <div>
                                <h2 className="text-lg font-bold">Trạng thái thiết bị</h2>
                                <p className="text-muted-foreground text-sm mt-2">Theo dõi trạng thái và hoạt động của các thiết bị trong hệ thống</p>
                            </div>
                        </div>

                        <div className="px-4 lg:px-6">
                            <div className="grid items-start gap-6 md:grid-cols-2">
                                <CameraStatusCard />
                                <RFIDStatusCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
