import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateVehicle } from "@/queries/vehicle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

export default function VehicleFormDialog({ isOpen, onClose, mode, vehicle }) {
    const { token } = useAuth();
    const updateVehicleMutation = useUpdateVehicle(token);

    const [formData, setFormData] = useState({
        licensePlate: "",
        rfidUID: "",
        status: "parking",
        timeIn: "",
        timeOut: "",
        fee: 0,
    });

    useEffect(() => {
        if (mode === "edit" && vehicle) {
            setFormData({
                licensePlate: vehicle.licensePlate || "",
                rfidUID: vehicle.rfidUID || "",
                status: vehicle.status || "parking",
                timeIn: vehicle.timeIn ? formatDateTimeLocal(vehicle.timeIn) : "",
                timeOut: vehicle.timeOut ? formatDateTimeLocal(vehicle.timeOut) : "",
                fee: vehicle.fee || 0,
            });
        } else {
            setFormData({
                licensePlate: "",
                rfidUID: "",
                status: "parking",
                timeIn: "",
                timeOut: "",
                fee: 0,
            });
        }
    }, [mode, vehicle, isOpen]);

    // Helper function to format datetime for datetime-local input
    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        // Check if date is valid
        if (isNaN(date.getTime())) return "";

        // Convert to local timezone for the input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submitData = {
            licensePlate: formData.licensePlate,
            rfidUID: formData.rfidUID,
            status: formData.status,
            timeIn: formData.timeIn ? new Date(formData.timeIn).toISOString() : null,
            timeOut: formData.timeOut ? new Date(formData.timeOut).toISOString() : null,
            fee: formData.status === "exit" ? Number(formData.fee) : null,
        };

        // Remove timeOut and fee if status is parking
        if (submitData.status === "parking") {
            submitData.timeOut = null;
            submitData.fee = null;
        }

        try {
            if (mode === "edit") {
                await updateVehicleMutation.mutateAsync({
                    id: vehicle.id,
                    vehicleData: submitData,
                });
                toast.success("Cập nhật xe thành công!");
            }
            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra: " + error.message);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Chỉnh sửa xe" : "Thêm xe mới"}</DialogTitle>
                    <DialogDescription>
                        {mode === "edit" ? "Cập nhật thông tin xe. RFID UID không thể thay đổi." : "Thêm xe mới vào hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="licensePlate">Biển số xe</Label>
                        <Input
                            id="licensePlate"
                            value={formData.licensePlate}
                            onChange={(e) => handleInputChange("licensePlate", e.target.value)}
                            placeholder="50A00001"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rfidUID">RFID UID</Label>
                        <Input
                            id="rfidUID"
                            value={formData.rfidUID}
                            onChange={(e) => handleInputChange("rfidUID", e.target.value)}
                            placeholder="1BEFD07A"
                            disabled={mode === "edit"}
                            className={mode === "edit" ? "bg-gray-100" : ""}
                            required
                        />
                        {mode === "edit" && <p className="text-sm text-muted-foreground">RFID UID không thể thay đổi</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="parking">Đang đỗ</SelectItem>
                                <SelectItem value="exit">Đã ra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timeIn">Thời gian vào</Label>
                        <div className="relative">
                            {/* <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                            <Input
                                id="timeIn"
                                type="datetime-local"
                                value={formData.timeIn}
                                onChange={(e) => handleInputChange("timeIn", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {formData.status === "exit" && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="timeOut">Thời gian ra</Label>
                                <div className="relative">
                                    <Input
                                        id="timeOut"
                                        type="datetime-local"
                                        value={formData.timeOut}
                                        onChange={(e) => handleInputChange("timeOut", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fee">Phí đỗ xe (VND)</Label>
                                <Input
                                    id="fee"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    value={formData.fee}
                                    onChange={(e) => handleInputChange("fee", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={updateVehicleMutation.isPending}>
                            {updateVehicleMutation.isPending ? "Đang xử lý..." : mode === "edit" ? "Cập nhật" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
