import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { settingsAPI } from "@/lib/api";

interface ApiKeyFormProps {
    platform: string;
    onSuccess?: () => void;
}

export function ApiKeyForm({ platform, onSuccess }: ApiKeyFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await settingsAPI.updateApiKeys(platform, formData);
            toast({
                title: "Success",
                description: `${platform} credentials updated successfully`,
            });
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderFields = () => {
        switch (platform) {
            case "shopify":
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Shop URL</label>
                            <Input
                                placeholder="https://your-store.myshopify.com"
                                value={formData.shopUrl || ""}
                                onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Access Token</label>
                            <Input
                                type="password"
                                placeholder="shpat_..."
                                value={formData.accessToken || ""}
                                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                            />
                        </div>
                    </>
                );

            case "woocommerce":
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Site URL</label>
                            <Input
                                placeholder="https://your-store.com"
                                value={formData.siteUrl || ""}
                                onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Consumer Key</label>
                            <Input
                                placeholder="ck_..."
                                value={formData.consumerKey || ""}
                                onChange={(e) => setFormData({ ...formData, consumerKey: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Consumer Secret</label>
                            <Input
                                type="password"
                                placeholder="cs_..."
                                value={formData.consumerSecret || ""}
                                onChange={(e) => setFormData({ ...formData, consumerSecret: e.target.value })}
                            />
                        </div>
                    </>
                );

            case "gemini":
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-medium">API Key</label>
                        <Input
                            type="password"
                            placeholder="AIza..."
                            value={formData.apiKey || ""}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        />
                    </div>
                );

            case "zoom":
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Account ID</label>
                            <Input
                                placeholder="Your Zoom Account ID"
                                value={formData.accountId || ""}
                                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Found in your Zoom App credentials (Server-to-Server OAuth)
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Client ID</label>
                            <Input
                                placeholder="Your Zoom Client ID"
                                value={formData.clientId || ""}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Client Secret</label>
                            <Input
                                type="password"
                                placeholder="Your Zoom Client Secret"
                                value={formData.clientSecret || ""}
                                onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                            />
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <p className="text-xs text-blue-900 dark:text-blue-100">
                                <strong>Note:</strong> Use Server-to-Server OAuth app type in Zoom Marketplace.
                                No redirect URI needed.
                            </p>
                        </div>
                    </>
                );

            case "email":
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">SMTP Host</label>
                            <Input placeholder="smtp.example.com" value={formData.emailHost || ""} onChange={(e) => setFormData({ ...formData, emailHost: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">SMTP Port</label>
                            <Input type="number" placeholder="465" value={formData.emailPort || ""} onChange={(e) => setFormData({ ...formData, emailPort: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email User</label>
                            <Input placeholder="user@example.com" value={formData.emailUser || ""} onChange={(e) => setFormData({ ...formData, emailUser: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Password</label>
                            <Input type="password" value={formData.emailPass || ""} onChange={(e) => setFormData({ ...formData, emailPass: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Admin Email</label>
                            <Input placeholder="admin@example.com" value={formData.adminEmail || ""} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} />
                        </div>
                    </>
                );

            case "imap":
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">IMAP Host</label>
                            <Input placeholder="imap.example.com" value={formData.imapHost || ""} onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">IMAP Port</label>
                            <Input type="number" placeholder="993" value={formData.imapPort || ""} onChange={(e) => setFormData({ ...formData, imapPort: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">IMAP User</label>
                            <Input value={formData.imapUser || ""} onChange={(e) => setFormData({ ...formData, imapUser: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">IMAP Password</label>
                            <Input type="password" value={formData.imapPassword || ""} onChange={(e) => setFormData({ ...formData, imapPassword: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="imapTls"
                                checked={formData.imapTls || false}
                                onChange={(e) => setFormData({ ...formData, imapTls: e.target.checked })}
                            />
                            <label htmlFor="imapTls" className="text-sm">Use TLS</label>
                        </div>
                    </>
                );

            case "twilio":
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Account SID</label>
                            <Input
                                placeholder="AC..."
                                value={formData.accountSid || ""}
                                onChange={(e) => setFormData({ ...formData, accountSid: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Auth Token</label>
                            <Input
                                type="password"
                                placeholder="Your Twilio Auth Token"
                                value={formData.authToken || ""}
                                onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">WhatsApp Number</label>
                            <Input
                                placeholder="+14155238886"
                                value={formData.whatsappNumber || ""}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Your Twilio WhatsApp number (include country code with +)
                            </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                            <p className="text-xs text-green-900 dark:text-green-100">
                                <strong>Webhook URL:</strong> Configure this in Twilio console:<br />
                                <code className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded mt-1 inline-block">
                                    {window.location.origin}/api/whatsapp/webhook
                                </code>
                            </p>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {renderFields()}
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Saving..." : "Save Credentials"}
            </Button>
        </form>
    );
}
