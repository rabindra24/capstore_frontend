import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm" className="gradient-primary shadow-button hover-lift">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-secondary/50 rounded-lg transition-smooth">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full mt-4" variant="outline">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Performance Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Key metrics for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sales Target</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Customer Satisfaction</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Order Fulfillment</span>
                <span className="font-medium">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Team Productivity</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Chat Panel */}
        {/* <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              AI Business Assistant
            </CardTitle>
            <CardDescription>
              Ask questions about your business data and get insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-primary-light rounded-lg p-4">
                <p className="text-sm">
                  <strong>AI:</strong> Based on your recent data, I notice a 20% increase in orders this month.
                  Would you like me to analyze which products are driving this growth?
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-4 ml-8">
                <p className="text-sm">
                  <strong>You:</strong> Yes, please show me the top performing products this month.
                </p>
              </div>
              <div className="bg-primary-light rounded-lg p-4">
                <p className="text-sm">
                  <strong>AI:</strong> Here are your top 3 performing products: Product X (156 orders),
                  Product Y (142 orders), and Product Z (138 orders). Product X shows 45% growth compared to last month.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="text-xs">
                  Show detailed report
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  Analyze trends
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}


        {/* Low Stock Alerts */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Stock Alerts
            </CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.stock} units left</p>
                  </div>
                  <Badge variant={item.critical ? "destructive" : "secondary"}>
                    {item.critical ? "Critical" : "Low"}
                  </Badge>
                </div>
              ))}
            </div>
            <Button size="sm" className="w-full mt-4" variant="outline">
              View All Inventory
            </Button>
          </CardContent>
        </Card>
        {/* Quick Actions */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get things done faster</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-2">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
                <Package className="w-6 h-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Add Product</div>
                  <div className="text-xs text-muted-foreground">Create new inventory item</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
                <Users className="w-6 h-6 text-success" />
                <div className="text-center">
                  <div className="font-medium">Hire Employee</div>
                  <div className="text-xs text-muted-foreground">Add team member</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
                <ShoppingCart className="w-6 h-6 text-warning" />
                <div className="text-center">
                  <div className="font-medium">Process Order</div>
                  <div className="text-xs text-muted-foreground">Handle new customer order</div>
                </div>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
                <Calendar className="w-6 h-6 text-destructive" />
                <div className="text-center">
                  <div className="font-medium">Schedule Meeting</div>
                  <div className="text-xs text-muted-foreground">Plan team discussion</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>




    </div>
  );
}