import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/shared/ui/sidebar";
import { AppSidebar } from "@/components/widgets/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="ml-10">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
