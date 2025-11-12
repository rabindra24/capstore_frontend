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
import EmailContent from "@/components/Email/EmailContent";

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
    sender: "Arjun Mehta",
    email: "arjun.mehta@company.in",
    subject: "Q4 Budget Review Meeting",
    preview:
      "Hi team, let's finalize the Q4 budget allocations and review expenses from the last quarter...",
    time: "10:30 AM",
    unread: true,
    starred: true,
    hasAttachment: true,
    content: `
Hi Team,

Let's finalize the **Q4 budget allocations** and review the spending trends from the last quarter.

**Agenda:**
1. Review marketing and development spends.
2. Discuss savings targets.
3. Plan Q1 forecast.

📅 **Meeting Date:** 14th January, 2025  
🕒 **Time:** 11:00 AM  
📍 **Location:** Conference Room B / Google Meet

Regards,  
**Arjun Mehta**  
Finance Head  
[company.in](https://company.in)
`,
    contentHtml: `
      <div style="font-family:Arial, sans-serif; line-height:1.6;">
        <h3 style="color:#2b2b2b;">Q4 Budget Review Meeting</h3>
        <p>Hi Team,</p>
        <p>Let's finalize the <b>Q4 budget allocations</b> and review spending trends from the last quarter.</p>
        <h4>Agenda:</h4>
        <ul>
          <li>Review marketing and development spends</li>
          <li>Discuss savings targets</li>
          <li>Plan Q1 forecast</li>
        </ul>
        <p>
          📅 <b>Meeting Date:</b> 14th January, 2025<br>
          🕒 <b>Time:</b> 11:00 AM<br>
          📍 <b>Location:</b> Conference Room B / Google Meet
        </p>
        <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80" alt="Budget Meeting" style="max-width:100%; border-radius:8px; margin-top:10px;" />
        <p>Regards,<br><b>Arjun Mehta</b><br>Finance Head<br>
        <a href="https://company.in" style="color:#0066cc;">company.in</a></p>
      </div>
    `,
  },
  {
    id: 2,
    sender: "Priya Sharma",
    email: "priya.sharma@company.in",
    subject: "Project Status Update - App Redesign",
    preview:
      "The dev team has wrapped up the UI improvements. QA testing starts tomorrow...",
    time: "9:15 AM",
    unread: true,
    starred: false,
    hasAttachment: false,
    content: `
# Project Status Update - App Redesign

![App Redesign](https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1200&q=80)

The dev team has wrapped up the **UI improvements**. QA testing starts tomorrow.

**Next Steps:**
1. Conduct full regression testing.
2. Validate new design components in multiple browsers.
3. Prepare release notes for marketing.

Thanks,  
**Priya Sharma**  
Product Manager  
[company.in](https://company.in)
    `,
  },
  {
    id: 3,
    sender: "Ravi Iyer",
    email: "ravi.iyer@company.in",
    subject: "Client Feedback - Product Demo (Tata Motors)",
    preview:
      "Had a productive call with the client. They appreciated the demo and suggested minor UI tweaks...",
    time: "Yesterday",
    unread: false,
    starred: true,
    hasAttachment: true,
    content: `
Hi All,

We had a productive discussion with **Tata Motors** regarding the product demo.

**Feedback Highlights:**
- Positive response to the analytics dashboard.  
- Suggested adding more visuals to the insights page.  
- Requested a minor color palette adjustment.

Let's target completing these updates by **Friday**.

Regards,  
**Ravi Iyer**  
Client Success Manager
`,
    contentHtml: `
      <div style="font-family:Arial, sans-serif; line-height:1.6;">
        <h3 style="color:#2b2b2b;">Client Feedback - Product Demo (Tata Motors)</h3>
        <p>Hi All,</p>
        <p>We had a productive discussion with <b>Tata Motors</b> regarding the product demo.</p>
        <h4>Feedback Highlights:</h4>
        <ul>
          <li>Positive response to the analytics dashboard</li>
          <li>Suggested adding more visuals to the insights page</li>
          <li>Requested a minor color palette adjustment</li>
        </ul>
        <p>Let’s target completing these updates by <b>Friday</b>.</p>
        <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80" alt="Client Feedback" style="max-width:100%; border-radius:8px; margin-top:10px;" />
        <p>Regards,<br><b>Ravi Iyer</b><br>Client Success Manager</p>
      </div>
    `,
  },
  {
    id: 4,
    sender: "Neha Kapoor",
    email: "neha.kapoor@company.in",
    subject: "Team Lunch Next Friday",
    preview:
      "Hey everyone! Let's plan a team lunch next Friday. Any preferences — North Indian or South Indian?",
    time: "Yesterday",
    unread: false,
    starred: false,
    hasAttachment: false,
    content: `
Hey everyone 👋,

Let's plan a **team lunch next Friday (17th Jan)** to celebrate our release milestone!

Drop your cuisine preference in this quick poll:  
👉 [Vote here](https://forms.company.in/team-lunch)

Looking forward to catching up!

Cheers,  
**Neha**
`,
    contentHtml: `
      <div style="font-family:Arial, sans-serif; line-height:1.6;">
        <h3 style="color:#2b2b2b;">Team Lunch Next Friday 🍴</h3>
        <p>Hey everyone 👋,</p>
        <p>Let’s plan a <b>team lunch next Friday (17th Jan)</b> to celebrate our release milestone!</p>
        <p>Drop your cuisine preference in this quick poll:<br>
        👉 <a href="https://forms.company.in/team-lunch" style="color:#0066cc;">Vote here</a></p>
        <img src="https://images.unsplash.com/photo-1529692236671-f1dc28f3d7d0?auto=format&fit=crop&w=1200&q=80" alt="Team Lunch" style="max-width:100%; border-radius:8px; margin-top:10px;" />
        <p>Looking forward to catching up!</p>
        <p>Cheers,<br><b>Neha Kapoor</b></p>
      </div>
    `,
  },
  {
    id: 5,
    sender: "Vikram Reddy",
    email: "vikram.reddy@company.in",
    subject: "New Employee Onboarding Schedule",
    preview:
      "We have three new hires joining the tech team next week. Please review the updated onboarding plan...",
    time: "2 days ago",
    unread: false,
    starred: false,
    hasAttachment: true,
    content: `
Dear Team,

We’re welcoming **three new members** to the Tech Department next week.  
Please find attached the onboarding schedule and induction plan.

**New Joinees:**
1. Ananya Verma – Frontend Developer  
2. Rohit Patel – Backend Developer  
3. Sneha Nair – QA Analyst  

Ensure your teams are ready for introductions on **Monday, 9:30 AM**.

Best,  
**Vikram Reddy**  
HR Manager
`,
    contentHtml: `
      <div style="font-family:Arial, sans-serif; line-height:1.6;">
        <h3 style="color:#2b2b2b;">Welcome Our New Team Members 🎉</h3>
        <p>We’re excited to have <b>three new hires</b> joining our Tech Department next week.</p>
        <ul>
          <li><b>Ananya Verma</b> – Frontend Developer</li>
          <li><b>Rohit Patel</b> – Backend Developer</li>
          <li><b>Sneha Nair</b> – QA Analyst</li>
        </ul>
        <p>
          📅 <b>Onboarding:</b> Monday, 9:30 AM<br>
          📍 <b>Location:</b> Bengaluru Office / Google Meet
        </p>
        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80" alt="Welcome Banner" style="max-width:100%; border-radius:8px; margin-top:10px;" />
        <p>Best,<br><b>Vikram Reddy</b><br>HR Manager</p>
      </div>
    `,
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
                className={`w-full p-4 text-left hover:bg-muted transition-colors ${selectedEmail.id === email.id ? "bg-muted" : ""
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
            <EmailContent email={selectedEmail} />
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
