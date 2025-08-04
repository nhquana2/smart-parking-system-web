import { Calendar, Home, Inbox, Search, Settings, CarFront, CreditCard, Car, Coins, ScrollText, Microchip } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                url: "/inbox",
                icon: CreditCard,
            },
            {
                title: "Quản lý xe",
                url: "#",
                icon: Car,
            },
            {
                title: "Cài đặt giá",
                url: "#",
                icon: Coins,
            },
            {
                title: "Log hệ thống",
                url: "#",
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
        </Sidebar>
    );
}
