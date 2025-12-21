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
import { useEffect, useRef, useState } from "react";
import HoverSuggestion from "../helpers/HoverSuggestion";
import { useHotkey } from "@/lib/useHotKey";
export function AppHeader() {
  const [user, setUser] = useState({ name: 'Rabindra', role: 'Admin' });
  const navigate = useNavigate();
  const search = useRef(null);
  const { state, toggleSidebar } = useSidebar();
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
  // useHotkey('ctrl+5',()=>{
  //   navigate('/meetings')
  // })
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
  // useEffect(() => {


  //   const handleKeyDown = (e) => {
  //     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
  //       e.preventDefault();
  //       search.current?.focus();
  //     }
  //   }
  //   window.addEventListener('keydown', handleKeyDown);
  // }, [])
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