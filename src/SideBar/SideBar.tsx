import { AppSidebar } from "@/SideBar/app-sidebar";
import { SiteHeader } from "@/SideBar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="bg-muted/50 p-8 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
