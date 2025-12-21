import { Search, Star, Inbox, Send, File, Trash2, Archive } from "lucide-react";

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

export { folders, emails }
