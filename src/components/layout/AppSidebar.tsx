import { NavLink, useLocation } from "react-router-dom";
import {
  Brain,
  LogOut,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { navigationItems, settingsItems } from "@/constant/Sidebar";
import HoverSuggestion from "../helpers/HoverSuggestion";
import { useAuth } from "@/context/auth/AuthContext";
import { useState, useEffect } from "react";
import { businessAPI } from "@/lib/api";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const [companyName, setCompanyName] = useState("VirtuWork");

  useEffect(() => {
    // Fetch company name from business settings
    const fetchBusinessSettings = async () => {
      try {
        const { data } = await businessAPI.getSettings();
        if (data.settings?.companyName) {
          setCompanyName(data.settings.companyName);
        }
      } catch (error) {
        console.log("Using default company name");
      }
    };
    fetchBusinessSettings();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const getNavClass = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground font-medium shadow-button"
      : "hover:bg-sidebar-accent transition-smooth";

  // Helper function to check if user has permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    // Admins and super admins have all permissions
    if (user.role === "admin" || user.role === "super_admin") return true;
    // Check if employee has the permission
    return user.permissions?.includes(permission) || false;
  };

  // Map navigation items to their required permissions
  const permissionMap: Record<string, string> = {
    "Dashboard": "dashboard",
    "Inventory": "inventory",
    "Employees": "employees", // Only admins can access
    "Orders": "orders",
    "Customers": "customers",
    "Meetings": "meetings",
    "Mail": "mail",
    "Messages": "messages",
    "Chat": "chat",
    "Analytics": "analytics",
  };

  // Filter navigation items based on permissions
  const filteredNavItems = navigationItems.filter(item => {
    const requiredPermission = permissionMap[item.title];
    if (!requiredPermission) return true; // Show if no permission required
    if (item.title === "Employees") {
      // Only admins can access Employees
      return user?.role === "admin" || user?.role === "super_admin";
    }
    return hasPermission(requiredPermission);
  });

  // Filter settings items - only admins
  const filteredSettingsItems = (user?.role === "admin" || user?.role === "super_admin")
    ? settingsItems
    : [];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{companyName}</span>
              <span className="text-xs text-muted-foreground">
                {user?.name || "User"}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item, idx) => (
                <SidebarMenuItem key={item.title}>
                  <HoverSuggestion content={`${item.title} ctrl + ${idx + 1}`}>

                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={getNavClass(isActive(item.url))}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </HoverSuggestion>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredSettingsItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSettingsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={getNavClass(isActive(item.url))}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}