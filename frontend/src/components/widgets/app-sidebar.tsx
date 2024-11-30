import { Construction, Tractor, Train, Clipboard, Hammer } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shared/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Обладнання",
    url: "#",
    icon: Tractor,
  },
  {
    title: "Обслуговування",
    url: "#",
    icon: Construction,
  },
  {
    title: "Звіти",
    url: "#",
    icon: Clipboard,
  },
  {
    title: "Інвентаризація",
    url: "#",
    icon: Hammer,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-72">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="h-8 w-full text-xl">
            Українська Залізниця
            <Train className="ml-4" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="my-2">
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-lg ">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
