import { useState } from "react";
import { Search, Star, Inbox, Send, File, Trash2, Archive, Mail as MailIcon, Clock, Filter, PaperclipIcon, Reply, Forward, MoreVertical, Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const folders = [
  { name: "Inbox", icon: Inbox, count: 12, active: true },
  { name: "Starred", icon: Star, count: 3 },
  { name: "Sent", icon: Send, count: 0 },
  { name: "Drafts", icon: File, count: 2 },
  { name: "Archive", icon: Archive, count: 0 },
  { name: "Trash", icon: Trash2, count: 0 },
];

const emails = [
  {
    id: 1,
    sender: "Sarah Johnson",
    email: "sarah.j@company.com",
    subject: "Q4 Budget Review Meeting",
    preview: "Hi team, I'd like to schedule a meeting to review the Q4 budget allocations...",
    time: "10:30 AM",
    unread: true,
    starred: true,
    hasAttachment: true,
  },
  {
    id: 2,
    sender: "Michael Chen",
    email: "m.chen@company.com",
    subject: "Project Status Update",
    preview: "The development team has completed the initial phase of the new feature...",
    time: "9:15 AM",
    unread: true,
    starred: false,
    hasAttachment: false,
  },
  {
    id: 3,
    sender: "Emily Davis",
    email: "emily.d@company.com",
    subject: "Client Feedback - Product Demo",
    preview: "Just got off a call with the client. They loved the demo and have some great feedback...",
    time: "Yesterday",
    unread: false,
    starred: true,
    hasAttachment: true,
  },
  {
    id: 4,
    sender: "James Wilson",
    email: "j.wilson@company.com",
    subject: "Team Lunch Next Friday",
    preview: "Hey everyone! Let's plan a team lunch next Friday. Any preferences on cuisine?",
    time: "Yesterday",
    unread: false,
    starred: false,
    hasAttachment: false,
  },
  {
    id: 5,
    sender: "Linda Martinez",
    email: "linda.m@company.com",
    subject: "New Employee Onboarding",
    preview: "We have three new team members joining us next week. Here's the onboarding schedule...",
    time: "2 days ago",
    unread: false,
    starred: false,
    hasAttachment: true,
  },
];

export default function Mail() {
  const [selectedEmail, setSelectedEmail] = useState(emails[0]);
  const [selectedFolder, setSelectedFolder] = useState("Inbox");
  const [showEmailList, setShowEmailList] = useState(true);
  const [foldersOpen, setFoldersOpen] = useState(false);
  const isMobile = useIsMobile();

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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                selectedFolder === folder.name
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <folder.icon className="w-4 h-4" />
                <span>{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <Badge variant={selectedFolder === folder.name ? "secondary" : "outline"}>
                  {folder.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Left Sidebar - Folders (Desktop) */}
      {!isMobile && (
        <div className="w-64 bg-card rounded-lg border border-border p-4 flex flex-col gap-4">
          <Button className="w-full">
            <MailIcon className="w-4 h-4 mr-2" />
            Compose
          </Button>

          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => setSelectedFolder(folder.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedFolder === folder.name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <folder.icon className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </div>
                  {folder.count > 0 && (
                    <Badge variant={selectedFolder === folder.name ? "secondary" : "outline"}>
                      {folder.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Middle - Email List */}
      <div className={`${isMobile ? (showEmailList ? 'flex' : 'hidden') : 'flex'} ${isMobile ? 'w-full' : 'w-96'} bg-card rounded-lg border border-border flex-col`}>
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search mail..."
                className="pl-10 bg-background"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="divide-y divide-border">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  if (isMobile) setShowEmailList(false);
                }}
                className={`w-full p-4 text-left hover:bg-muted transition-colors ${
                  selectedEmail.id === email.id ? "bg-muted" : ""
                } ${email.unread ? "bg-muted/30" : ""}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback>{email.sender.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm truncate ${email.unread ? "font-semibold" : "font-medium"}`}>
                          {email.sender}
                        </p>
                        {email.starred && (
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                        )}
                        {email.hasAttachment && (
                          <PaperclipIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                    {email.time}
                  </span>
                </div>
                <p className={`text-sm mb-1 truncate ${email.unread ? "font-medium" : ""}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {email.preview}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right - Email Content */}
      <div className={`${isMobile ? (showEmailList ? 'hidden' : 'flex') : 'flex'} flex-1 bg-card rounded-lg border border-border flex-col`}>
        <div className="p-4 md:p-6 border-b border-border">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmailList(true)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to emails
            </Button>
          )}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {selectedEmail.sender.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold mb-1">{selectedEmail.subject}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{selectedEmail.sender}</span>
                  <span>&lt;{selectedEmail.email}&gt;</span>
                  <span>•</span>
                  <span>{selectedEmail.time}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground">
              {selectedEmail.preview}
            </p>
            <p className="mt-4 text-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="mt-4 text-foreground">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
              culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="mt-4 text-foreground">
              Best regards,<br />
              {selectedEmail.sender}
            </p>
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4 flex items-center gap-2 overflow-x-auto">
          <Button size={isMobile ? "sm" : "default"}>
            <Reply className="w-4 h-4 mr-2" />
            {!isMobile && "Reply"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"}>
            <Forward className="w-4 h-4 mr-2" />
            {!isMobile && "Forward"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"}>
            <Archive className="w-4 h-4 mr-2" />
            {!isMobile && "Archive"}
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"}>
            <Trash2 className="w-4 h-4 mr-2" />
            {!isMobile && "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
