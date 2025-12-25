import { ReactNode } from "react";
import { useAuth } from "@/context/auth/AuthContext";

interface RoleBasedAccessProps {
    allowedRoles: string[];
    children: ReactNode;
    fallback?: ReactNode;
}

/**
 * Component to restrict UI elements based on user role
 * Usage: <RoleBasedAccess allowedRoles={["admin", "manager"]}>Content</RoleBasedAccess>
 */
export function RoleBasedAccess({ allowedRoles, children, fallback = null }: RoleBasedAccessProps) {
    const { user } = useAuth();

    if (!user) {
        return <>{fallback}</>;
    }

    const hasAccess = allowedRoles.includes(user.role);

    return hasAccess ? <>{children}</> : <>{fallback}</>;
}
