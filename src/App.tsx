import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing, Login, Register, Dashboard, Inventory, Employees, Orders, Meetings, Mail, Chat, Analytics, Settings, NotFound, LogNotFound } from "./pages/Index"
import ProtectedRoute from "./context/auth/ProtectedRoute";
import { AuthProvider } from "./context/auth/AuthContext";

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
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="meetings" element={<Meetings />} />
                  <Route path="mail" element={<Mail />} />
                  <Route path="chat" element={<Chat />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
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
