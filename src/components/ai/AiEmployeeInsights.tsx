import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, TrendingUp, AlertCircle, CheckCircle2, Target } from "lucide-react";
import { geminiAI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AiEmployeeInsightsProps {
    employee: any;
    stats?: any;
}

export default function AiEmployeeInsights({ employee, stats }: AiEmployeeInsightsProps) {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<any>(null);
    const { toast } = useToast();

    // Early return if no employee data
    if (!employee) {
        return null;
    }

    const generateInsights = async () => {
        try {
            setLoading(true);

            const employeeData = {
                name: employee.name,
                position: employee.position || "Employee",
                department: employee.department || "General",
                joinedDate: employee.joined_date,
                tasksCompleted: stats?.completedTasks || employee.tasksCompleted || 0,
                totalTasks: stats?.totalTasks || employee.totalTasks || 0,
                pendingTasks: stats?.pendingTasks || 0,
                completionRate: stats?.completionRate || 0,
                avgCompletionTime: stats?.avgCompletionTime || 0,
                permissions: employee.permissions || [],
            };

            // Use improveText to generate performance insights
            const prompt = `Analyze this employee's performance data and provide insights:

Employee: ${employeeData.name}
Position: ${employeeData.position}
Department: ${employeeData.department}
Joined: ${new Date(employeeData.joinedDate).toLocaleDateString()}
Tasks Completed: ${employeeData.tasksCompleted}/${employeeData.totalTasks}
Completion Rate: ${employeeData.completionRate.toFixed(1)}%
Avg Completion Time: ${employeeData.avgCompletionTime.toFixed(1)} hours
Pending Tasks: ${employeeData.pendingTasks}

Provide:
1. Performance Summary (2-3 sentences)
2. Strengths (2-3 points)
3. Areas for Improvement (2-3 points)
4. Recommendations (2-3 actionable suggestions)
5. Performance Rating (Excellent/Good/Average/Needs Improvement)`;

            const response = await geminiAI.improveText(prompt, "employee performance analysis");

            // Parse the AI response
            const analysisText = response.data;

            // Extract sections from the response
            const parseInsights = (text: string) => {
                const sections = {
                    summary: "",
                    strengths: [] as string[],
                    improvements: [] as string[],
                    recommendations: [] as string[],
                    rating: "Good",
                };

                // Simple parsing logic
                const lines = text.split('\n').filter(line => line.trim());
                let currentSection = "";

                lines.forEach(line => {
                    const lower = line.toLowerCase();
                    if (lower.includes('summary') || lower.includes('performance:')) {
                        currentSection = "summary";
                    } else if (lower.includes('strength')) {
                        currentSection = "strengths";
                    } else if (lower.includes('improvement') || lower.includes('area')) {
                        currentSection = "improvements";
                    } else if (lower.includes('recommendation')) {
                        currentSection = "recommendations";
                    } else if (lower.includes('rating')) {
                        currentSection = "rating";
                    } else if (line.trim().startsWith('-') || line.trim().startsWith('•') || line.trim().match(/^\d+\./)) {
                        const cleanLine = line.replace(/^[-•\d.]\s*/, '').trim();
                        if (currentSection === "strengths") sections.strengths.push(cleanLine);
                        else if (currentSection === "improvements") sections.improvements.push(cleanLine);
                        else if (currentSection === "recommendations") sections.recommendations.push(cleanLine);
                    } else if (currentSection === "summary" && line.trim()) {
                        sections.summary += line.trim() + " ";
                    } else if (currentSection === "rating" && line.trim()) {
                        sections.rating = line.trim();
                    }
                });

                // Fallback if parsing fails
                if (!sections.summary) {
                    sections.summary = text.substring(0, 200) + "...";
                }

                return sections;
            };

            const parsedInsights = parseInsights(analysisText);
            setInsights(parsedInsights);

            toast({
                title: "AI Insights Generated!",
                description: "Employee performance analysis complete",
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

    const getRatingColor = (rating: string) => {
        const lower = rating.toLowerCase();
        if (lower.includes("excellent")) return "bg-green-500";
        if (lower.includes("good")) return "bg-blue-500";
        if (lower.includes("average")) return "bg-yellow-500";
        return "bg-red-500";
    };

    return (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-blue-700 dark:text-blue-300">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Performance Insights
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
                        <p>Click "Generate Insights" to get AI-powered performance analysis</p>
                        <p className="text-xs mt-2">
                            Includes performance summary, strengths, and recommendations
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-8">
                        <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-blue-600" />
                        <p className="text-muted-foreground">Analyzing employee performance...</p>
                    </div>
                )}

                {insights && (
                    <div className="space-y-4">
                        {/* Performance Rating */}
                        {insights.rating && (
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold">Performance Rating</h4>
                                    <Badge className={`${getRatingColor(insights.rating)} text-white`}>
                                        {insights.rating}
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {insights.summary && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Performance Summary
                                </h4>
                                <p className="text-sm text-muted-foreground bg-white dark:bg-gray-800 p-3 rounded-md">
                                    {insights.summary}
                                </p>
                            </div>
                        )}

                        {/* Strengths */}
                        {insights.strengths && insights.strengths.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {insights.strengths.map((strength: string, idx: number) => (
                                        <li
                                            key={idx}
                                            className="text-sm bg-white dark:bg-gray-800 p-3 rounded-md flex items-start gap-2"
                                        >
                                            <span className="text-green-600 font-bold">✓</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Areas for Improvement */}
                        {insights.improvements && insights.improvements.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-orange-600" />
                                    Areas for Improvement
                                </h4>
                                <ul className="space-y-2">
                                    {insights.improvements.map((improvement: string, idx: number) => (
                                        <li
                                            key={idx}
                                            className="text-sm bg-white dark:bg-gray-800 p-3 rounded-md flex items-start gap-2"
                                        >
                                            <span className="text-orange-600 font-bold">!</span>
                                            <span>{improvement}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Recommendations */}
                        {insights.recommendations && insights.recommendations.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    Recommendations
                                </h4>
                                <ul className="space-y-2">
                                    {insights.recommendations.map((recommendation: string, idx: number) => (
                                        <li
                                            key={idx}
                                            className="text-sm bg-white dark:bg-gray-800 p-3 rounded-md flex items-start gap-2"
                                        >
                                            <span className="text-blue-600 font-bold">→</span>
                                            <span>{recommendation}</span>
                                        </li>
                                    ))}
                                </ul>
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
