import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { businessAPI } from "@/lib/api";
import { Loader2, Building2 } from "lucide-react";

export default function BusinessSettings() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const [settings, setSettings] = useState({
        companyName: "",
        companyEmail: "",
        companyPhone: "",
        companyAddress: "",
        companyWebsite: "",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await businessAPI.getSettings();
            if (data.settings) {
                setSettings({
                    companyName: data.settings.companyName || "",
                    companyEmail: data.settings.companyEmail || "",
                    companyPhone: data.settings.companyPhone || "",
                    companyAddress: data.settings.companyAddress || "",
                    companyWebsite: data.settings.companyWebsite || "",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to load business settings",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data } = await businessAPI.updateSettings(settings);

            toast({
                title: "Success",
                description: data.message || "Business settings saved successfully",
            });

            // Reload page to update company name in sidebar
            setTimeout(() => window.location.reload(), 1000);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to save business settings",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <CardTitle>Business Information</CardTitle>
                </div>
                <CardDescription>
                    Update your business details and contact information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                            id="companyName"
                            placeholder="VirtuWork"
                            value={settings.companyName}
                            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">
                            This will be displayed in the sidebar
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyEmail">Company Email</Label>
                        <Input
                            id="companyEmail"
                            type="email"
                            placeholder="contact@company.com"
                            value={settings.companyEmail}
                            onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="companyPhone">Company Phone</Label>
                        <Input
                            id="companyPhone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={settings.companyPhone}
                            onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyWebsite">Company Website</Label>
                        <Input
                            id="companyWebsite"
                            type="url"
                            placeholder="https://company.com"
                            value={settings.companyWebsite}
                            onChange={(e) => setSettings({ ...settings, companyWebsite: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Input
                        id="companyAddress"
                        placeholder="123 Business St, City, Country"
                        value={settings.companyAddress}
                        onChange={(e) => setSettings({ ...settings, companyAddress: e.target.value })}
                    />
                </div>

                <div className="flex gap-2 pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={saving || !settings.companyName}
                    >
                        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Settings
                    </Button>
                </div>

                <div className="bg-muted p-4 rounded-md text-sm">
                    <p className="font-medium mb-2">ℹ️ Note:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Company name is required and will be shown in the sidebar</li>
                        <li>Changes will take effect after page reload</li>
                        <li>All fields except company name are optional</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
