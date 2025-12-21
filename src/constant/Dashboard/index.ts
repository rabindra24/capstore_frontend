import {
    TrendingUp,
    TrendingDown,
    Package,
    Users,
    ShoppingCart,
    DollarSign,
    Clock,
    AlertTriangle,
    MessageSquare,
    Calendar,
    ArrowUpRight,
    Activity,
} from "lucide-react";

const stats = [
    {
        title: "Total Revenue",
        value: "₹45,231.89",
        change: "+20.1%",
        trend: "up",
        icon: DollarSign,
        color: "text-success",
    },
    {
        title: "Total Orders",
        value: "2,350",
        change: "+180.1%",
        trend: "up",
        icon: ShoppingCart,
        color: "text-primary",
    },
    {
        title: "Active Products",
        value: "12,234",
        change: "-19%",
        trend: "down",
        icon: Package,
        color: "text-warning",
    },
    {
        title: "Team Members",
        value: "573",
        change: "+201",
        trend: "up",
        icon: Users,
        color: "text-success",
    },
];

const recentActivity = [
    {
        action: "New order #1234 placed",
        user: "John Smith",
        time: "2m ago",
        type: "order",
    },
    {
        action: "Low stock alert for Product A",
        user: "System",
        time: "15m ago",
        type: "alert",
    },
    {
        action: "Employee task completed",
        user: "Sarah Johnson",
        time: "1h ago",
        type: "task",
    },
    {
        action: "Meeting scheduled with client",
        user: "Mike Wilson",
        time: "2h ago",
        type: "meeting",
    },
];

const lowStockItems = [
    { name: "Product A", stock: 5, critical: true },
    { name: "Product B", stock: 12, critical: false },
    { name: "Product C", stock: 3, critical: true },
    { name: "Product D", stock: 8, critical: false },
];


export { recentActivity, lowStockItems, stats }