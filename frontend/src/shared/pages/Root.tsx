import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../components/sidebar";

import MainNavigation from "~/shared/components/MainNavigation";

export function RootLayout() {
  return (
    <SidebarProvider>
      <MainNavigation />
      <main className="mt-20">
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
