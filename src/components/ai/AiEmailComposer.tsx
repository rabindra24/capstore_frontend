import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { geminiAI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AiEmailComposerProps {
    onUseEmail: (subject: string, body: string) => void;
}

export default function AiEmailComposer({ onUseEmail }: AiEmailComposerProps) {
    const [loading, setLoading] = useState(false);
    const [emailType, setEmailType] = useState("general");
    const [recipient, setRecipient] = useState("");
    const [context, setContext] = useState("");
    const [generatedEmail, setGeneratedEmail] = useState<{ subject: string; body: string } | null>(null);
    const { toast } = useToast();

    const emailTypes = [
        { value: "general", label: "General Email" },
        { value: "reply", label: "Reply" },
        { value: "follow-up", label: "Follow-up" },
        { value: "thank-you", label: "Thank You" },
        { value: "apology", label: "Apology" },
        { value: "introduction", label: "Introduction" },
        { value: "reminder", label: "Reminder" },
    ];

    const composeEmail = async () => {
        if (!context.trim()) {
            toast({
                title: "Context Required",
                description: "Please provide some context for the email",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoading(true);
            const { data } = await geminiAI.composeEmail({
                type: emailType,
                recipient: recipient || "Customer",
                details: context,
            });

            setGeneratedEmail(data.email);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to compose email",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const useGeneratedEmail = () => {
        if (generatedEmail) {
            onUseEmail(generatedEmail.subject, generatedEmail.body);
            setGeneratedEmail(null);
            setContext("");
            setRecipient("");
            toast({
                title: "Email Applied",
                description: "AI-generated email has been added to your compose window",
            });
        }
    };

    return (
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    AI Email Composer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!generatedEmail ? (
                    <>
                        {/* Email Type */}
                        <div className="space-y-2">
                            <Label>Email Type</Label>
                            <Select value={emailType} onValueChange={setEmailType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {emailTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Recipient */}
                        <div className="space-y-2">
                            <Label>Recipient (Optional)</Label>
                            <Input
                                placeholder="Customer name"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                            />
                        </div>

                        {/* Context */}
                        <div className="space-y-2">
                            <Label>Context / Details *</Label>
                            <Textarea
                                placeholder="Describe what the email should be about..."
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                rows={4}
                            />
                        </div>

                        {/* Generate Button */}
                        <Button
                            onClick={composeEmail}
                            disabled={loading || !context.trim()}
                            className="w-full gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Composing...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    Compose with AI
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        {/* Generated Email Preview */}
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label className="text-purple-700 dark:text-purple-300">Subject</Label>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-md border">
                                    <p className="text-sm font-medium">{generatedEmail.subject}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-purple-700 dark:text-purple-300">Body</Label>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-md border max-h-64 overflow-y-auto">
                                    <p className="text-sm whitespace-pre-wrap">{generatedEmail.body}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button
                                onClick={useGeneratedEmail}
                                className="flex-1 gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Use This Email
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setGeneratedEmail(null)}
                                className="flex-1"
                            >
                                Generate New
                            </Button>
                        </div>
                    </>
                )}

                {/* Tips */}
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-md text-xs text-purple-800 dark:text-purple-200">
                    <p className="font-medium mb-1">💡 Tips:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Be specific about the purpose</li>
                        <li>Include relevant details or context</li>
                        <li>Mention any specific points to cover</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
