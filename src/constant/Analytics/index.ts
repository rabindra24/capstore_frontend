const analyticsData = {
  revenue: {
    current: 45231.89,
    previous: 38156.42,
    change: 18.5,
  },
  orders: {
    current: 2350,
    previous: 1984,
    change: 18.4,
  },
  customers: {
    current: 1847,
    previous: 1623,
    change: 13.8,
  },
  products: {
    current: 12234,
    previous: 11456,
    change: 6.8,
  },
};

const monthlyData = [
  { month: "Jan", revenue: 42000, orders: 2100, customers: 1400 },
  { month: "Feb", revenue: 38000, orders: 1900, customers: 1200 },
  { month: "Mar", revenue: 45000, orders: 2250, customers: 1500 },
  { month: "Apr", revenue: 41000, orders: 2050, customers: 1350 },
  { month: "May", revenue: 48000, orders: 2400, customers: 1600 },
  { month: "Jun", revenue: 52000, orders: 2600, customers: 1750 },
];

const topProducts = [
  { name: "Premium Wireless Headphones", sales: 1234, revenue: 246800, growth: 12.5 },
  { name: "Smart Water Bottle", sales: 987, revenue: 49350, growth: -5.2 },
  { name: "Ergonomic Office Chair", sales: 654, revenue: 196200, growth: 8.7 },
  { name: "Bluetooth Speaker", sales: 543, revenue: 48870, growth: 15.3 },
  { name: "Organic Coffee Beans", sales: 432, revenue: 10800, growth: 3.4 },
];

const reportsData = [
  {
    name: "Monthly Revenue Report",
    description: "Comprehensive revenue analysis for the current month",
    lastGenerated: "2024-01-15",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    name: "Customer Behavior Analysis",
    description: "Deep dive into customer purchasing patterns and preferences",
    lastGenerated: "2024-01-14",
    size: "1.8 MB",
    format: "Excel",
  },
  {
    name: "Inventory Performance Report",
    description: "Product performance metrics and stock optimization recommendations",
    lastGenerated: "2024-01-13",
    size: "3.1 MB",
    format: "PDF",
  },
  {
    name: "Sales Team Performance",
    description: "Individual and team performance metrics with actionable insights",
    lastGenerated: "2024-01-12",
    size: "1.5 MB",
    format: "Excel",
  },
];

export {analyticsData, monthlyData, topProducts, reportsData}