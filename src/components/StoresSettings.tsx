import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { storeAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Store, ShoppingBag, Trash2, RefreshCw, Plus, CheckCircle, XCircle } from "lucide-react";

export default function StoresSettings() {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form state
    const [platform, setPlatform] = useState("woocommerce");
    const [storeName, setStoreName] = useState("");
    const [storeUrl, setStoreUrl] = useState("");

    // Credentials state
    const [consumerKey, setConsumerKey] = useState("");
    const [consumerSecret, setConsumerSecret] = useState("");
    const [accessToken, setAccessToken] = useState("");

    const { toast } = useToast();

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const response = await storeAPI.getAllStores();
            setStores(response.data.stores || []);
        } catch (error: any) {
            console.error("Failed to fetch stores:", error);
        }
    };

    const handleConnectStore = async () => {
        if (!storeName || !storeUrl) {
            toast({
                title: "Missing Information",
                description: "Please provide store name and URL",
                variant: "destructive",
            });
            return;
        }

        // Validate credentials based on platform
        if (platform === "woocommerce") {
            if (!consumerKey || !consumerSecret) {
                toast({
                    title: "Missing Credentials",
                    description: "Please provide Consumer Key and Consumer Secret",
                    variant: "destructive",
                });
                return;
            }
        } else if (platform === "shopify") {
            if (!accessToken) {
                toast({
                    title: "Missing Credentials",
                    description: "Please provide Access Token",
                    variant: "destructive",
                });
                return;
            }
        }

        try {
            setLoading(true);

            // Prepare credentials based on platform
            let credentials: any = {};
            if (platform === "woocommerce") {
                credentials = {
                    siteUrl: storeUrl,
                    consumerKey,
                    consumerSecret,
                };
            } else if (platform === "shopify") {
                credentials = {
                    shopUrl: storeUrl,
                    accessToken,
                };
            }

            // Connect store with credentials
            await storeAPI.connectStore(platform, storeName, storeUrl, credentials);

            toast({
                title: "Success",
                description: "Store connected successfully",
            });

            // Reset form
            setIsAddDialogOpen(false);
            setStoreName("");
            setStoreUrl("");
            setConsumerKey("");
            setConsumerSecret("");
            setAccessToken("");
            fetchStores();
        } catch (error: any) {
            toast({
                title: "Connection Failed",
                description: error.response?.data?.message || error.message || "Failed to connect store",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSyncStore = async (storeId: string) => {
        try {
            await storeAPI.syncStore(storeId);
            toast({
                title: "Sync Started",
                description: "Store data is being synced",
            });
            fetchStores();
        } catch (error: any) {
            toast({
                title: "Sync Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleDisconnectStore = async (storeId: string) => {
        if (!confirm("Are you sure you want to disconnect this store?")) return;

        try {
            await storeAPI.disconnectStore(storeId);
            toast({
                title: "Success",
                description: "Store disconnected",
            });
            fetchStores();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-green-500 text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                    </Badge>
                );
            case "error":
                return (
                    <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        Error
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card className="shadow-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5" />
                            Connected Stores
                        </CardTitle>
                        <CardDescription>
                            Manage your WooCommerce and Shopify store connections
                        </CardDescription>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Connect Store
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Connect New Store</DialogTitle>
                                <DialogDescription>
                                    Enter your store details and credentials to connect
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Platform</Label>
                                    <Select value={platform} onValueChange={(val) => {
                                        setPlatform(val);
                                        // Reset credentials when platform changes
                                        setConsumerKey("");
                                        setConsumerSecret("");
                                        setAccessToken("");
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="woocommerce">
                                                <div className="flex items-center gap-2">
                                                    <ShoppingBag className="w-4 h-4" />
                                                    WooCommerce
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="shopify">
                                                <div className="flex items-center gap-2">
                                                    <Store className="w-4 h-4" />
                                                    Shopify
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Store Name</Label>
                                    <Input
                                        placeholder="My Store"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Store URL</Label>
                                    <Input
                                        placeholder={
                                            platform === "shopify"
                                                ? "https://your-store.myshopify.com"
                                                : "https://your-store.com"
                                        }
                                        value={storeUrl}
                                        onChange={(e) => setStoreUrl(e.target.value)}
                                    />
                                </div>

                                {/* WooCommerce Credentials */}
                                {platform === "woocommerce" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Consumer Key</Label>
                                            <Input
                                                type="password"
                                                placeholder="ck_xxxxxxxxxxxxx"
                                                value={consumerKey}
                                                onChange={(e) => setConsumerKey(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Consumer Secret</Label>
                                            <Input
                                                type="password"
                                                placeholder="cs_xxxxxxxxxxxxx"
                                                value={consumerSecret}
                                                onChange={(e) => setConsumerSecret(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Shopify Credentials */}
                                {platform === "shopify" && (
                                    <div className="space-y-2">
                                        <Label>Access Token</Label>
                                        <Input
                                            type="password"
                                            placeholder="shpat_xxxxxxxxxxxxx"
                                            value={accessToken}
                                            onChange={(e) => setAccessToken(e.target.value)}
                                        />
                                    </div>
                                )}

                                <Button onClick={handleConnectStore} disabled={loading} className="w-full">
                                    {loading ? "Connecting..." : "Connect Store"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {stores.length === 0 ? (
                    <div className="py-10 text-center">
                        <Store className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Stores Connected</h3>
                        <p className="text-muted-foreground mb-4">
                            Connect your first store to start managing orders
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Connect Store
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {stores.map((store) => (
                            <div
                                key={store._id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        {store.platform === "shopify" ? (
                                            <Store className="w-5 h-5 text-primary" />
                                        ) : (
                                            <ShoppingBag className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{store.name}</div>
                                        <div className="text-sm text-muted-foreground">{store.storeUrl}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {getStatusBadge(store.status)}
                                            <Badge variant="outline">{store.platform}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleSyncStore(store._id)}
                                    >
                                        <RefreshCw className="w-4 h-4 mr-1" />
                                        Sync
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDisconnectStore(store._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
