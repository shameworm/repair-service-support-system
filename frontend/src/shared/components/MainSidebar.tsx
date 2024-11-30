import { Home, Wrench, FileText, Box, LogIn, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";
import { Separator } from "./separator";

import { RootState } from "../store";
import { authActions } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import routes from "~/config/routes";
import { Avatar } from "./avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const items = [
  {
    title: "Обладнання",
    url: "#",
    icon: Home,
  },
  {
    title: "Обслуговування",
    url: "#",
    icon: Wrench,
  },
  {
    title: "Звіт",
    url: "#",
    icon: FileText,
  },
  {
    title: "Інветаризація",
    url: "#",
    icon: Box,
  },
];

export function MainSidebar() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <Sidebar side="right" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          {isLoggedIn && (
            <SidebarGroupLabel>
              <Avatar>
                <AvatarImage src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fdefault-avatar&psig=AOvVaw0QvAzqNJuqb_sDdSPL6-JS&ust=1733068376895000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMD0gfq0hIoDFQAAAAAdAAAAABAE" />
              </Avatar>
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Separator />
              {!isLoggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href={routes.auth.login}>
                      <LogIn />
                      <span>Увійти</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isLoggedIn && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild onClick={handleLogout}>
                    <LogOut />
                    <span>Вийти</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
