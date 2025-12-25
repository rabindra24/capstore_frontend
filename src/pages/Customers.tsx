import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
    Users,
    Search,
    Filter,
    Eye,
    Download,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    DollarSign,
    Calendar,
    TrendingUp,
    Store as StoreIcon,
    Sparkles,
    Send,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

type Customer = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    firstOrderDate?: string;
    lastOrderDate?: string;
    storeId: {
        _id: string;
        name: string;
        platform: string;
    };
    address?: {
        address1?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
};

export default function Customers() {
    const { toast } = useToast();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [useAI, setUseAI] = useState(false);
    const [aiPrompt, setAIPrompt] = useState("");
    const [sendingEmail, setSendingEmail] = useState(false);
    const [generatingEmail, setGeneratingEmail] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [platformFilter, setPlatformFilter] = useState("all");
    const [sortBy, setSortBy] = useState("totalSpent");
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [platformFilter, sortBy, currentPage, perPage]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const filters: any = {
                page: currentPage,
                perPage: perPage,
            };

            if (platformFilter !== "all") {
                filters.platform = platformFilter;
            }

            if (searchTerm) {
                filters.search = searchTerm;
            }

            const response = await api.get("/customers", { params: filters });
            const customerData = response.data.customers || [];
            const pagination = response.data.pagination || {};

            setCustomers(customerData);
            setTotalPages(pagination.totalPages || 1);
            setTotalCount(pagination.total || 0);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch customers",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchCustomers();
    };

    const handleViewDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDetailsOpen(true);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCustomerIds(customers.map(c => c._id));
        } else {
            setSelectedCustomerIds([]);
        }
    };

    const handleSelectCustomer = (customerId: string, checked: boolean) => {
        if (checked) {
            setSelectedCustomerIds([...selectedCustomerIds, customerId]);
        } else {
            setSelectedCustomerIds(selectedCustomerIds.filter(id => id !== customerId));
        }
    };

    const handleOpenEmailDialog = () => {
        if (selectedCustomerIds.length === 0) {
            toast({
                title: "No customers selected",
                description: "Please select at least one customer to send email",
                variant: "destructive",
            });
            return;
        }
        setIsEmailDialogOpen(true);
    };

    const handleGenerateEmail = async () => {
        if (!aiPrompt.trim()) {
            toast({
                title: "Prompt required",
                description: "Please enter a prompt for AI email generation",
                variant: "destructive",
            });
            return;
        }

        try {
            setGeneratingEmail(true);
            const response = await api.post("/ai/generate-email", { prompt: aiPrompt });
            setEmailMessage(response.data.content || response.data.emailContent || "");
            toast({
                title: "Email generated",
                description: "AI has generated your email content",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to generate email",
                variant: "destructive",
            });
        } finally {
            setGeneratingEmail(false);
        }
    };

    const handleSendBulkEmail = async () => {
        if (!emailSubject.trim() || !emailMessage.trim()) {
            toast({
                title: "Missing fields",
                description: "Please provide both subject and message",
                variant: "destructive",
            });
            return;
        }

        try {
            setSendingEmail(true);
            await api.post("/customers/bulk-email", {
                customerIds: selectedCustomerIds,
                subject: emailSubject,
                message: emailMessage,
                useAI: false,
            });

            toast({
                title: "Emails sent",
                description: `Successfully sent emails to ${selectedCustomerIds.length} customers`,
            });

            setIsEmailDialogOpen(false);
            setEmailSubject("");
            setEmailMessage("");
            setAIPrompt("");
            setUseAI(false);
            setSelectedCustomerIds([]);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to send emails",
                variant: "destructive",
            });
        } finally {
            setSendingEmail(false);
        }
    };

    const handleExportCSV = () => {
        const csvData = customers.map((c) => ({
            Name: c.name,
            Email: c.email,
            Phone: c.phone || "N/A",
            "Total Orders": c.totalOrders,
            "Total Spent": c.totalSpent,
            "Average Order Value": c.averageOrderValue,
            Platform: c.storeId?.platform || "N/A",
            Store: c.storeId?.name || "N/A",
        }));

        const headers = Object.keys(csvData[0]).join(",");
        const rows = csvData.map((row) => Object.values(row).join(","));
        const csv = [headers, ...rows].join("\\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `customers-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const stats = {
        total: totalCount,
        selected: selectedCustomerIds.length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Customer Management</h1>
                    <p className="text-muted-foreground">
                        Manage customers from all your connected stores
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedCustomerIds.length > 0 && (
                        <Button onClick={handleOpenEmailDialog}>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email ({selectedCustomerIds.length})
                        </Button>
                    )}
                    <Button variant="outline" onClick={fetchCustomers}>
                        <Users className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="outline" onClick={handleExportCSV}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Customers</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Selected</p>
                                <p className="text-2xl font-bold">{stats.selected}</p>
                            </div>
                            <Mail className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>View and manage all your customers</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="space-y-4 mb-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleSearch}>Search</Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Platform</label>
                                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Platforms</SelectItem>
                                            <SelectItem value="shopify">Shopify</SelectItem>
                                            <SelectItem value="woocommerce">WooCommerce</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Per Page</label>
                                    <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setCurrentPage(1); }}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10 per page</SelectItem>
                                            <SelectItem value="25">25 per page</SelectItem>
                                            <SelectItem value="50">50 per page</SelectItem>
                                            <SelectItem value="100">100 per page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="py-10 text-center text-muted-foreground">
                            Loading customers...
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="py-10 text-center">
                            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No Customers Found</h3>
                            <p className="text-muted-foreground">
                                No customers available. Sync your stores to see customer data.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedCustomerIds.length === customers.length}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Orders</TableHead>
                                            <TableHead>Total Spent</TableHead>
                                            <TableHead>Platform</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.map((customer) => (
                                            <TableRow key={customer._id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedCustomerIds.includes(customer._id)}
                                                        onCheckedChange={(checked) => handleSelectCustomer(customer._id, checked as boolean)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">{customer.name}</TableCell>
                                                <TableCell>{customer.email}</TableCell>
                                                <TableCell>{customer.phone || "N/A"}</TableCell>
                                                <TableCell>{customer.totalOrders}</TableCell>
                                                <TableCell>₹{customer.totalSpent.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {customer.storeId?.platform || "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleViewDetails(customer)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalCount)} of {totalCount} customers
                                </div>
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
                                    <div className="text-sm">
                                        Page {currentPage} of {totalPages}
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
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Bulk Email Dialog */}
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Send Bulk Email</DialogTitle>
                        <DialogDescription>
                            Send email to {selectedCustomerIds.length} selected customer(s)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="use-ai"
                                checked={useAI}
                                onCheckedChange={(checked) => setUseAI(checked as boolean)}
                            />
                            <label htmlFor="use-ai" className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                Use AI to generate email
                            </label>
                        </div>

                        {useAI && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">AI Prompt</label>
                                <Textarea
                                    placeholder="E.g., Write a promotional email about our new summer collection with 20% discount..."
                                    value={aiPrompt}
                                    onChange={(e) => setAIPrompt(e.target.value)}
                                    rows={3}
                                />
                                <Button
                                    onClick={handleGenerateEmail}
                                    disabled={generatingEmail}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {generatingEmail ? "Generating..." : "Generate Email with AI"}
                                </Button>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                placeholder="Email subject"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea
                                placeholder="Email message (HTML supported)"
                                value={emailMessage}
                                onChange={(e) => setEmailMessage(e.target.value)}
                                rows={10}
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSendBulkEmail} disabled={sendingEmail}>
                                <Send className="w-4 h-4 mr-2" />
                                {sendingEmail ? "Sending..." : "Send Emails"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Customer Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                        <DialogDescription>
                            Complete information about {selectedCustomer?.name}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedCustomer && (
                        <div className="space-y-6">
                            {/* Contact Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{selectedCustomer.email}</span>
                                    </div>
                                    {selectedCustomer.phone && (
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{selectedCustomer.phone}</span>
                                            </div>
                                            <Button size="sm" variant="outline" asChild>
                                                <a href={`tel:${selectedCustomer.phone}`}>
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    Call Now
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                    {selectedCustomer.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                            <div className="text-sm">
                                                {selectedCustomer.address.address1}
                                                <br />
                                                {selectedCustomer.address.city}, {selectedCustomer.address.state}{" "}
                                                {selectedCustomer.address.zip}
                                                <br />
                                                {selectedCustomer.address.country}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Purchase History */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Purchase History</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Orders</p>
                                        <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Total Spent</p>
                                        <p className="text-2xl font-bold">
                                            ₹{selectedCustomer.totalSpent.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Average Order Value</p>
                                        <p className="text-2xl font-bold">
                                            ₹{selectedCustomer.averageOrderValue.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Store</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StoreIcon className="w-4 h-4" />
                                            <span className="font-medium">{selectedCustomer.storeId?.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {selectedCustomer.storeId?.platform}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Dates */}
                            {(selectedCustomer.firstOrderDate || selectedCustomer.lastOrderDate) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Order Timeline</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {selectedCustomer.firstOrderDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    First Order:{" "}
                                                    {new Date(selectedCustomer.firstOrderDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        {selectedCustomer.lastOrderDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    Last Order:{" "}
                                                    {new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
