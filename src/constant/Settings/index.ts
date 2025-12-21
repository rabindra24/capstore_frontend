import {
    Settings as SettingsIcon,
    Zap,
    MessageSquare,
    Video,
    Instagram,

} from "lucide-react";
const integrations = [
    {
        name: "Zoom",
        description: "Video conferencing and meetings",
        icon: Video,
        connected: true,
        lastSync: "2024-01-16",
    },
    {
        name: "WhatsApp Business",
        description: "Customer communication via WhatsApp",
        icon: MessageSquare,
        connected: false,
        lastSync: null,
    },
    {
        name: "Instagram Business",
        description: "Social media management and analytics",
        icon: Instagram,
        connected: true,
        lastSync: "2024-01-15",
    },
    {
        name: "OpenAI",
        description: "AI-powered insights and automation",
        icon: Zap,
        connected: false,
        lastSync: null,
    },
];

export { integrations }