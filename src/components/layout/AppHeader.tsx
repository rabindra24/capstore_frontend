import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";
import HoverSuggestion from "../helpers/HoverSuggestion";
import { useHotkey } from "@/lib/useHotKey";
import { useAuth } from "@/context/auth/AuthContext";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const search = useRef(null);
  const { state, toggleSidebar } = useSidebar();

  // Format role for display
  const formatRole = (role: string) => {
    if (role === "super_admin") return "Super Admin";
    if (role === "admin") return "Admin";
    if (role === "manager") return "Manager";
    return "Employee";
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useHotkey('ctrl+k', () => {
    search.current?.focus();
  })
  useHotkey('ctrl+1', () => {
    navigate('/dashboard')
  })
  useHotkey('ctrl+2', () => {
    navigate('/employees')
  })
  useHotkey('ctrl+3', () => {
    navigate('/orders')
  })
  useHotkey('ctrl+4', () => {
    navigate('/mail')
  })
  useHotkey('ctrl+5', () => {
    navigate('/chat')
  })
  useHotkey('ctrl+6', () => {
    navigate('/analytics')
  })
  useHotkey('ctrl+7', () => {
    navigate('/settings')
  })
  useHotkey('shift+c', () => {
    toggleSidebar()
  })

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-card">
      {/* Left side - Sidebar trigger and search */}
      <div className="flex items-center gap-4">
        <HoverSuggestion content={`shift + c`}>
          <SidebarTrigger className="hover:bg-sidebar-accent" />
        </HoverSuggestion>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={search}
            placeholder="Search [ctrl+k]"
            className="pl-10 bg-sidebar-background border-sidebar-border focus:ring-primary"
          />
        </div>
      </div>

      {/* Right side - Notifications and profile */}
      <div className="flex items-center gap-3">
        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground">{formatRole(user?.role || "employee")}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}