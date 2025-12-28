import { useState, useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Eye,
  RefreshCw,
  ArrowUpDown,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SERVER_URL } from "@/config/env";

type Product = {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  stock_status: string;
  price: number;
  image: string | null;
  categories?: string[];
  product_type?: string;
  vendor?: string;
  description?: string;
  variants?: any[];
  inventory_item_id?: string;
};

type Store = {
  _id: string;
  name: string;
  platform: string;
  status: string;
};

export default function Inventory() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters and sorting
  const [sortBy, setSortBy] = useState<string>("name");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Stock update dialog
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newStock, setNewStock] = useState("");
  const [updating, setUpdating] = useState(false);

  // Product detail dialog
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [selectedStore]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, selectedStore]);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/stores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch stores");

      const data = await response.json();
      const activeStores = (data.stores || []).filter((s: Store) => s.status === "active");
      setStores(activeStores);

      // Auto-select first store
      if (activeStores.length > 0) {
        setSelectedStore(activeStores[0]._id);
      }
    } catch (error: any) {
      console.error("Fetch stores error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch stores",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const store = stores.find(s => s._id === selectedStore);

      if (!store) return;

      const platform = store.platform;
      const url = `${SERVER_URL}/api/${platform}/stores/${selectedStore}/products`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error: any) {
      console.error("Fetch products error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!selectedProduct || !newStock) return;

    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");
      const store = stores.find(s => s._id === selectedStore);

      if (!store) return;

      const platform = store.platform;
      const url = `${SERVER_URL}/api/${platform}/stores/${selectedStore}/products/${selectedProduct.id}/stock`;

      const body: any = { stock_quantity: parseInt(newStock) };

      // Shopify needs inventory_item_id
      if (platform === "shopify" && selectedProduct.inventory_item_id) {
        body.inventory_item_id = selectedProduct.inventory_item_id;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to update stock");

      toast({ title: "Stock updated successfully!" });
      setIsStockDialogOpen(false);
      setNewStock("");
      fetchProducts(); // Refresh products
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update stock",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (stock: number, status: string) => {
    if (stock === 0 || status === "outofstock") {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (stock <= 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">In Stock</Badge>;
  };

  // Apply filters and sorting
  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "instock") {
        filtered = filtered.filter(p => p.stock_quantity > 10);
      } else if (statusFilter === "lowstock") {
        filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10);
      } else if (statusFilter === "outofstock") {
        filtered = filtered.filter(p => p.stock_quantity === 0);
      }
    }

    // Sort by
    if (sortBy === "name") {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-low-high") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high-low") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortBy === "stock-low-high") {
      filtered = [...filtered].sort((a, b) => a.stock_quantity - b.stock_quantity);
    } else if (sortBy === "stock-high-low") {
      filtered = [...filtered].sort((a, b) => b.stock_quantity - a.stock_quantity);
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

  const currentStore = stores.find(s => s._id === selectedStore);

  const inventoryStats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      change: currentStore ? `${currentStore.name}` : "",
      trend: "up",
      icon: Package,
    },
    {
      title: "Low Stock Items",
      value: lowStockProducts.toString(),
      change: "",
      trend: "down",
      icon: AlertTriangle,
    },
    {
      title: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      change: "",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Out of Stock",
      value: outOfStockProducts.toString(),
      change: "",
      trend: "up",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track your products, manage stock levels, and prevent stockouts.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store._id} value={store._id}>
                  {store.name} ({store.platform})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchProducts}
            disabled={loading || !selectedStore}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {inventoryStats.map((stat, index) => (
          <Card key={index} className="hover-lift shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            {currentStore ? `Showing inventory for ${currentStore.name}` : "Select a store to view inventory"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="stock-low-high">Stock: Low to High</SelectItem>
                  <SelectItem value="stock-high-low">Stock: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="instock">In Stock</SelectItem>
                  <SelectItem value="lowstock">Low Stock</SelectItem>
                  <SelectItem value="outofstock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              {/* Items per page */}
              <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters */}
              {(sortBy !== "name" || statusFilter !== "all" || searchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSortBy("name");
                    setStatusFilter("all");
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading products...</p>
          ) : !selectedStore ? (
            <p className="text-center py-8 text-muted-foreground">Please select a store</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {products.length === 0 ? "No products found in this store" : "No products match your filters"}
            </p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-semibold">{product.name}</div>
                              {product.product_type && (
                                <div className="text-xs text-muted-foreground">
                                  {product.product_type}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          <div className="font-medium">{product.stock_quantity} units</div>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {getStatusBadge(product.stock_quantity, product.stock_status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDetailProduct(product);
                                setIsDetailDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setNewStock(product.stock_quantity.toString());
                                setIsStockDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products that need immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products
                .filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Only {product.stock_quantity} units left • SKU: {product.sku}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Low Stock</Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setNewStock(product.stock_quantity.toString());
                          setIsStockDialogOpen(true);
                        }}
                      >
                        Update Stock
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Update Dialog */}
      <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update the stock quantity for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock Quantity
              </Label>
              <Input
                id="stock"
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current stock: {selectedProduct?.stock_quantity} units
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStockDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStock} disabled={updating}>
              {updating ? "Updating..." : "Update Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {detailProduct && (
            <div className="grid gap-4">
              {detailProduct.image && (
                <img
                  src={detailProduct.image}
                  alt={detailProduct.name}
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{detailProduct.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">SKU</Label>
                  <p className="font-medium">{detailProduct.sku}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Stock</Label>
                  <p className="font-medium">{detailProduct.stock_quantity} units</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Price</Label>
                  <p className="font-medium">${detailProduct.price.toFixed(2)}</p>
                </div>
                {detailProduct.product_type && (
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-medium">{detailProduct.product_type}</p>
                  </div>
                )}
                {detailProduct.vendor && (
                  <div>
                    <Label className="text-muted-foreground">Vendor</Label>
                    <p className="font-medium">{detailProduct.vendor}</p>
                  </div>
                )}
              </div>
              {detailProduct.description && (
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <div
                    className="text-sm mt-1 max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: detailProduct.description }}
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}