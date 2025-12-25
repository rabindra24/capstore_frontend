import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { geminiAI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AiOrderInsightsProps {
    order: any;
    customer?: any;
}

export default function AiOrderInsights({ order, customer }: AiOrderInsightsProps) {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<any>(null);
    const { toast } = useToast();

    const generateInsights = async () => {
        try {
            setLoading(true);

            const orderData = {
                orderId: order.orderNumber,
                customerName: order.customerName,
                items: order.items?.length || 0,
                total: order.totalAmount,
                status: order.status,
                date: order.orderDate,
                platform: order.platform,
                customerHistory: customer ? {
                    totalOrders: customer.totalOrders,
                    totalSpent: customer.totalSpent,
                    averageOrderValue: customer.averageOrderValue,
                } : null,
            };

            const response = await geminiAI.orderSummary(orderData);

            // Handle different response structures
            let insightsData;
            if (response.data?.summary) {
                // If response has nested summary
                insightsData = response.data.summary;
            } else if (response.data) {
                // If response.data is the insights object
                insightsData = response.data;
            } else {
                // Fallback to response itself
                insightsData = response;
            }

            console.log("AI Insights Data:", insightsData);
            setInsights(insightsData);

            toast({
                title: "AI Insights Generated!",
                description: "Order analysis complete",
            });
        } catch (error: any) {
            console.error("AI Insights Error:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to generate insights",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-700 dark:text-purple-300">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Order Insights
                    </div>
                    {!insights && (
                        <Button
                            onClick={generateInsights}
                            disabled={loading}
                            size="sm"
                            variant="secondary"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Insights
                                </>
                            )}
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!insights && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Click "Generate Insights" to get AI-powered order analysis</p>
                        <p className="text-xs mt-2">
                            Includes summary, risk assessment, and suggested actions
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-8">
                        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-purple-600" />
                        <p className="text-muted-foreground">Analyzing order with AI...</p>
                    </div>
                )}

                {insights && (
                    <div className="space-y-4">
                        {/* Summary */}
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Summary
                            </h4>
                            <p className="text-sm text-muted-foreground bg-white dark:bg-gray-800 p-3 rounded-md">
                                {insights.summary}
                            </p>
                        </div>

                        {/* Suggested Actions */}
                        {insights.suggestedActions && insights.suggestedActions.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Suggested Actions
                                </h4>
                                <ul className="space-y-2">
                                    {insights.suggestedActions.map((action: string, idx: number) => (
                                        <li
                                            key={idx}
                                            className="text-sm bg-white dark:bg-gray-800 p-3 rounded-md flex items-start gap-2"
                                        >
                                            <span className="text-purple-600 font-bold">•</span>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Risk Assessment */}
                        {insights.riskLevel && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Risk Assessment
                                </h4>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
                                    <Badge
                                        variant={
                                            insights.riskLevel === "low"
                                                ? "default"
                                                : insights.riskLevel === "medium"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {insights.riskLevel.toUpperCase()} RISK
                                    </Badge>
                                    {insights.riskReason && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {insights.riskReason}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Regenerate Button */}
                        <Button
                            onClick={generateInsights}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="w-full"
                        >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Regenerate Insights
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
