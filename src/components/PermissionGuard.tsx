import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PermissionGuardProps {
    children: ReactNode;
    requiredPermission: string;
    fallbackPath?: string;
}

export default function PermissionGuard({
    children,
    requiredPermission,
    fallbackPath = "/dashboard",
}: PermissionGuardProps) {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkPermission = () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                navigate("/login");
                return;
            }

            const user = JSON.parse(userStr);

            // Admins and super admins have all permissions
            if (user.role === "admin" || user.role === "super_admin") {
                return;
            }

            // Check if employee has the required permission
            const permissions = user.permissions || [];
            if (!permissions.includes(requiredPermission)) {
                toast({
                    title: "Access Denied",
                    description: `You don't have permission to access this page. Required: ${requiredPermission}`,
                    variant: "destructive",
                });
                navigate(fallbackPath);
            }
        };

        checkPermission();
    }, [requiredPermission, fallbackPath, navigate, toast]);

    // Check permission before rendering
    const userStr = localStorage.getItem("user");
    if (!userStr) {
        return null;
    }

    const user = JSON.parse(userStr);

    // Admins bypass all checks
    if (user.role === "admin" || user.role === "super_admin") {
        return <>{children}</>;
    }

    // Check employee permission
    const permissions = user.permissions || [];
    if (!permissions.includes(requiredPermission)) {
        return null;
    }

    return <>{children}</>;
}
