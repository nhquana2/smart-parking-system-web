import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
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
} from "@/components/ui/sidebar";

// Menu items.
const items = [
    {
        title: "Tổng quan",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Quản lý thẻ RFID",
        url: "/inbox",
        icon: Inbox,
    },
    {
        title: "Quản lý xe",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Log hệ thống",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
];

export function AppSidebar() {
    const location = useLocation();
    return (
        <Sidebar collapsible="offcanvas" variant="inset">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Quản lý bãi xe</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
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
            </SidebarContent>
        </Sidebar>
    );
}
