import {
  Calendar,
  Plus,
  Search,
  Video,
  Clock,
  Users,
  MapPin,
  Phone,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Timer,
  UserPlus,
  Play,
  Edit,
} from "lucide-react";

const meetingData = [
    {
        id: "MTG001",
        title: "Weekly Team Standup",
        type: "Team Meeting",
        date: "2025-01-18",
        time: "09:00",
        duration: 30,
        location: "Conference Room A",
        participants: ["Sarah Johnson", "Michael Chen", "Emily Rodriguez"],
        status: "Scheduled",
        agenda: "Sprint review, blockers discussion, next week planning",
        meetingLink: "https://zoom.us/j/123456789",
    },
    {
        id: "MTG002",
        title: "Client Presentation",
        type: "Client Meeting",
        date: "2025-01-18",
        time: "14:00",
        duration: 60,
        location: "Online",
        participants: ["John Smith", "Lisa Thompson", "David Wilson"],
        status: "In Progress",
        agenda: "Product demo, pricing discussion, Q&A session",
        meetingLink: "https://meet.google.com/abc-defg-hij",
    },
    {
        id: "MTG003",
        title: "Project Review",
        type: "Review",
        date: "2025-01-19",
        time: "10:30",
        duration: 45,
        location: "Conference Room B",
        participants: ["Emily Rodriguez", "Michael Chen"],
        status: "Scheduled",
        agenda: "Design review, technical discussion, timeline update",
        meetingLink: "",
    },

];

const meetingStats = [
    {
        title: "Total Meetings",
        value: "127",
        change: "+12%",
        trend: "up",
        icon: Calendar,
    },
    {
        title: "This Week",
        value: "8",
        change: "+2",
        trend: "up",
        icon: CalendarDays,
    },
    {
        title: "Average Duration",
        value: "45 min",
        change: "-5 min",
        trend: "down",
        icon: Timer,
    },
    {
        title: "Participants",
        value: "156",
        change: "+23",
        trend: "up",
        icon: Users,
    },
];

export { meetingData, meetingStats }