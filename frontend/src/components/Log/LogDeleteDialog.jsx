import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDeleteLog } from "@/queries/logs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LogDeleteDialog({ isOpen, onClose, logId, logMessage }) {
    const { token } = useAuth();
    const deleteLogMutation = useDeleteLog(token);

    const handleDelete = async () => {
        try {
            await deleteLogMutation.mutateAsync(logId);
            toast.success("Xóa log thành công!");
            onClose();
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa log");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xóa log</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa log này không? Hành động này không thể hoàn tác.
                        <br />
                        <br />
                        <strong>Tin nhắn:</strong> {logMessage}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={deleteLogMutation.isPending}>
                        {deleteLogMutation.isPending ? "Đang xóa..." : "Xóa"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
