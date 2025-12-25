import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { smtpAPI } from "@/lib/api";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function SmtpSettings() {
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);
    const [configured, setConfigured] = useState(false);
    const { toast } = useToast();

    const [settings, setSettings] = useState({
        host: "",
        port: 587,
        secure: false,
        user: "",
        password: "",
        fromName: "",
        fromEmail: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await smtpAPI.getSettings();
            if (data.configured && data.settings) {
                setSettings({
                    ...data.settings,
                    password: "", // Don't show password
                });
                setConfigured(true);
            }
        } catch (error: any) {
            if (error.response?.status !== 404) {
                toast({
                    title: "Error",
                    description: "Failed to load SMTP settings",
                    variant: "destructive",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTestConnection = async () => {
        try {
            setTesting(true);
            const { data } = await smtpAPI.testConnection(settings);

            toast({
                title: "Success",
                description: data.message || "SMTP connection successful!",
            });
        } catch (error: any) {
            toast({
                title: "Connection Failed",
                description: error.response?.data?.message || "Failed to connect to SMTP server",
                variant: "destructive",
            });
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const { data } = await smtpAPI.updateSettings(settings);

            toast({
                title: "Success",
                description: data.message || "SMTP settings saved successfully",
            });
            setConfigured(true);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save SMTP settings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>SMTP Configuration</CardTitle>
                        <CardDescription>
                            Configure email server settings for sending emails
                        </CardDescription>
                    </div>
                    {configured && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Configured
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="host">SMTP Host</Label>
                        <Input
                            id="host"
                            placeholder="smtp.gmail.com"
                            value={settings.host}
                            onChange={(e) => setSettings({ ...settings, host: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="port">SMTP Port</Label>
                        <Input
                            id="port"
                            type="number"
                            placeholder="587"
                            value={settings.port}
                            onChange={(e) => setSettings({ ...settings, port: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Switch
                        id="secure"
                        checked={settings.secure}
                        onCheckedChange={(checked) => setSettings({ ...settings, secure: checked })}
                    />
                    <Label htmlFor="secure">Use Secure Connection (SSL/TLS)</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="user">Username / Email</Label>
                        <Input
                            id="user"
                            type="email"
                            placeholder="your-email@gmail.com"
                            value={settings.user}
                            onChange={(e) => setSettings({ ...settings, user: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={configured ? "••••••••" : "Enter password"}
                            value={settings.password}
                            onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fromName">From Name</Label>
                        <Input
                            id="fromName"
                            placeholder="Company Name"
                            value={settings.fromName}
                            onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fromEmail">From Email</Label>
                        <Input
                            id="fromEmail"
                            type="email"
                            placeholder="noreply@company.com"
                            value={settings.fromEmail}
                            onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleTestConnection}
                        disabled={testing || !settings.host || !settings.user || !settings.password}
                    >
                        {testing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Test Connection
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || !settings.host || !settings.user}
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Settings
                    </Button>
                </div>

                <div className="bg-muted p-4 rounded-md text-sm">
                    <p className="font-medium mb-2">📧 SMTP Configuration Tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>For Gmail: Use port 587 with TLS or port 465 with SSL</li>
                        <li>Enable "Less secure app access" or use App Password</li>
                        <li>Test connection before saving to ensure settings work</li>
                        <li>Password is encrypted before storing in database</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
