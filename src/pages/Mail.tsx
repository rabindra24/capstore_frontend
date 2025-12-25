import { useEffect, useState } from "react";
import {
  Search,
  Star,
  Inbox,
  Send,
  Trash2,
  Mail as MailIcon,
  PaperclipIcon,
  Reply,
  Menu,
  ArrowLeft,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TemplateSelectDialog } from "@/components/mail/TemplateSelectDialog";
import AiEmailComposer from "@/components/ai/AiEmailComposer";
import { geminiAI } from "@/lib/api";
import type { EmailTemplate } from "@/constants/emailTemplates";


/* ---------------- TYPES ---------------- */

type MailItem = {
  id: string;
  subject: string;
  sender: string;
  email: string;
  time: string;
  text: string;
  html?: string;
  preview: string;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
  attachments?: Array<{ filename: string; contentType: string; size: number }>;
  messageId: string;
};

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ---------------- COMPONENT ---------------- */

export default function Mail() {
  const [emails, setEmails] = useState<MailItem[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<MailItem | null>(null);
  const [selectedFolder, setSelectedFolder] = useState("Inbox");
  const [showEmailList, setShowEmailList] = useState(true);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Compose dialog
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);

  // Reply dialog
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Attachments
  const [composeAttachments, setComposeAttachments] = useState<File[]>([]);
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);

  const isMobile = useIsMobile();
  const { toast } = useToast();

  const starredCount = emails.filter(e => e.starred).length;

  const folders = [
    { name: "Inbox", icon: Inbox, count: emails.length },
    { name: "Starred", icon: Star, count: starredCount },
    { name: "Sent", icon: Send, count: 0 },
    { name: "Trash", icon: Trash2, count: 0 },
  ];

  // Handle template selection
  const handleSelectTemplate = (template: EmailTemplate) => {
    setComposeSubject(template.subject);
    setComposeBody(template.html);
    toast({
      title: "Template loaded",
      description: `${template.name} template has been loaded. Remember to replace variables like {{customer_name}}.`,
    });
  };

  useEffect(() => {
    fetchInbox();
  }, [selectedFolder]);

  /* ---------------- FETCH INBOX ---------------- */

  const fetchInbox = async () => {
    try {
      setLoading(true);

      // Map folder names to backend filter
      const folderParam = selectedFolder.toLowerCase();
      const url = `${SERVER_URL}/api/mail/inbox${folderParam !== 'inbox' ? `?folder=${folderParam}` : ''}`;

      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch inbox");

      const data = await res.json();

      const mapped: MailItem[] = data.mails
        .map((mail: any) => ({
          id: mail.messageId,
          subject: mail.subject || "(no subject)",
          sender: mail.from.split("<")[0].replace(/"/g, "").trim(),
          email: mail.from.match(/<(.+)>/)?.[1] || mail.to || "",
          text: mail.text || "no data available",
          html: mail.html || "",
          time: new Date(mail.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          preview: mail.text?.slice(0, 120) || "",
          unread: true,
          starred: mail.starred || false,
          hasAttachment: mail.attachments && mail.attachments.length > 0,
          attachments: mail.attachments || [],
          messageId: mail.messageId,
        }))
        .reverse();

      setEmails(mapped);
      if (mapped.length > 0 && !selectedEmail) {
        setSelectedEmail(mapped[0]);
      } else if (mapped.length === 0) {
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error("Inbox error:", err);
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STAR/UNSTAR EMAIL ---------------- */

  const handleToggleStar = async (messageId: string) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/mail/star/${messageId}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to toggle star");

      const data = await res.json();

      // Update local state
      setEmails(emails.map(e =>
        e.messageId === messageId ? { ...e, starred: data.starred } : e
      ));

      if (selectedEmail?.messageId === messageId) {
        setSelectedEmail({ ...selectedEmail, starred: data.starred });
      }

      toast({
        title: data.starred ? "Email starred" : "Email unstarred"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to toggle star",
        variant: "destructive",
      });
    }
  };

  /* ---------------- DELETE EMAIL ---------------- */

  const handleDeleteEmail = async (messageId: string) => {
    if (!confirm("Move this email to trash?")) return;

    try {
      const res = await fetch(`${SERVER_URL}/api/mail/${messageId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete email");

      toast({ title: "Email moved to trash" });

      // Remove from current view
      setEmails(emails.filter(e => e.messageId !== messageId));
      if (selectedEmail?.messageId === messageId) {
        setSelectedEmail(null);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete email",
        variant: "destructive",
      });
    }
  };

  /* ---------------- SEND EMAIL ---------------- */

  const handleSendEmail = async () => {
    try {
      setSending(true);

      const res = await fetch(`${SERVER_URL}/api/mail/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          text: composeBody,
          html: `<p>${composeBody.replace(/\n/g, "<br>")}</p>`,
        }),
      });

      if (!res.ok) throw new Error("Failed to send email");

      toast({ title: "Email sent successfully!" });
      setIsComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");

      // Refresh if in Sent folder
      if (selectedFolder === "Sent") {
        fetchInbox();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send email",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  /* ---------------- REPLY EMAIL ---------------- */

  const handleReplyEmail = async () => {
    if (!selectedEmail) return;

    try {
      setSending(true);

      const res = await fetch(`${SERVER_URL}/api/mail/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: selectedEmail.messageId,
          to: selectedEmail.email,
          subject: `Re: ${selectedEmail.subject}`,
          text: replyBody,
          html: `<p>${replyBody.replace(/\n/g, "<br>")}</p><br><hr><p>On ${selectedEmail.time}, ${selectedEmail.sender} wrote:</p><blockquote>${selectedEmail.text}</blockquote>`,
        }),
      });

      if (!res.ok) throw new Error("Failed to send reply");

      toast({ title: "Reply sent successfully!" });
      setIsReplyOpen(false);
      setReplyBody("");

      // Refresh if in Sent folder
      if (selectedFolder === "Sent") {
        fetchInbox();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  /* ---------------- AI REPLY ---------------- */

  const handleAiReply = async () => {
    if (!selectedEmail) return;

    try {
      setAiGenerating(true);

      // Generate AI reply based on the email content
      const context = {

        type: "reply",
        recipient: selectedEmail.sender,
        details: `Reply to email from ${selectedEmail.sender} with subject "${selectedEmail.subject}". Original message: ${selectedEmail.text.slice(0, 500)}`,
      };

      const response = await geminiAI.composeEmail(context);

      // Set the reply body with AI-generated content
      setReplyBody(response.data.email.body);
      setIsReplyOpen(true);

      toast({
        title: "AI Reply Generated!",
        description: "Review and edit the AI-generated reply before sending.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to generate AI reply",
        variant: "destructive",
      });
    } finally {
      setAiGenerating(false);
    }
  };

  /* ---------------- SIDEBAR ---------------- */

  const folderSidebar = (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col gap-4 h-full">
      <Button className="w-full" onClick={() => setIsComposeOpen(true)}>
        <MailIcon className="w-4 h-4 mr-2" />
        Compose
      </Button>

      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => {
                setSelectedFolder(folder.name);
                setFoldersOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${selectedFolder === folder.name
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
              <div className="flex items-center gap-2">
                <folder.icon className="w-4 h-4" />
                <span>{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <Badge
                  variant={
                    selectedFolder === folder.name ? "secondary" : "outline"
                  }
                >
                  {folder.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  /* ---------------- RENDER ---------------- */

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* LEFT SIDEBAR */}
      {!isMobile && <div className="w-64">{folderSidebar}</div>}

      {/* EMAIL LIST */}
      <div
        className={`${isMobile ? (showEmailList ? "flex" : "hidden") : "flex"
          } ${isMobile ? "w-full" : "w-96"
          } bg-card rounded-lg border border-border flex-col`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            {isMobile && (
              <Sheet open={foldersOpen} onOpenChange={setFoldersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  {folderSidebar}
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center gap-2 flex-1">
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={fetchInbox}
                disabled={loading}
                title="Refresh mails"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search mail..." className="pl-10" />
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <p className="p-4 text-muted-foreground">Loading mails...</p>
          ) : emails.length === 0 ? (
            <p className="p-4 text-muted-foreground">No emails in {selectedFolder}</p>
          ) : (
            emails.map((email) => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  if (isMobile) setShowEmailList(false);
                }}
                className={`w-full p-4 text-left hover:bg-muted border-b ${selectedEmail?.id === email.id ? "bg-muted" : ""
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2 flex-1">
                    <p className="font-medium truncate">{email.sender}</p>
                    {email.starred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                    {email.hasAttachment && <PaperclipIcon className="w-3 h-3" />}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {email.time}
                  </span>
                </div>
                <p className="text-sm font-medium truncate">{email.subject}</p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {email.preview}
                </p>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* EMAIL CONTENT */}
      <div
        className={`${isMobile ? (showEmailList ? "hidden" : "flex") : "flex"
          } 
        flex-1 bg-card rounded-lg border border-border flex-col`}
      >
        {!selectedEmail ? (
          <p className="p-6 text-muted-foreground">Select an email</p>
        ) : (
          <>
            <div className="p-4 border-b border-border">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmailList(true)}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <h2 className="text-lg font-semibold mb-2">
                {selectedEmail.subject}
              </h2>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {selectedEmail.sender.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{selectedEmail.sender}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedEmail.email}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {selectedEmail.time}
                </span>
              </div>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <div className="mt-3 p-2 bg-muted rounded-md">
                  <p className="text-xs font-medium mb-1 flex items-center gap-1">
                    <PaperclipIcon className="w-3 h-3" />
                    {selectedEmail.attachments.length} Attachment(s)
                  </p>
                  {selectedEmail.attachments.map((att, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground">
                      {att.filename} ({Math.round(att.size / 1024)}KB)
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              {selectedEmail.html ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                />
              ) : (
                <div className="whitespace-pre-wrap">{selectedEmail.text}</div>
              )}
            </ScrollArea>

            <Separator />

            <div className="p-4 flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => setIsReplyOpen(true)}>
                <Reply className="w-4 h-4 mr-2" /> Reply
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAiReply}
                disabled={aiGenerating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {aiGenerating ? "Generating..." : "AI Reply"}
              </Button>
              <Button
                size="sm"
                variant={selectedEmail.starred ? "default" : "outline"}
                onClick={() => handleToggleStar(selectedEmail.messageId)}
              >
                <Star className={`w-4 h-4 mr-2 ${selectedEmail.starred ? 'fill-current' : ''}`} />
                {selectedEmail.starred ? 'Starred' : 'Star'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteEmail(selectedEmail.messageId)}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </>
        )}
      </div>

      {/* COMPOSE EMAIL DIALOG */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            <div className="grid gap-4">
              <div>
                <Label>To</Label>
                <Input
                  placeholder="recipient@example.com"
                  value={composeTo}
                  onChange={(e) => setComposeTo(e.target.value)}
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  placeholder="Email subject"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Message</Label>
                  <TemplateSelectDialog onSelectTemplate={handleSelectTemplate} />
                </div>
                <Textarea
                  placeholder="Write your message..."
                  rows={10}
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                />
              </div>

              {/* Attachments */}
              <div>
                <Label>Attachments</Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setComposeAttachments(Array.from(e.target.files || []))}
                  className="cursor-pointer"
                />
                {composeAttachments.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {composeAttachments.length} file(s) selected:
                    <ul className="list-disc list-inside">
                      {composeAttachments.map((file, idx) => (
                        <li key={idx}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* AI Email Composer */}
              <div>
                <AiEmailComposer
                  onUseEmail={(subject, body) => {
                    setComposeSubject(subject);
                    setComposeBody(body);
                  }}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsComposeOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={sending}>
              {sending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REPLY EMAIL DIALOG */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedEmail?.sender}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <Label>To</Label>
              <Input value={selectedEmail?.email || ""} disabled />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={`Re: ${selectedEmail?.subject || ""}`}
                disabled
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Write your reply..."
                rows={10}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-xs text-muted-foreground mb-2">
                Original message:
              </p>
              <p className="text-sm whitespace-pre-wrap">
                {selectedEmail?.text.slice(0, 200)}...
              </p>
            </div>

            {/* Attachments */}
            <div>
              <Label>Attachments</Label>
              <Input
                type="file"
                multiple
                onChange={(e) => setReplyAttachments(Array.from(e.target.files || []))}
                className="cursor-pointer"
              />
              {replyAttachments.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {replyAttachments.length} file(s) selected:
                  <ul className="list-disc list-inside">
                    {replyAttachments.map((file, idx) => (
                      <li key={idx}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReplyOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleReplyEmail} disabled={sending}>
              {sending ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
