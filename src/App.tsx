import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing, Login, Register, Dashboard, Inventory, Employees, Orders, Customers, Meetings, Mail, Messages, Chat, Analytics, Settings, NotFound, LogNotFound, MyTasks } from "./pages/Index"
import ProtectedRoute from "./context/auth/ProtectedRoute";

import { AuthProvider } from "./context/auth/AuthContext";
import PermissionGuard from "./components/PermissionGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ai-business-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<PermissionGuard requiredPermission="dashboard"><Dashboard /></PermissionGuard>} />
                  <Route path="inventory" element={<PermissionGuard requiredPermission="inventory"><Inventory /></PermissionGuard>} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="my-tasks" element={<MyTasks />} />
                  <Route path="orders" element={<PermissionGuard requiredPermission="orders"><Orders /></PermissionGuard>} />

                  <Route path="customers" element={<PermissionGuard requiredPermission="customers"><Customers /></PermissionGuard>} />
                  <Route path="meetings" element={<PermissionGuard requiredPermission="meetings"><Meetings /></PermissionGuard>} />
                  <Route path="mail" element={<PermissionGuard requiredPermission="mail"><Mail /></PermissionGuard>} />
                  <Route path="messages" element={<PermissionGuard requiredPermission="messages"><Messages /></PermissionGuard>} />
                  <Route path="chat" element={<PermissionGuard requiredPermission="chat"><Chat /></PermissionGuard>} />
                  <Route path="analytics" element={<PermissionGuard requiredPermission="analytics"><Analytics /></PermissionGuard>} />
                  <Route path="settings" element={<PermissionGuard requiredPermission="settings"><Settings /></PermissionGuard>} />
                  {/* <Route path="/*" element={<LogNotFound />} /> */}
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);



export default App;
