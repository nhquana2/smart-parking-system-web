import { useState, useEffect } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFeeConfig, useUpdateFeeConfig } from "@/queries/feeConfig";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Save, DollarSign } from "lucide-react";

export default function FeeConfig() {
    const { token } = useAuth();
    const { data: feeConfig, isLoading, error } = useFeeConfig(token);
    const updateFeeConfigMutation = useUpdateFeeConfig(token);

    const [formData, setFormData] = useState({
        pricePerHour: 0,
        multiplier: 0,
        maximumPrice: 0,
        additionalCharge: 0,
    });

    useEffect(() => {
        if (feeConfig) {
            setFormData({
                pricePerHour: feeConfig.pricePerHour || 0,
                multiplier: feeConfig.multiplier || 0,
                maximumPrice: feeConfig.maximumPrice || 0,
                additionalCharge: feeConfig.additionalCharge || 0,
            });
        }
    }, [feeConfig]);

    const handleInputChange = (field, value) => {
        const numericValue = parseFloat(value) || 0;
        setFormData((prev) => ({
            ...prev,
            [field]: numericValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateFeeConfigMutation.mutateAsync(formData);
            toast.success("Cập nhật cấu hình giá thành công!");
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật cấu hình giá");
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value);
    };

    if (isLoading) {
        return (
            <>
                <AppHeader pageName="Cài đặt giá" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="text-center py-8">Đang tải dữ liệu...</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AppHeader pageName="Cài đặt giá" />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="text-center py-8 text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AppHeader pageName="Cài đặt giá" />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="flex flex-col gap-4 px-4 lg:px-6">
                            <div>
                                <h2 className="text-lg font-bold">Cài đặt giá</h2>
                                <p className="text-muted-foreground text-sm mt-2">Cấu hình giá dịch vụ bãi xe</p>
                            </div>

                            <div className="w-full">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5" />
                                            Cấu hình giá dịch vụ
                                        </CardTitle>
                                        <CardDescription>Thiết lập giá cước và các thông số tính phí cho hệ thống bãi xe</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="pricePerHour">Giá mỗi giờ (VND)</Label>
                                                    <Input
                                                        id="pricePerHour"
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        value={formData.pricePerHour}
                                                        onChange={(e) => handleInputChange("pricePerHour", e.target.value)}
                                                        placeholder="5000"
                                                    />
                                                    <p className="text-sm text-muted-foreground">Hiện tại: {formatCurrency(formData.pricePerHour)}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="multiplier">Hệ số nhân (Multiplier)</Label>
                                                    <Input
                                                        id="multiplier"
                                                        type="number"
                                                        min="1"
                                                        step="0.1"
                                                        value={formData.multiplier}
                                                        onChange={(e) => handleInputChange("multiplier", e.target.value)}
                                                        placeholder="1.5"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Hệ số nhân cho các giờ tiếp theo: {formData.multiplier}x
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="maximumPrice">Giá tối đa/ngày (VND)</Label>
                                                    <Input
                                                        id="maximumPrice"
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        value={formData.maximumPrice}
                                                        onChange={(e) => handleInputChange("maximumPrice", e.target.value)}
                                                        placeholder="50000"
                                                    />
                                                    <p className="text-sm text-muted-foreground">Hiện tại: {formatCurrency(formData.maximumPrice)}</p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="additionalCharge">Phí dịch vụ thêm (VND)</Label>
                                                    <Input
                                                        id="additionalCharge"
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        value={formData.additionalCharge}
                                                        onChange={(e) => handleInputChange("additionalCharge", e.target.value)}
                                                        placeholder="2000"
                                                    />
                                                    <p className="text-sm text-muted-foreground">
                                                        Hiện tại: {formatCurrency(formData.additionalCharge)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="border-t pt-6">
                                                <div className="bg-muted/50 p-4 rounded-lg">
                                                    <h4 className="font-medium mb-2">Ví dụ tính phí:</h4>
                                                    <div className="text-sm text-muted-foreground space-y-1">
                                                        <p>• Giờ đầu tiên: {formatCurrency(formData.pricePerHour)}</p>
                                                        <p>• Các giờ tiếp theo: {formatCurrency(formData.pricePerHour * formData.multiplier)}/giờ</p>
                                                        <p>• Phí dịch vụ: {formatCurrency(formData.additionalCharge)}</p>
                                                        <p>• Tối đa mỗi ngày: {formatCurrency(formData.maximumPrice)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={updateFeeConfigMutation.isPending} className="min-w-32">
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {updateFeeConfigMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
