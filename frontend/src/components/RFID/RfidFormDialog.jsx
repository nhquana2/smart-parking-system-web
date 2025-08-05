import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateRfidCard, useUpdateRfidCard } from "@/queries/rfid";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function RfidFormDialog({ isOpen, onClose, rfidData = null, mode = "create" }) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        uid: "",
        balance: 0,
        status: "active",
    });

    const createMutation = useCreateRfidCard(token);
    const updateMutation = useUpdateRfidCard(token);

    useEffect(() => {
        if (rfidData && mode === "edit") {
            setFormData({
                uid: rfidData.uid,
                balance: rfidData.balance,
                status: rfidData.status,
            });
        } else {
            setFormData({
                uid: "",
                balance: 0,
                status: "active",
            });
        }
    }, [rfidData, mode, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.uid.trim()) {
            toast.error("UID không được để trống");
            return;
        }

        const submitData = {
            uid: formData.uid,
            balance: Number(formData.balance),
            status: formData.status,
            dateAdded: new Date().toISOString(), // This will be overridden by backend with server timestamp
        };

        try {
            if (mode === "create") {
                await createMutation.mutateAsync(submitData);
                toast.success("Thêm thẻ RFID thành công");
            } else {
                await updateMutation.mutateAsync(submitData);
                toast.success("Cập nhật thẻ RFID thành công");
            }
            onClose();
        } catch (error) {
            const errorMessage = error.message || (mode === "create" ? "Lỗi khi thêm thẻ RFID" : "Lỗi khi cập nhật thẻ RFID");
            toast.error(errorMessage);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Thêm thẻ RFID mới" : "Chỉnh sửa thẻ RFID"}</DialogTitle>
                    <DialogDescription>
                        {mode === "create" ? "Nhập thông tin để thêm thẻ RFID mới vào hệ thống" : "Cập nhật thông tin thẻ RFID"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="uid">UID</Label>
                        <Input
                            id="uid"
                            value={formData.uid}
                            onChange={(e) => handleInputChange("uid", e.target.value)}
                            placeholder="Nhập UID thẻ RFID"
                            disabled={mode === "edit" || isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="balance">Số dư (VND)</Label>
                        <Input
                            id="balance"
                            type="number"
                            value={formData.balance}
                            onChange={(e) => handleInputChange("balance", e.target.value)}
                            placeholder="Nhập số dư"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Hoạt động</SelectItem>
                                <SelectItem value="inactive">Không hoạt động</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang xử lý..." : mode === "create" ? "Thêm" : "Cập nhật"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
