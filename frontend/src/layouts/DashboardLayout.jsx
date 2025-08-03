import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
