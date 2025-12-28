import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { settingsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Key, Trash2, Brain, Mail, Server, Video, MessageSquare } from "lucide-react";
import SmtpSettings from "@/components/settings/SmtpSettings";

export default function ApiKeysSettings() {
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("zoom");
    const { toast } = useToast();

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            setLoading(true);
            const response = await settingsAPI.getApiKeys();
            setApiKeys(response.data.apiKeys || []);
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this API key?")) return;

        try {
            await settingsAPI.deleteApiKey(id);
            toast({
                title: "Success",
                description: "API key deleted successfully",
            });
            fetchApiKeys();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const platforms = [
        { id: "zoom", name: "Zoom", icon: Video, color: "text-blue-500" },
        { id: "gemini", name: "Gemini AI", icon: Brain, color: "text-blue-600" },
        { id: "imap", name: "IMAP", icon: Server, color: "text-gray-600" },
        { id: "smtp", name: "SMTP (Email)", icon: Mail, color: "text-red-600" },
    ];

    const getExistingKey = (platform: string) => {
        return apiKeys.find((k) => k.platform === platform);
    };

    return (
        <Card className="shadow-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Keys & Credentials
                </CardTitle>
                <CardDescription>
                    Manage your API keys and credentials for all integrated platforms. All sensitive data is encrypted.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 h-auto">
                        {platforms.map((platform) => (
                            <TabsTrigger
                                key={platform.id}
                                value={platform.id}
                                className="flex items-center gap-2"
                            >
                                <platform.icon className={`w-4 h-4 ${platform.color}`} />
                                <span className="hidden sm:inline">{platform.name}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {platforms.map((platform) => {
                        const existingKey = getExistingKey(platform.id);

                        return (
                            <TabsContent key={platform.id} value={platform.id} className="space-y-4 mt-6">
                                {platform.id === "smtp" ? (
                                    // SMTP Settings Component
                                    <SmtpSettings />
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <platform.icon className={`w-5 h-5 ${platform.color}`} />
                                                    {platform.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {existingKey ? "Update your credentials" : "Add your credentials to enable integration"}
                                                </p>
                                            </div>
                                            {existingKey && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(existingKey._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>

                                        {existingKey && (
                                            <div className="p-4 bg-secondary/30 rounded-lg mb-4">
                                                <div className="text-sm">
                                                    <div className="font-medium">Status: <span className="text-green-600">Active</span></div>
                                                    <div className="text-muted-foreground">
                                                        Last updated: {new Date(existingKey.updatedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <ApiKeyForm platform={platform.id} onSuccess={fetchApiKeys} />
                                    </>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </CardContent>
        </Card>
    );
}
