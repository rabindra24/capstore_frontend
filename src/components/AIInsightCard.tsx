import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIInsightCardProps {
    type: "inventory" | "sales" | "analytics" | "task";
    title: string;
    insight: string;
    severity?: "info" | "warning" | "success" | "critical";
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function AIInsightCard({ type, title, insight, severity = "info", action }: AIInsightCardProps) {
    const getIcon = () => {
        switch (type) {
            case "inventory":
                return <AlertTriangle className="w-5 h-5" />;
            case "sales":
                return <TrendingUp className="w-5 h-5" />;
            case "analytics":
                return <Lightbulb className="w-5 h-5" />;
            case "task":
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <Lightbulb className="w-5 h-5" />;
        }
    };

    const getSeverityColor = () => {
        switch (severity) {
            case "critical":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "warning":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "success":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            default:
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        }
    };

    return (
        <Card className={`border ${getSeverityColor()}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <CardTitle className="text-base">{title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="ml-2">
                        AI Powered
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-sm">{insight}</CardDescription>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-3 text-sm font-medium hover:underline"
                    >
                        {action.label} →
                    </button>
                )}
            </CardContent>
        </Card>
    );
}
