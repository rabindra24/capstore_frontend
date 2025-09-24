import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  Calendar,
  Target,
  Brain,
  FileText,
  PieChart,
  LineChart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const { toast } = useToast();

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Report downloading...",
      description: `${reportName} will be downloaded shortly.`,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report generated!",
      description: "Your custom report has been created and is ready for download.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (change: number) => {
    return change > 0 ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive business insights and data-driven decision making tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gradient-primary shadow-button hover-lift">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-lift shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.revenue.current)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">
                {formatPercentage(analyticsData.revenue.change)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.orders.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">
                {formatPercentage(analyticsData.orders.change)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <Users className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.customers.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">
                {formatPercentage(analyticsData.customers.change)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products Sold
            </CardTitle>
            <Package className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.products.current.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-success" />
              <span className="text-success">
                {formatPercentage(analyticsData.products.change)}
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-sm font-medium text-center">{month.month}</div>
                    <div>
                      <div className="font-semibold">{formatCurrency(month.revenue)}</div>
                      <div className="text-sm text-muted-foreground">{month.orders} orders</div>
                    </div>
                  </div>
                  <div className="w-32">
                    <Progress 
                      value={(month.revenue / Math.max(...monthlyData.map(m => m.revenue))) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-warning" />
              Top Performing Products
            </CardTitle>
            <CardDescription>Best selling products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {product.sales} sales • {formatCurrency(product.revenue)}
                      </div>
                    </div>
                  </div>
                  <Badge variant={product.growth > 0 ? "default" : "destructive"} className={product.growth > 0 ? "bg-success text-success-foreground" : ""}>
                    {formatPercentage(product.growth)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Business Insights
          </CardTitle>
          <CardDescription>Automated analysis and recommendations from your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-success-light border border-success/20 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <h4 className="font-semibold text-success">Revenue Growth Opportunity</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your Premium Wireless Headphones show 15.3% growth potential. Consider increasing inventory 
                    and running targeted marketing campaigns during peak season.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-warning-light border border-warning/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <h4 className="font-semibold text-warning">Customer Retention Alert</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customer retention rate dropped by 3.2% this month. Recommend implementing a loyalty 
                    program and personalized email campaigns for repeat customers.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-primary">Seasonal Trend Prediction</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on historical data, expect 25% increase in orders during the next quarter. 
                    Prepare inventory and staff accordingly to handle the increased demand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Downloadable Reports
          </CardTitle>
          <CardDescription>Generate and download detailed business reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportsData.map((report, index) => (
              <div key={index} className="p-4 border border-border rounded-lg hover:bg-secondary/30 transition-smooth">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                  <span>Size: {report.size}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="hover-lift"
                    onClick={() => handleDownloadReport(report.name)}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" className="hover-lift">
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Custom Report Generator</h4>
                <p className="text-sm text-muted-foreground">
                  Create custom reports with specific metrics and date ranges
                </p>
              </div>
              <Button onClick={handleGenerateReport} className="gradient-success shadow-button hover-lift">
                <FileText className="w-4 h-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Goals */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Business Goals & KPIs
          </CardTitle>
          <CardDescription>Track progress towards your business objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Monthly Revenue Target</span>
                <span className="text-muted-foreground">$45,232 / $50,000</span>
              </div>
              <Progress value={90.5} className="h-2" />
              <p className="text-xs text-muted-foreground">90.5% complete • $4,768 remaining</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Customer Acquisition</span>
                <span className="text-muted-foreground">1,847 / 2,000</span>
              </div>
              <Progress value={92.4} className="h-2" />
              <p className="text-xs text-muted-foreground">92.4% complete • 153 customers to go</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Order Fulfillment Rate</span>
                <span className="text-muted-foreground">97.8% / 95%</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-success">🎉 Target exceeded! Great job!</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Customer Satisfaction</span>
                <span className="text-muted-foreground">4.6 / 4.5 ⭐</span>
              </div>
              <Progress value={100} className="h-2" />
              <p className="text-xs text-success">🎉 Target exceeded! Customers love your service!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}