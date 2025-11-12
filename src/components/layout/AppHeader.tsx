import { Search, Bell, User, Menu, LayoutDashboard, Package, Users, ShoppingCart, Calendar, MessageSquare, BarChart3, Settings, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import HoverSuggestion from "../helpers/HoverSuggestion";

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Employees", url: "/employees", icon: Users },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Meetings", url: "/meetings", icon: Calendar },
  { title: "Mail", url: "/mail", icon: Mail },
  { title: "Messages", url: "/chat", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppHeader() {
  const [user, setUser] = useState({ name: 'Rabindra', role: 'Admin' });
  const navigate = useNavigate();
  const search = useRef(null);
  const { state } = useSidebar();
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        search.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
  }, [])
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 shadow-card">
      {/* Left side - Sidebar trigger and search */}
      <div className="flex items-center gap-4">
        <HoverSuggestion  content={`${state === 'collapsed' ? 'Expand' : 'Collapse'}`}>
          <SidebarTrigger className="hover:bg-sidebar-accent" />
        </HoverSuggestion>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            ref={search}
            placeholder="Search (Ctrl + K)"
            className="pl-10 bg-sidebar-background border-sidebar-border focus:ring-primary"
          />
        </div>
      </div>

      {/* Center - Main Navigation */}
      {/* <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav> */}

      {/* Right side - Notifications and profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {/* <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button> */}

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => navigate('/')}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}