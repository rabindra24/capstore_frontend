import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    Calendar,
    MessageSquare,
    BarChart3,
    Settings,
    Mail,
    CheckSquare,
} from "lucide-react";

const navigationItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Employees",
        url: "/employees",
        icon: Users,
    },
    {
        title: "My Tasks",
        url: "/my-tasks",
        icon: CheckSquare,
    },

    {
        title: "Orders",
        url: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "Customers",
        url: "/customers",
        icon: Users,
    },
    {
        title: "Mail",
        url: "/mail",
        icon: Mail,
    },
    {
        title: "Messages",
        url: "/chat",
        icon: MessageSquare,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Inventory",
        url: "/inventory",
        icon: Package,
    },
    {
        title: "Meetings",
        url: "/meetings",
        icon: Calendar,
    },
];

const settingsItems = [
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export { settingsItems, navigationItems }