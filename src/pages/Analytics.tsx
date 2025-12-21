import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  ShoppingCart,
  Target,
  Store,
  Calendar,
  Download,
  BarChart3,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type Product = {
  name: string;
  qty: number;
  revenue: number;
};

type AnalyticsData = {
  totalOrders: number;
  totalRevenue: number;
  netRevenue: number;
  refunds: number;
  aov: number;
  byDay: Record<string, number>;
  topProducts: Product[];
};

export default function Analytics() {
  const { toast } = useToast();

  const [store, setStore] = useState<"global" | "shopify" | "woo">("global");
  const [period, setPeriod] = useState("30days");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v);

  /* ---------------- FETCH ANALYTICS ---------------- */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const endpoint =
          store === "global"
            ? "/api/analytics/global"
            : store === "shopify"
            ? "/api/analytics/shopify"
            : "/api/analytics/woo";

        const res = await fetch(`${SERVER_URL}${endpoint}`);
        if (!res.ok) throw new Error("Failed to load analytics");

        const json = await res.json();

        const payload =
          store === "global"
            ? json.data.totals
            : json.data;

        setData({
          totalOrders: payload.totalOrders,
          totalRevenue: payload.totalRevenue,
          netRevenue: payload.netRevenue,
          refunds: payload.refunds ?? 0,
          aov: payload.aov ?? payload.totalRevenue / payload.totalOrders,
          byDay: payload.byDay ?? {},
          topProducts: payload.topProducts ?? [],
        });
      } catch (e) {
        toast({
          title: "Analytics error",
          description: "Unable to load analytics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [store, period]);

  /* ---------------- DERIVED ---------------- */
  const dailyRevenue = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.byDay)
      .sort(([a], [b]) => a.localeCompare(b));
  }, [data]);

  if (!data) {
    return <div className="p-8 text-muted-foreground">Loading analytics…</div>;
  }

  return (
    <div className="space-y-8 relative">
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-5 h-5 animate-pulse" />
            Processing analytics…
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Store performance overview
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={store} onValueChange={(v) => setStore(v as any)}>
            <SelectTrigger className="w-[160px]">
              <Store className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">All Stores</SelectItem>
              <SelectItem value="shopify">Shopify</SelectItem>
              <SelectItem value="woo">WooCommerce</SelectItem>
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Metric title="Revenue" value={formatCurrency(data.totalRevenue)} icon={<DollarSign />} />
        <Metric title="Orders" value={data.totalOrders.toString()} icon={<ShoppingCart />} />
        <Metric title="AOV" value={formatCurrency(data.aov)} icon={<Target />} />
        <Metric title="Refunds" value={formatCurrency(data.refunds)} icon={<Package />} />
        <Metric title="Net Revenue" value={formatCurrency(data.netRevenue)} icon={<DollarSign />} />
      </div>

      {/* DAILY REVENUE CHART */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
          <CardDescription>Revenue trend by day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyRevenue.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No daily revenue data available
            </p>
          )}
          {dailyRevenue.map(([date, revenue]) => {
            const percent = (revenue / data.totalRevenue) * 100;
            return (
              <div key={date} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{date}</span>
                  <span>{formatCurrency(revenue)}</span>
                </div>
                <Progress value={percent} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* TOP PRODUCTS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best performing products</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topProducts.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.qty}</TableCell>
                  <TableCell>{formatCurrency(p.revenue)}</TableCell>
                  <TableCell>
                    {((p.revenue / data.totalRevenue) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- METRIC CARD ---------------- */
function Metric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
