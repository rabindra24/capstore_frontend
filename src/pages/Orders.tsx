import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
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
  MessageSquare,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Download,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const chatbotOrders = [
  { id: "CB001", customer: "Alice Cooper", email: "alice@email.com", items: 2, total: 159.98, status: "Delivered", date: "2024-01-20", source: "Chatbot" },
  { id: "CB002", customer: "Bob Martin", email: "bob@email.com", items: 1, total: 79.99, status: "Shipped", date: "2024-01-21", source: "Chatbot" },
  { id: "CB003", customer: "Carol Davis", email: "carol@email.com", items: 3, total: 229.97, status: "Processing", date: "2024-01-22", source: "Chatbot" },
  { id: "CB004", customer: "David Lee", email: "david@email.com", items: 1, total: 99.99, status: "Pending", date: "2024-01-23", source: "Chatbot" },
  { id: "CB005", customer: "Eva Green", email: "eva@email.com", items: 4, total: 389.96, status: "Delivered", date: "2024-01-24", source: "Chatbot" },
  { id: "CB006", customer: "Frank Miller", email: "frank@email.com", items: 2, total: 149.98, status: "Shipped", date: "2024-01-25", source: "Chatbot" },
  { id: "CB007", customer: "Grace Taylor", email: "grace@email.com", items: 1, total: 59.99, status: "Processing", date: "2024-01-26", source: "Chatbot" },
];

const woocommerceOrders = [
  { id: "WC001", customer: "Henry Brown", email: "henry@email.com", items: 3, total: 299.97, status: "Delivered", date: "2024-01-15", source: "WooCommerce" },
  { id: "WC002", customer: "Ivy Wilson", email: "ivy@email.com", items: 2, total: 199.98, status: "Shipped", date: "2024-01-16", source: "WooCommerce" },
  { id: "WC003", customer: "Jack Anderson", email: "jack@email.com", items: 1, total: 89.99, status: "Processing", date: "2024-01-17", source: "WooCommerce" },
  { id: "WC004", customer: "Kate Johnson", email: "kate@email.com", items: 5, total: 524.95, status: "Pending", date: "2024-01-18", source: "WooCommerce" },
  { id: "WC005", customer: "Leo Martinez", email: "leo@email.com", items: 2, total: 179.98, status: "Cancelled", date: "2024-01-19", source: "WooCommerce" },
  { id: "WC006", customer: "Mia Garcia", email: "mia@email.com", items: 3, total: 269.97, status: "Delivered", date: "2024-01-20", source: "WooCommerce" },
];

const shopifyOrders = [
  { id: "SF001", customer: "Noah White", email: "noah@email.com", items: 4, total: 399.96, status: "Delivered", date: "2024-01-10", source: "Shopify" },
  { id: "SF002", customer: "Olivia Harris", email: "olivia@email.com", items: 2, total: 189.98, status: "Shipped", date: "2024-01-11", source: "Shopify" },
  { id: "SF003", customer: "Paul Clark", email: "paul@email.com", items: 1, total: 129.99, status: "Processing", date: "2024-01-12", source: "Shopify" },
  { id: "SF004", customer: "Quinn Lewis", email: "quinn@email.com", items: 3, total: 289.97, status: "Pending", date: "2024-01-13", source: "Shopify" },
  { id: "SF005", customer: "Ryan Walker", email: "ryan@email.com", items: 2, total: 159.98, status: "Delivered", date: "2024-01-14", source: "Shopify" },
  { id: "SF006", customer: "Sophia Hall", email: "sophia@email.com", items: 1, total: 79.99, status: "Shipped", date: "2024-01-15", source: "Shopify" },
  { id: "SF007", customer: "Thomas Allen", email: "thomas@email.com", items: 5, total: 549.95, status: "Processing", date: "2024-01-16", source: "Shopify" },
];

const ITEMS_PER_PAGE = 5;

export default function Orders() {
  const [activeTab, setActiveTab] = useState("chatbot");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const getOrdersByTab = () => {
    switch (activeTab) {
      case "chatbot": return chatbotOrders;
      case "woocommerce": return woocommerceOrders;
      case "shopify": return shopifyOrders;
      default: return chatbotOrders;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-success text-success-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          Delivered
        </Badge>;
      case "Shipped":
        return <Badge className="bg-primary text-primary-foreground">
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

  const filterByDate = (dateString: string) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (dateFilter) {
      case "today": return daysDiff === 0;
      case "week": return daysDiff <= 7;
      case "month": return daysDiff <= 30;
      case "all": return true;
      default: return true;
    }
  };

  const orders = getOrdersByTab();
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = filterByDate(order.date);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all" || dateFilter !== "all";

  const stats = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      change: "+12%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Total Revenue",
      value: `$${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`,
      change: "+8%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Pending Orders",
      value: orders.filter(o => o.status === "Pending").length.toString(),
      change: "-15%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Avg Order Value",
      value: `$${(orders.reduce((sum, order) => sum + order.total, 0) / orders.length).toFixed(2)}`,
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground">
          Manage orders from Chatbot, WooCommerce, and Shopify channels
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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

      {/* Tabs and Order List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Orders by Channel</CardTitle>
          <CardDescription>View and filter orders from different sales channels</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            setCurrentPage(1);
          }}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="chatbot" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Chatbot
              </TabsTrigger>
              <TabsTrigger value="woocommerce" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                WooCommerce
              </TabsTrigger>
              <TabsTrigger value="shopify" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Shopify
              </TabsTrigger>
            </TabsList>

            {/* Filters Section - Shopify Style */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders, customers, emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Export Orders
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Active filters:</span>
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Search: {searchTerm}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Status: {statusFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                    </Badge>
                  )}
                  {dateFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1">
                      Date: {dateFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setDateFilter("all")} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="chatbot" className="mt-0">
              <OrderTable orders={paginatedOrders} onViewDetails={handleViewDetails} getStatusBadge={getStatusBadge} />
            </TabsContent>

            <TabsContent value="woocommerce" className="mt-0">
              <OrderTable orders={paginatedOrders} onViewDetails={handleViewDetails} getStatusBadge={getStatusBadge} />
            </TabsContent>

            <TabsContent value="shopify" className="mt-0">
              <OrderTable orders={paginatedOrders} onViewDetails={handleViewDetails} getStatusBadge={getStatusBadge} />
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          {filteredOrders.length > ITEMS_PER_PAGE && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Complete information about this order from {selectedOrder?.source}
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
                    <p><span className="font-medium">Source:</span> {selectedOrder.source}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                    <p><span className="font-medium">Items:</span> {selectedOrder.items}</p>
                    <p><span className="font-medium">Total:</span> ${selectedOrder.total}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Current Status</h4>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Order Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-success rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-xs text-muted-foreground">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Confirmed</p>
                      <p className="text-xs text-muted-foreground">Payment received via {selectedOrder.source}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      selectedOrder.status === "Delivered" ? "bg-success" : "bg-muted"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Status: {selectedOrder.status}</p>
                      <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderTable({ 
  orders, 
  onViewDetails, 
  getStatusBadge 
}: { 
  orders: any[], 
  onViewDetails: (order: any) => void,
  getStatusBadge: (status: string) => JSX.Element 
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No orders found matching your filters
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-muted-foreground">{order.email}</TableCell>
                <TableCell>{order.items} items</TableCell>
                <TableCell className="font-semibold">${order.total}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(order)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
