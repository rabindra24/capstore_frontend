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
  BarChart3,
  Package,
  TrendingUp,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ExportDialog } from "@/components/analytics/ExportDialog";
import {
  RevenueLineChart,
  OrdersBarChart,
  CumulativeRevenueChart,
  TopProductsPieChart,
} from "@/components/analytics/AnalyticsCharts";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import api from "@/lib/api";

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

type StoreInfo = {
  _id: string;
  name: string;
  platform: string;
  storeUrl: string;
};

export default function Analytics() {
  const { toast } = useToast();

  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("global");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = new Date(to.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from, to };
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(v);

  const getDateRangeString = () => {
    if (!dateRange?.from) return "Last 30 days";
    if (!dateRange.to) return dateRange.from.toLocaleDateString();
    return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
  };

  const getStoreDisplayName = () => {
    if (selectedStore === "global") return "All Stores";
    const store = stores.find(s => s._id === selectedStore);
    return store ? store.name : "Unknown Store";
  };

  /* ---------------- FETCH STORES ---------------- */
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get("/stores");
        setStores(response.data.stores || []);
      } catch (error: any) {
        console.error("Failed to fetch stores:", error);
        toast({
          title: "Error",
          description: "Failed to load connected stores",
          variant: "destructive",
        });
      }
    };

    fetchStores();
  }, []);

  /* ---------------- FETCH ANALYTICS ---------------- */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        let endpoint: string;
        let params: any = {};

        if (selectedStore === "global") {
          endpoint = "/analytics/global";
        } else {
          // Find the store to determine its platform
          const store = stores.find(s => s._id === selectedStore);
          if (!store) {
            throw new Error("Store not found");
          }

          // Use platform-specific endpoint with storeId filter
          endpoint = store.platform === "shopify"
            ? "/analytics/shopify"
            : "/analytics/woo";

          params.storeId = selectedStore;
        }

        const response = await api.get(endpoint, { params });
        const json = response.data;

        const payload = selectedStore === "global" ? json.data.totals : json.data;

        setData({
          totalOrders: payload.totalOrders,
          totalRevenue: payload.totalRevenue,
          netRevenue: payload.netRevenue,
          refunds: payload.refunds ?? 0,
          aov: payload.aov ?? payload.totalRevenue / payload.totalOrders,
          byDay: payload.byDay ?? {},
          topProducts: payload.topProducts ?? [],
        });
      } catch (e: any) {
        toast({
          title: "Analytics error",
          description: e.response?.data?.message || "Unable to load analytics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedStore === "global" || stores.length > 0) {
      fetchAnalytics();
    }
  }, [selectedStore, dateRange, stores]);

  /* ---------------- DERIVED DATA ---------------- */
  const dailyChartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({
        date,
        revenue,
        orders: Math.floor(revenue / (data.aov || 1)), // Approximate orders
      }));
  }, [data]);

  const growthRate = useMemo(() => {
    if (dailyChartData.length < 2) return 0;
    const firstWeek = dailyChartData.slice(0, 7).reduce((sum, d) => sum + d.revenue, 0);
    const lastWeek = dailyChartData.slice(-7).reduce((sum, d) => sum + d.revenue, 0);
    return firstWeek > 0 ? ((lastWeek - firstWeek) / firstWeek) * 100 : 0;
  }, [dailyChartData]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 className="w-5 h-5 animate-pulse" />
          Loading analytics…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* LOADING OVERLAY */}
      {loading && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-5 h-5 animate-pulse" />
            Processing analytics…
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive store performance insights
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
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

          <DateRangePicker value={dateRange} onChange={setDateRange} />

          <ExportDialog
            data={data}
            store={getStoreDisplayName()}
            dateRange={getDateRangeString()}
          />
        </div>
      </div>

      {/* ADVANCED FILTERS */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <Card>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="font-semibold">Advanced Filters</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {showFilters ? "Hide" : "Show"}
                </span>
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chart Type</label>
                  <Select value={chartType} onValueChange={(v) => setChartType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Metric Focus</label>
                  <Select defaultValue="revenue">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="orders">Orders</SelectItem>
                      <SelectItem value="aov">Average Order Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* KEY METRICS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(data.totalRevenue)}
          icon={<DollarSign />}
          trend={growthRate}
        />
        <MetricCard
          title="Orders"
          value={data.totalOrders.toString()}
          icon={<ShoppingCart />}
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(data.aov)}
          icon={<Target />}
        />
        <MetricCard
          title="Refunds"
          value={formatCurrency(data.refunds)}
          icon={<Package />}
          isNegative
        />
        <MetricCard
          title="Net Revenue"
          value={formatCurrency(data.netRevenue)}
          icon={<DollarSign />}
        />
      </div>

      {/* CHARTS GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {chartType === "line" && <RevenueLineChart data={dailyChartData} />}
        {chartType === "bar" && <OrdersBarChart data={dailyChartData} />}
        {chartType === "area" && <CumulativeRevenueChart data={dailyChartData} />}

        <TopProductsPieChart data={data.topProducts} />
      </div>

      {/* ADDITIONAL CHARTS */}
      <div className="grid gap-6 md:grid-cols-2">
        {chartType !== "bar" && <OrdersBarChart data={dailyChartData} />}
        {chartType !== "area" && <CumulativeRevenueChart data={dailyChartData} />}
      </div>

      {/* TOP PRODUCTS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Top Products Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of best-selling products
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No product data available for this period
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topProducts.map((p, idx) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{p.qty}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(p.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1">
                        {((p.revenue / data.totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- METRIC CARD ---------------- */
function MetricCard({
  title,
  value,
  icon,
  trend,
  isNegative = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  isNegative?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={isNegative ? "text-destructive" : "text-primary"}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <TrendingUp
              className={`w-3 h-3 ${trend >= 0 ? "text-green-600" : "text-red-600 rotate-180"
                }`}
            />
            <span className={trend >= 0 ? "text-green-600" : "text-red-600"}>
              {Math.abs(trend).toFixed(1)}%
            </span>
            <span>vs previous period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
