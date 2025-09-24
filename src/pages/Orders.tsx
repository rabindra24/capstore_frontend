import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const orderData = [
  {
    id: "ORD001",
    customer: "John Smith",
    email: "john.smith@email.com",
    items: 3,
    total: 299.97,
    status: "Delivered",
    date: "2024-01-15",
    shippingAddress: "123 Main St, New York, NY 10001",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD002",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    items: 1,
    total: 199.99,
    status: "Shipped",
    date: "2024-01-16",
    shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD003",
    customer: "Michael Chen",
    email: "michael.c@email.com",
    items: 2,
    total: 149.98,
    status: "Processing",
    date: "2024-01-16",
    shippingAddress: "789 Pine St, Chicago, IL 60601",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD004",
    customer: "Emily Rodriguez",
    email: "emily.r@email.com",
    items: 5,
    total: 524.95,
    status: "Pending",
    date: "2024-01-17",
    shippingAddress: "321 Elm St, Houston, TX 77001",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "ORD005",
    customer: "David Wilson",
    email: "david.w@email.com",
    items: 1,
    total: 89.99,
    status: "Cancelled",
    date: "2024-01-17",
    shippingAddress: "654 Maple Dr, Miami, FL 33101",
    paymentMethod: "Credit Card",
  },
];

const orderStats = [
  {
    title: "Total Orders",
    value: "2,350",
    change: "+12%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Total Revenue",
    value: "$45,678",
    change: "+8%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Pending Orders",
    value: "23",
    change: "-15%",
    trend: "down",
    icon: Clock,
  },
  {
    title: "Average Order",
    value: "$127.50",
    change: "+3%",
    trend: "up",
    icon: TrendingUp,
  },
];

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge variant="default" className="bg-success text-success-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          Delivered
        </Badge>;
      case "Shipped":
        return <Badge variant="default" className="bg-primary text-primary-foreground">
          <Truck className="w-3 h-3 mr-1" />
          Shipped
        </Badge>;
      case "Processing":
        return <Badge variant="secondary">
          <Package className="w-3 h-3 mr-1" />
          Processing
        </Badge>;
      case "Pending":
        return <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>;
      case "Cancelled":
        return <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orderData.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrder = () => {
    toast({
      title: "Order created successfully!",
      description: "The new order has been added to your system.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    toast({
      title: "Order status updated!",
      description: `Order ${selectedOrder?.id} status changed to ${newStatus}.`,
    });
    setIsDetailsDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer orders from creation to fulfillment.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-button hover-lift">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Create a new order for a customer. Fill in all the required details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input id="customerEmail" type="email" placeholder="john@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea id="shippingAddress" placeholder="123 Main St, City, State, ZIP" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderTotal">Order Total</Label>
                  <Input id="orderTotal" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderNotes">Order Notes</Label>
                <Textarea id="orderNotes" placeholder="Special instructions or notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateOrder} className="gradient-success">
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat, index) => (
          <Card key={index} className="hover-lift shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell className="font-semibold">${order.total}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover-lift"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.customer}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-medium">Payment:</span> {selectedOrder.paymentMethod}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Items:</span> {selectedOrder.items}</p>
                    <p><span className="font-medium">Total:</span> ${selectedOrder.total}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Status</h4>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Update Status</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus("Processing")}>
                    Mark Processing
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus("Shipped")}>
                    Mark Shipped
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateStatus("Delivered")}>
                    Mark Delivered
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleUpdateStatus("Cancelled")}>
                    Cancel Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Order Alerts & Updates
          </CardTitle>
          <CardDescription>Recent order activities and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success-light border border-success/20 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold">Order #ORD001 Delivered</h4>
                <p className="text-sm text-muted-foreground">
                  Successfully delivered to John Smith • 2 hours ago
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-primary-light border border-primary/20 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold">Order #ORD002 Shipped</h4>
                <p className="text-sm text-muted-foreground">
                  Package dispatched to Sarah Johnson • 5 hours ago
                </p>
              </div>
              <Truck className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-warning-light border border-warning/20 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold">Payment Pending</h4>
                <p className="text-sm text-muted-foreground">
                  Order #ORD004 waiting for payment confirmation • 1 day ago
                </p>
              </div>
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}