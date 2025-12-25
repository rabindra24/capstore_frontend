import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const inventoryData = [
  {
    id: "INV001",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    stock: 45,
    minStock: 10,
    price: 199.99,
    status: "In Stock",
    supplier: "TechCorp",
    lastUpdated: "2024-01-15",
  },
  {
    id: "INV002",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    stock: 8,
    minStock: 15,
    price: 299.99,
    status: "Low Stock",
    supplier: "ComfortSeating",
    lastUpdated: "2024-01-14",
  },
  {
    id: "INV003",
    name: "Smart Water Bottle",
    category: "Health",
    stock: 0,
    minStock: 20,
    price: 49.99,
    status: "Out of Stock",
    supplier: "HydroTech",
    lastUpdated: "2024-01-10",
  },
  {
    id: "INV004",
    name: "Bluetooth Speaker",
    category: "Electronics",
    stock: 32,
    minStock: 10,
    price: 89.99,
    status: "In Stock",
    supplier: "AudioMax",
    lastUpdated: "2024-01-16",
  },
  {
    id: "INV005",
    name: "Organic Coffee Beans",
    category: "Food",
    stock: 156,
    minStock: 50,
    price: 24.99,
    status: "In Stock",
    supplier: "BeanFarm",
    lastUpdated: "2024-01-16",
  },
];

const inventoryStats = [
  {
    title: "Total Products",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Package,
  },
  {
    title: "Low Stock Items",
    value: "23",
    change: "-5%",
    trend: "down",
    icon: AlertTriangle,
  },
  {
    title: "Total Value",
    value: "₹45,678",
    change: "+8%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Out of Stock",
    value: "5",
    change: "+2",
    trend: "up",
    icon: TrendingDown,
  },
];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string, stock: number, minStock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= minStock) return <Badge variant="secondary">Low Stock</Badge>;
    return <Badge variant="default" className="bg-success text-success-foreground">In Stock</Badge>;
  };

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    toast({
      title: "Product added successfully!",
      description: "The new product has been added to your inventory.",
    });
    setIsAddDialogOpen(false);
  };

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-button hover-lift">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory. Fill in all the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" placeholder="Product name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input id="price" type="number" placeholder="0.00" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock
                </Label>
                <Input id="stock" type="number" placeholder="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minStock" className="text-right">
                  Min Stock
                </Label>
                <Input id="minStock" type="number" placeholder="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supplier" className="text-right">
                  Supplier
                </Label>
                <Input id="supplier" placeholder="Supplier name" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddProduct} className="gradient-success">
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>Manage and track all your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.stock} units</span>
                          <span className="text-muted-foreground">/{item.minStock} min</span>
                        </div>
                        <Progress
                          value={(item.stock / (item.minStock * 2)) * 100}
                          className="h-1"
                        />
                      </div>
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>{getStatusBadge(item.status, item.stock, item.minStock)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="hover-lift">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover-lift">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover-lift text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
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
            {inventoryData.filter(item => item.stock <= item.minStock).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-warning-light border border-warning/20 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Only {item.stock} units left • Minimum required: {item.minStock}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.stock === 0 ? "destructive" : "secondary"}>
                    {item.stock === 0 ? "Out of Stock" : "Low Stock"}
                  </Badge>
                  <Button size="sm" className="hover-lift">
                    Reorder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}