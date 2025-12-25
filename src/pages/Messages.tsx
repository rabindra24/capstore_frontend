import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MessageSquare,
    Send,
    Search,
    RefreshCw,
    User,
    Mail,
    Clock,
    Paperclip,
    X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { FileUpload, UploadedFile } from "@/components/messages/FileUpload";
import AiSuggestReply from "@/components/ai/AiSuggestReply";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type Message = {
    _id: string;
    message: string;
    sender: "visitor" | "admin";
    createdAt: string;
    read: boolean;
    attachments?: Array<{
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
    }>;
};

type Session = {
    _id: string;
    visitorId: string;
    visitorName: string;
    visitorEmail: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    messageCount: number;
};

export default function Messages() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [attachments, setAttachments] = useState<UploadedFile[]>([]);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchSessions();
        // Poll for new messages every 10 seconds
        const interval = setInterval(fetchSessions, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedSession) {
            fetchMessages(selectedSession._id);
            markAsRead(selectedSession._id);
        }
    }, [selectedSession]);

    const fetchSessions = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${SERVER_URL}/api/chat/sessions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch sessions");

            const data = await response.json();
            setSessions(data.sessions || []);
        } catch (error: any) {
            console.error("Fetch sessions error:", error);
        }
    };

    const fetchMessages = async (sessionId: string) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${SERVER_URL}/api/chat/messages/${sessionId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch messages");

            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error: any) {
            console.error("Fetch messages error:", error);
            toast({
                title: "Error",
                description: "Failed to load messages",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (sessionId: string) => {
        try {
            const token = localStorage.getItem("accessToken");
            await fetch(`${SERVER_URL}/api/chat/messages/read`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sessionId }),
            });

            // Update local state
            setSessions(prev =>
                prev.map(s => s._id === sessionId ? { ...s, unreadCount: 0 } : s)
            );
        } catch (error) {
            console.error("Mark as read error:", error);
        }
    };

    const sendReply = async () => {
        if (!selectedSession || (!replyText.trim() && attachments.length === 0)) return;

        try {
            setSending(true);
            const token = localStorage.getItem("accessToken");
            const response = await fetch(`${SERVER_URL}/api/chat/reply`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId: selectedSession._id,
                    message: replyText,
                    attachments: attachments.map(file => ({
                        filename: file.filename,
                        originalName: file.originalName,
                        mimeType: file.mimeType,
                        size: file.size,
                        url: file.url,
                    })),
                }),
            });

            if (!response.ok) throw new Error("Failed to send reply");

            const data = await response.json();

            // Add reply to messages
            setMessages(prev => [...prev, data.reply]);
            setReplyText("");
            setAttachments([]);
            setShowFileUpload(false);

            toast({ title: "Reply sent!" });

            // Refresh sessions
            fetchSessions();
        } catch (error: any) {
            toast({
                title: "Error",
                description: "Failed to send reply",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const filteredSessions = sessions.filter(session =>
        session.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.visitorEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalUnread = sessions.reduce((sum, s) => sum + s.unreadCount, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Messages</h1>
                    <p className="text-muted-foreground">
                        View and respond to chat conversations from your website widget
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    {totalUnread > 0 && (
                        <Badge variant="destructive" className="text-sm">
                            {totalUnread} unread
                        </Badge>
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchSessions}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
                {/* Sessions List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Conversations</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[calc(100vh-400px)]">
                            {filteredSessions.length === 0 ? (
                                <div className="p-6 text-center text-muted-foreground">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No conversations yet</p>
                                    <p className="text-sm mt-1">
                                        Install the chat widget on your website to start receiving messages
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1 p-2">
                                    {filteredSessions.map((session) => (
                                        <div
                                            key={session._id}
                                            onClick={() => setSelectedSession(session)}
                                            className={cn(
                                                "p-4 rounded-lg cursor-pointer transition-colors",
                                                selectedSession?._id === session._id
                                                    ? "bg-primary/10 border-2 border-primary"
                                                    : "hover:bg-muted border-2 border-transparent"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm">
                                                            {session.visitorName}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {session.visitorEmail}
                                                        </div>
                                                    </div>
                                                </div>
                                                {session.unreadCount > 0 && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        {session.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                                {session.lastMessage}
                                            </p>
                                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                {new Date(session.lastMessageTime).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Messages View */}
                <Card className="lg:col-span-2">
                    {selectedSession ? (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{selectedSession.visitorName}</CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Mail className="w-3 h-3" />
                                            {selectedSession.visitorEmail}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    {loading ? (
                                        <p className="text-center text-muted-foreground">Loading messages...</p>
                                    ) : messages.length === 0 ? (
                                        <p className="text-center text-muted-foreground">No messages yet</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg) => (
                                                <div
                                                    key={msg._id}
                                                    className={cn(
                                                        "flex flex-col",
                                                        msg.sender === "admin" ? "items-end" : "items-start"
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[75%] rounded-lg p-3",
                                                            msg.sender === "admin"
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-muted"
                                                        )}
                                                    >
                                                        {msg.message && (
                                                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                        )}

                                                        {/* Attachments */}
                                                        {msg.attachments && msg.attachments.length > 0 && (
                                                            <div className="mt-2 space-y-1">
                                                                {msg.attachments.map((file, idx) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={file.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={cn(
                                                                            "flex items-center gap-2 p-2 rounded text-xs",
                                                                            msg.sender === "admin"
                                                                                ? "bg-primary-foreground/10 hover:bg-primary-foreground/20"
                                                                                : "bg-muted-foreground/10 hover:bg-muted-foreground/20"
                                                                        )}
                                                                    >
                                                                        <Paperclip className="w-3 h-3" />
                                                                        <span className="flex-1 truncate">{file.originalName}</span>
                                                                        <span className="text-xs opacity-70">
                                                                            ({(file.size / 1024).toFixed(1)}KB)
                                                                        </span>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground mt-1">
                                                        {new Date(msg.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* AI Reply Suggestions */}
                                {messages.length > 0 && (
                                    <div className="p-4 border-t">
                                        <AiSuggestReply
                                            conversation={messages.map(msg => ({
                                                role: msg.sender === 'visitor' ? 'user' : 'assistant',
                                                content: msg.message
                                            }))}
                                            onSelectReply={(reply) => setReplyText(reply)}
                                        />
                                    </div>
                                )}

                                {/* Reply Input */}
                                <div className="border-t p-4 space-y-2">
                                    {/* Attached Files */}
                                    {attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {attachments.map((file, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-md text-sm"
                                                >
                                                    <Paperclip className="w-3 h-3" />
                                                    <span className="truncate max-w-[150px]">{file.originalName}</span>
                                                    <button
                                                        onClick={() => removeAttachment(idx)}
                                                        className="hover:text-destructive"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon">
                                                    <Paperclip className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Attach Files</DialogTitle>
                                                </DialogHeader>
                                                <FileUpload
                                                    onUploadComplete={(files) => {
                                                        setAttachments(prev => [...prev, ...files]);
                                                        setShowFileUpload(false);
                                                    }}
                                                    maxFiles={5}
                                                />
                                            </DialogContent>
                                        </Dialog>

                                        <Input
                                            placeholder="Type your reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendReply();
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={sendReply}
                                            disabled={sending || !replyText.trim()}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </>
                    ) : (
                        <CardContent className="flex items-center justify-center h-full">
                            <div className="text-center text-muted-foreground">
                                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">Select a conversation</p>
                                <p className="text-sm mt-1">Choose a conversation from the list to view messages</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
