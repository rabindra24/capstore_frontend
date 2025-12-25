import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Target,
  Store,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const COLORS = ["#4f46e5", "#22c55e"];

type StoreInfo = {
  _id: string;
  name: string;
  platform: string;
  storeUrl: string;
};

export default function Dashboard() {
  const { toast } = useToast();

  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("global");
  const [period, setPeriod] = useState("30days");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  /* ---------------- HELPERS ---------------- */
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v);

  const normalizeByDay = (raw: any) => {
    if (!raw) return [];
    return Object.entries(raw)
      .map(([date, revenue]) => ({
        date,
        revenue: Number(revenue),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  /* ---------------- FETCH STORES ---------------- */
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");
        setStores(response.data.stores || []);
      } catch (error: any) {
        console.error("Failed to fetch stores:", error);
      }
    };

    fetchStores();
  }, []);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        let endpoint: string;
        let params: any = { period };

        if (selectedStore === "global") {
          endpoint = "/analytics/global";
        } else {
          const store = stores.find(s => s._id === selectedStore);
          if (!store) {
            throw new Error("Store not found");
          }

          endpoint = store.platform === "shopify"
            ? "/analytics/shopify"
            : "/analytics/woo";

          params.storeId = selectedStore;
        }

        const response = await api.get(endpoint, { params });

        setData(response.data.data);
      } catch (err: any) {
        toast({
          title: "Dashboard Error",
          description: err.response?.data?.message || "Unable to load analytics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedStore === "global" || stores.length > 0) {
      fetchDashboard();
    }
  }, [selectedStore, period, stores]);

  /* ---------------- DERIVED DATA ---------------- */

  const revenueByDay = useMemo(() => {
    if (!data) return [];

    // GLOBAL → merge Woo + Shopify
    if (selectedStore === "global" && data.breakdown) {
      const merged: Record<string, number> = {};

      ["woo", "shopify"].forEach((key) => {
        const byDay = data.breakdown[key]?.byDay;
        if (!byDay) return;

        Object.entries(byDay).forEach(([date, value]) => {
          merged[date] = (merged[date] || 0) + Number(value);
        });
      });

      return normalizeByDay(merged);
    }

    // SINGLE STORE
    return normalizeByDay(data.byDay);
  }, [data, selectedStore]);

  const pieData = useMemo(() => {
    if (selectedStore !== "global" || !data?.breakdown) return [];
    return [
      { name: "WooCommerce", value: data.breakdown.woo.totalRevenue },
      { name: "Shopify", value: data.breakdown.shopify.totalRevenue },
    ];
  }, [data, selectedStore]);

  const barData = useMemo(() => {
    if (!data?.sources) return [];
    return [
      { store: "Woo", orders: data.sources.woo.count },
      { store: "Shopify", orders: data.sources.shopify.count },
    ];
  }, [data]);

  if (!data) {
    return <div className="p-8 text-muted-foreground">Loading dashboard…</div>;
  }

  const totals = data.totals ?? data;
  const aov =
    totals.aov ?? totals.totalRevenue / Math.max(totals.totalOrders, 1);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-8 relative">
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-5 h-5 animate-pulse" />
            Updating analytics…
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Store performance overview
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[200px]">
              <Store className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>All Stores</span>
                </div>
              </SelectItem>
              {stores.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Connected Stores
                  </div>
                  {stores.map((store) => (
                    <SelectItem key={store._id} value={store._id}>
                      <div className="flex items-center gap-2">
                        <span>{store.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({store.platform})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
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
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat title="Revenue" value={formatCurrency(totals.totalRevenue)} icon={<DollarSign />} />
        <Stat title="Orders" value={totals.totalOrders} icon={<ShoppingCart />} />
        <Stat title="AOV" value={formatCurrency(aov)} icon={<Target />} />
        <Stat title="Net Revenue" value={formatCurrency(totals.netRevenue)} icon={<DollarSign />} />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LINE */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {revenueByDay.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No revenue data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueByDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* PIE */}
        {selectedStore === "global" && pieData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Share</CardTitle>
              <CardDescription>By store</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* BAR */}
      {selectedStore === "global" && barData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Orders by Store</CardTitle>
            <CardDescription>Woo vs Shopify</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="store" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function Stat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
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
