import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { geminiAI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AiSuggestReplyProps {
    conversation: Array<{ role: string; content: string }>;
    onSelectReply: (reply: string) => void;
}

export default function AiSuggestReply({ conversation, onSelectReply }: AiSuggestReplyProps) {
    const [loading, setLoading] = useState(false);
    const [replies, setReplies] = useState<string[]>([]);
    const [tone, setTone] = useState<string>("professional");
    const { toast } = useToast();

    const tones = [
        { value: "professional", label: "💼 Professional", emoji: "💼" },
        { value: "friendly", label: "😊 Friendly", emoji: "😊" },
        { value: "casual", label: "👋 Casual", emoji: "👋" },
        { value: "formal", label: "🎩 Formal", emoji: "🎩" },
    ];

    const generateReplies = async () => {
        try {
            setLoading(true);
            const { data } = await geminiAI.chatReply(conversation, tone);
            setReplies(data.replies || []);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to generate replies",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    AI Reply Suggestions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Tone Selector */}
                <div className="flex gap-2 flex-wrap">
                    {tones.map((t) => (
                        <Button
                            key={t.value}
                            variant={tone === t.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTone(t.value)}
                            className="text-xs"
                        >
                            {t.emoji} {t.label.split(" ")[1]}
                        </Button>
                    ))}
                </div>

                {/* Generate Button */}
                {replies.length === 0 && (
                    <Button
                        onClick={generateReplies}
                        disabled={loading}
                        className="w-full gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate AI Replies
                            </>
                        )}
                    </Button>
                )}

                {/* Suggested Replies */}
                {replies.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Select a reply:
                        </p>
                        {replies.map((reply, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="w-full text-left justify-start h-auto py-3 px-4 hover:bg-purple-100 dark:hover:bg-purple-900"
                                onClick={() => {
                                    onSelectReply(reply);
                                    setReplies([]);
                                }}
                            >
                                <span className="text-sm">{reply}</span>
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={generateReplies}
                            className="w-full"
                        >
                            <Sparkles className="w-3 h-3 mr-2" />
                            Generate New Suggestions
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
