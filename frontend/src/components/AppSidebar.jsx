import {
    Calendar,
    Home,
    Inbox,
    Search,
    Settings,
    CarFront,
    CreditCard,
    Car,
    Coins,
    ScrollText,
    Microchip,
    ChevronUp,
    LogOut,
    User,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useAuth } from "@/contexts/AuthContext";

// Sidebar sections and items.
const sidebarSections = [
    {
        label: "Quản lý bãi xe",
        items: [
            {
                title: "Tổng quan",
                url: "/dashboard",
                icon: Home,
            },
            {
                title: "Quản lý thẻ RFID",
                url: "/rfid",
                icon: CreditCard,
            },
            {
                title: "Quản lý xe",
                url: "/vehicle",
                icon: Car,
            },
            {
                title: "Cài đặt giá",
                url: "/fee-config",
                icon: Coins,
            },
            {
                title: "Log hệ thống",
                url: "/logs",
                icon: ScrollText,
            },
        ],
    },
    {
        label: "Quản lý thiết bị",
        items: [
            {
                title: "Trạng thái thiết bị",
                url: "#",
                icon: Microchip,
            },
            {
                title: "Điều khiển thiết bị",
                url: "#",
                icon: Microchip,
            },
        ],
    },
    // Add more sections here if needed
];

export function AppSidebar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="text-sidebar-accent-foreground" asChild>
                            <NavLink to="/" end>
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <CarFront className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-bold text-base">Bãi xe thông minh</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {sidebarSections.map((section) => (
                    <SidebarGroup key={section.label}>
                        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => {
                                    const isActive = location.pathname === item.url;
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <NavLink to={item.url} end>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User />
                                    {user?.email || "Username"}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarFallback className="rounded-lg">
                                                <User />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-normal">
                                            <span className="truncate font-small">{user?.email || "Chưa đăng nhập"}</span>
                                            <span className="text-muted-foreground truncate text-xs">{user?.uid || ""}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
