import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteRfidCard } from "@/queries/rfid";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function RfidDeleteDialog({ isOpen, onClose, rfidData }) {
    const { token } = useAuth();
    const deleteMutation = useDeleteRfidCard(token);

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(rfidData.uid);
            toast.success("Xóa thẻ RFID thành công");
            onClose();
        } catch (error) {
            toast.error("Lỗi khi xóa thẻ RFID");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <DialogTitle>Xóa thẻ RFID</DialogTitle>
                            <DialogDescription>Bạn có chắc chắn xóa thẻ này không?</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                {rfidData && (
                    <div className="space-y-2 rounded-lg bg-gray-100 p-3">
                        <div className="text-sm">
                            <span className="font-medium">UID:</span> {rfidData.uid}
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Số dư:</span>{" "}
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(rfidData.balance)}
                        </div>
                        <div className="text-sm">
                            <span className="font-medium">Trạng thái:</span> {rfidData.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        </div>
                    </div>
                )}
                <p className="text-sm text-muted-foreground">Hành động này không thể hoàn tác. Thẻ RFID sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
                        Hủy
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
