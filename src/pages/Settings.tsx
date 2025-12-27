import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Building,
  Palette,
  Key,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ApiKeysSettings from "@/components/ApiKeysSettings";
import StoresSettings from "@/components/StoresSettings";
import BusinessSettings from "@/components/settings/BusinessSettings";
import { Textarea } from "@/components/ui/textarea";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      name: "light",
      label: "Light",
      description: "Clean and bright interface",
      preview: "bg-gradient-to-br from-background to-secondary"
    },
    {
      name: "dark",
      label: "Dark",
      description: "Easy on the eyes",
      preview: "bg-gradient-to-br from-gray-900 to-gray-800"
    },
    {
      name: "system",
      label: "Auto",
      description: "Matches system preference",
      preview: "bg-gradient-to-br from-background via-gray-800 to-background"
    }
  ];

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Theme</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((themeOption) => (
          <div
            key={themeOption.name}
            onClick={() => setTheme(themeOption.name as "light" | "dark" | "system")}
            className={`p-4 rounded-lg cursor-pointer transition-smooth ${theme === themeOption.name
              ? "border-2 border-primary"
              : "border border-border hover:border-primary"
              }`}
          >
            <div className={`w-full h-20 ${themeOption.preview} rounded mb-3`}></div>
            <div className="font-medium">{themeOption.label}</div>
            <div className="text-sm text-muted-foreground">{themeOption.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("business");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get user ID from localStorage (you may need to adjust this based on your auth implementation)
  const getUserId = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData._id || userData.id;
    }
    return "YOUR_USER_ID";
  };

  const userId = getUserId();

  const embedCode = `<!-- AssistCraft Chat Widget -->
<script>
  (function() {
    window.AssistCraftConfig = {
      userId: '${userId}',
      apiUrl: '${SERVER_URL}',
      primaryColor: '#4F46E5',
      position: 'bottom-right',
      welcomeMessage: 'Hi! How can we help you?'
    };
    var script = document.createElement('script');
    script.src = '${SERVER_URL}/widget/chat-widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Copied to clipboard!",
      description: "Embed code has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your business details, integrations, and preferences.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Button
            variant={activeTab === "business" ? "default" : "outline"}
            onClick={() => setActiveTab("business")}
            className="flex items-center justify-center gap-2 h-auto py-3"
          >
            <Building className="w-4 h-4" />
            <span>Business</span>
          </Button>
          <Button
            variant={activeTab === "stores" ? "default" : "outline"}
            onClick={() => setActiveTab("stores")}
            className="flex items-center justify-center gap-2 h-auto py-3"
          >
            <Building className="w-4 h-4" />
            <span>Stores</span>
          </Button>
          <Button
            variant={activeTab === "appearance" ? "default" : "outline"}
            onClick={() => setActiveTab("appearance")}
            className="flex items-center justify-center gap-2 h-auto py-3"
          >
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </Button>
          <Button
            variant={activeTab === "apikeys" ? "default" : "outline"}
            onClick={() => setActiveTab("apikeys")}
            className="flex items-center justify-center gap-2 h-auto py-3"
          >
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </Button>
          <Button
            variant={activeTab === "chatwidget" ? "default" : "outline"}
            onClick={() => setActiveTab("chatwidget")}
            className="flex items-center justify-center gap-2 h-auto py-3"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Widget</span>
          </Button>
        </div>

        {/* Business Settings */}
        <TabsContent value="business" className="space-y-6">
          <BusinessSettings />
        </TabsContent>

        {/* Stores Settings */}
        <TabsContent value="stores" className="space-y-6">
          <StoresSettings />
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ThemeSelector />
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Settings */}
        <TabsContent value="apikeys" className="space-y-6">
          <ApiKeysSettings />
        </TabsContent>

        {/* Chat Widget Settings */}
        <TabsContent value="chatwidget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat Widget
              </CardTitle>
              <CardDescription>
                Add a chat widget to your website to communicate with visitors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Installation Instructions */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Installation Instructions</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Copy the embed code below</li>
                    <li>Paste it into your website's HTML, just before the closing &lt;/body&gt; tag</li>
                    <li>The chat widget will appear on the bottom-right corner of your website</li>
                    <li>All conversations will be visible in the Messages section of your dashboard</li>
                  </ol>
                </div>

                {/* Embed Code */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Embed Code</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={embedCode}
                    readOnly
                    className="font-mono text-xs h-64 resize-none"
                  />
                </div>

                {/* Widget Preview Info */}
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                    Widget Features
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>• Floating chat button on bottom-right corner</li>
                    <li>• Collects visitor name and email</li>
                    <li>• Real-time message delivery</li>
                    <li>• Session persistence across page reloads</li>
                    <li>• Mobile responsive design</li>
                    <li>• Customizable colors and position</li>
                  </ul>
                </div>

                {/* Customization Options */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Customization</h4>
                  <p className="text-sm text-muted-foreground">
                    You can customize the widget by modifying the configuration in the embed code:
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-sm font-mono">
                    <div><span className="text-blue-600">primaryColor</span>: Change the widget color</div>
                    <div><span className="text-blue-600">position</span>: 'bottom-right' or 'bottom-left'</div>
                    <div><span className="text-blue-600">welcomeMessage</span>: Customize the welcome text</div>
                  </div>
                </div>

                {/* Test Widget */}
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-yellow-900 dark:text-yellow-100">
                    Testing
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    After installing the widget on your website, test it by sending a message.
                    You'll see the conversation in the <strong>Messages</strong> section of your dashboard.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}