import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { chatbotOrders, woocommerceOrders } from "@/constant/Orders";

const ITEMS_PER_PAGE = 5;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ---------------- TYPES ---------------- */

type OrderItem = {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  date: string;
  source: "Shopify" | "Chatbot" | "WooCommerce";
};

/* ---------------- COMPONENT ---------------- */

export default function Orders() {
  const [activeTab, setActiveTab] = useState("chatbot");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [shopifyOrders, setShopifyOrders] = useState<OrderItem[]>([]);
  const [loadingShopify, setLoadingShopify] = useState(false);
  const [wooOrders, setWooOrders] = useState<OrderItem[]>([]);
  const [loadingWoo, setLoadingWoo] = useState(false);

  const { toast } = useToast();

  /* ---------------- SHOPIFY FETCH ---------------- */

  const mapShopifyStatus = (order: any) => {
    if (order.cancelled_at) return "Cancelled";
    if (order.financial_status === "pending") return "Pending";
    if (order.financial_status === "paid") return "Processing";
    if (order.financial_status === "refunded") return "Cancelled";
    return "Processing";
  };

  const fetchShopifyOrders = async () => {
    try {
      setLoadingShopify(true);

      const res = await fetch(`${SERVER_URL}/api/shopify/orders`);
      if (!res.ok) throw new Error("Failed to fetch Shopify orders");

      const data = await res.json();

      const mapped: OrderItem[] = data.orders.map((order: any) => ({
        id: order.name,
        customer: `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim(),
        email: order.email,
        items: order.line_items.length,
        total: Number(order.total_price),
        status: mapShopifyStatus(order),
        date: order.created_at,
        source: "Shopify",
      }));

      setShopifyOrders(mapped);
    } catch (err) {
      toast({
        title: "Shopify Error",
        description: "Unable to load Shopify orders",
        variant: "destructive",
      });
    } finally {
      setLoadingShopify(false);
    }
  };

  const mapWooStatus = (status: string) => {
    switch (status) {
      case "processing":
        return "Processing";
      case "completed":
        return "Delivered";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Cancelled";
      default:
        return "Processing";
    }
  };
  const fetchWooOrders = async () => {
    try {
      setLoadingWoo(true);

      const res = await fetch(`${SERVER_URL}/api/woo/orders`);
      if (!res.ok) throw new Error("Failed to fetch Woo orders");

      const json = await res.json();

      const mapped: OrderItem[] = json.data.map((order: any) => ({
        id: order.number || order.id.toString(),
        customer: `${order.billing.first_name} ${order.billing.last_name}`,
        email: order.billing.email,
        items: order.line_items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        ),
        total: Number(order.total),
        status: mapWooStatus(order.status),
        date: order.date_created,
        source: "WooCommerce",
      }));

      setWooOrders(mapped);
    } catch (err) {
      toast({
        title: "WooCommerce Error",
        description: "Unable to load WooCommerce orders",
        variant: "destructive",
      });
    } finally {
      setLoadingWoo(false);
    }
  };
  useEffect(() => {
    if (activeTab === "woocommerce" && wooOrders.length === 0) {
      fetchWooOrders();
    }
  }, [activeTab]);


  useEffect(() => {
    if (activeTab === "shopify" && shopifyOrders.length === 0) {
      fetchShopifyOrders();
    }
  }, [activeTab]);

  /* ---------------- DATA SOURCE ---------------- */

  const getOrdersByTab = () => {
    switch (activeTab) {
      case "chatbot":
        return chatbotOrders;
      case "woocommerce":
        return wooOrders;
      case "shopify":
        return shopifyOrders;
      default:
        return [];
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Delivered</Badge>;
      case "Shipped":
        return <Badge className="bg-primary text-primary-foreground"><Truck className="w-3 h-3 mr-1" />Shipped</Badge>;
      case "Processing":
        return <Badge variant="secondary"><Package className="w-3 h-3 mr-1" />Processing</Badge>;
      case "Pending":
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "Cancelled":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filterByDate = (dateString: string) => {
    const orderDate = new Date(dateString);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dateFilter === "today") return daysDiff === 0;
    if (dateFilter === "week") return daysDiff <= 7;
    if (dateFilter === "month") return daysDiff <= 30;
    return true;
  };


  const orders = getOrdersByTab();
  const handleViewDetails = (order: OrderItem) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = filterByDate(order.date);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Orders by Channel</CardTitle>
          <CardDescription>Shopify connected • WooCommerce coming next</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="chatbot"><MessageSquare className="w-4 h-4 mr-2" />Chatbot</TabsTrigger>
              <TabsTrigger value="woocommerce"><ShoppingBag className="w-4 h-4 mr-2" />WooCommerce</TabsTrigger>
              <TabsTrigger value="shopify"><ShoppingCart className="w-4 h-4 mr-2" />Shopify</TabsTrigger>
            </TabsList>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>

            <TabsContent value="shopify">
              {loadingShopify ? (
                <div className="py-10 text-center text-muted-foreground">Loading Shopify orders…</div>
              ) : (
                <OrderTable orders={paginatedOrders} onViewDetails={(o) => { setSelectedOrder(o); setIsDetailsDialogOpen(true); }} getStatusBadge={getStatusBadge} />
              )}
            </TabsContent>

            <TabsContent value="chatbot">
              <OrderTable orders={paginatedOrders} onViewDetails={(o) => { setSelectedOrder(o); setIsDetailsDialogOpen(true); }} getStatusBadge={getStatusBadge} />
            </TabsContent>

            <TabsContent value="woocommerce" className="mt-0">
              {loadingWoo ? (
                <div className="py-10 text-center text-muted-foreground">
                  Loading WooCommerce orders...
                </div>
              ) : (
                <OrderTable
                  orders={paginatedOrders}
                  onViewDetails={handleViewDetails}
                  getStatusBadge={getStatusBadge}
                />
              )}
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Source: {selectedOrder?.source}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- TABLE ---------------- */

function OrderTable({
  orders,
  onViewDetails,
  getStatusBadge,
}: {
  orders: any[];
  onViewDetails: (order: any) => void;
  getStatusBadge: (status: string) => JSX.Element;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell>{o.id}</TableCell>
            <TableCell>{o.customer}</TableCell>
            <TableCell>{o.email}</TableCell>
            <TableCell>{o.items}</TableCell>
            <TableCell>₹{o.total}</TableCell>
            <TableCell>{getStatusBadge(o.status)}</TableCell>
            <TableCell>{new Date(o.date).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button size="sm" variant="ghost" onClick={() => onViewDetails(o)}>
                <Eye className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
