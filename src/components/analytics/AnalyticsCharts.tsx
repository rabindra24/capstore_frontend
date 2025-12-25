import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type DailyData = {
    date: string;
    revenue: number;
    orders?: number;
};

type ProductData = {
    name: string;
    qty: number;
    revenue: number;
};

type StoreData = {
    name: string;
    value: number;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
    }).format(value);

// Revenue Line Chart
export function RevenueLineChart({ data }: { data: DailyData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis
                            className="text-xs"
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: "#3b82f6", r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Revenue"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Orders Bar Chart
export function OrdersBarChart({ data }: { data: DailyData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Orders</CardTitle>
                <CardDescription>Number of orders per day</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis className="text-xs" />
                        <Tooltip
                            formatter={(value: number) => [value, "Orders"]}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} name="Orders" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Cumulative Revenue Area Chart
export function CumulativeRevenueChart({ data }: { data: DailyData[] }) {
    // Calculate cumulative revenue
    let cumulative = 0;
    const cumulativeData = data.map((item) => {
        cumulative += item.revenue;
        return {
            ...item,
            cumulative,
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cumulative Revenue</CardTitle>
                <CardDescription>Total revenue accumulation over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={cumulativeData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="date"
                            className="text-xs"
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                        />
                        <YAxis
                            className="text-xs"
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            formatter={(value: number) => [formatCurrency(value), "Cumulative Revenue"]}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                            }}
                        />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="cumulative"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.6}
                            name="Cumulative Revenue"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Top Products Pie Chart
export function TopProductsPieChart({ data }: { data: ProductData[] }) {
    const chartData = data.slice(0, 5).map((item) => ({
        name: item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
        value: item.revenue,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Products by Revenue</CardTitle>
                <CardDescription>Revenue distribution across top 5 products</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

// Store Distribution Pie Chart (for global view)
export function StoreDistributionChart({ data }: { data: StoreData[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue by Store</CardTitle>
                <CardDescription>Revenue distribution across stores</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "6px",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
