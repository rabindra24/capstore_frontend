import { useEffect, useState } from "react";
import {
  Search,
  Star,
  Inbox,
  Send,
  File,
  Trash2,
  Archive,
  Mail as MailIcon,
  Clock,
  Filter,
  PaperclipIcon,
  Reply,
  Forward,
  MoreVertical,
  Menu,
  ArrowLeft,
  RefreshCw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import EmailContent from "@/components/Email/EmailContent";
import { folders } from "@/constant/Mail";

/* ---------------- TYPES ---------------- */

type MailItem = {
  id: string;
  subject: string;
  sender: string;
  email: string;
  time: string;
  text: string;
  preview: string;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
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

  const isMobile = useIsMobile();

  useEffect(() => {
    fetchInbox();
  }, []);

  /* ---------------- FETCH INBOX ---------------- */

  const fetchInbox = async () => {
    try {
      setLoading(true)
      
      const res = await fetch(`${SERVER_URL}/api/mail/inbox`);

      if (!res.ok) throw new Error("Failed to fetch inbox");

      const data = await res.json();

      const mapped: MailItem[] = data.mails.map((mail) => ({
        id: mail.messageId,
        subject: mail.subject || "(no subject)",
        sender: mail.from.split("<")[0].replace(/"/g, "").trim(),
        email: mail.from.match(/<(.+)>/)?.[1] || "",
        text: mail.text || "no data avaliable",
        time: new Date(mail.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        preview: mail.text?.slice(0, 120) || "",
        unread: true,
        starred: false,
        hasAttachment: false,
        messageId: mail.messageId,
      })).reverse();

      setEmails(mapped);
      setSelectedEmail(mapped[0] || null);
    } catch (err) {
      console.error("Inbox error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIDEBAR ---------------- */

  const folderSidebar = (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col gap-4 h-full">
      <Button className="w-full">
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
        className={`${isMobile ? (showEmailList ? "flex" : "hidden") : "flex"} ${isMobile ? "w-full" : "w-96"
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
          ) : (
            emails.map((email) => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  if (isMobile) setShowEmailList(false);
                }}
                className={`w-full p-4 text-left hover:bg-muted ${selectedEmail?.id === email.id ? "bg-muted" : ""
                  }`}
              >
                <p className="font-medium">{email.sender}</p>
                <p className="text-sm truncate">{email.subject}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {email.preview}
                </p>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      {/* EMAIL CONTENT */}
      <div
        className={`${isMobile ? (showEmailList ? "hidden" : "flex") : "flex"} 
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
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              <h2 className="text-lg font-semibold">
                {selectedEmail.subject}
              </h2>
            </div>

            <ScrollArea className="flex-1 p-4">
              <EmailContent email={selectedEmail} />
            </ScrollArea>

            <Separator />

            <div className="p-4 flex gap-2">
              <Button size="sm">
                <Reply className="w-4 h-4 mr-2" /> Reply
              </Button>
              <Button size="sm" variant="outline">
                <Forward className="w-4 h-4 mr-2" /> Forward
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
