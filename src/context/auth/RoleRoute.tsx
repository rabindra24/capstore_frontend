import { useAuth } from "@/context/auth/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface RoleRouteProps {
    allowedRoles: string[];
    children: ReactNode;
    redirectTo?: string;
}

/**
 * Route wrapper that restricts access based on user role
 * Usage: <RoleRoute allowedRoles={["admin", "manager"]}>Page Content</RoleRoute>
 */
export function RoleRoute({ allowedRoles, children, redirectTo = "/dashboard" }: RoleRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const hasAccess = allowedRoles.includes(user.role);

    if (!hasAccess) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}
