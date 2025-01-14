import { SidebarProvider, SidebarTrigger } from "../src/components/ui/sidebar";
import { AppSidebar } from "../src/components/AppSidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
