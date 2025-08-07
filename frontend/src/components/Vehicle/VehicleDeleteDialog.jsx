import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteVehicle } from "@/queries/vehicle";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function VehicleDeleteDialog({ isOpen, onClose, vehicle }) {
    const { token } = useAuth();
    const deleteVehicleMutation = useDeleteVehicle(token);

    const handleDelete = async () => {
        try {
            await deleteVehicleMutation.mutateAsync(vehicle.id);
            toast.success("Xóa xe thành công!");
            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa xe: " + error.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa xe</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa xe <strong>{vehicle?.licensePlate}</strong> không? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleteVehicleMutation.isPending}>
                        {deleteVehicleMutation.isPending ? "Đang xóa..." : "Xóa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
