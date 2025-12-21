import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { meetingData, meetingStats } from "@/constant/Meeting";

export default function Meetings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Badge variant="outline">
          <Clock className="w-3 h-3 mr-1" />
          Scheduled
        </Badge>;
      case "In Progress":
        return <Badge variant="default" className="bg-success text-success-foreground">
          <Play className="w-3 h-3 mr-1" />
          In Progress
        </Badge>;
      case "Completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Team Meeting":
        return "bg-primary-light text-primary";
      case "Client Meeting":
        return "bg-success-light text-success";
      case "Review":
        return "bg-warning-light text-warning";
      case "Planning":
        return "bg-destructive-light text-destructive";
      case "Training":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const filteredMeetings = meetingData.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || meeting.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleScheduleMeeting = () => {
    toast({
      title: "Meeting scheduled successfully!",
      description: "Calendar invites have been sent to all participants.",
    });
    setIsScheduleDialogOpen(false);
  };

  const handleJoinMeeting = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
      toast({
        title: "Joining meeting...",
        description: "Opening meeting in a new tab.",
      });
    } else {
      toast({
        title: "No meeting link available",
        description: "This is an in-person meeting.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meeting Management</h1>
          <p className="text-muted-foreground">
            Schedule, manage, and track all your meetings in one place.
          </p>
        </div>
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary shadow-button hover-lift">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>
                Create a new meeting and invite participants.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input id="title" placeholder="Weekly team standup" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Meeting Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team-meeting">Team Meeting</SelectItem>
                      <SelectItem value="client-meeting">Client Meeting</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input id="duration" type="number" placeholder="30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Conference Room A or Online" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link (Optional)</Label>
                  <Input id="meetingLink" placeholder="https://zoom.us/j/..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Input id="participants" placeholder="Enter email addresses separated by commas" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea id="agenda" placeholder="Meeting agenda and topics to discuss..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleScheduleMeeting} className="gradient-success">
                Schedule Meeting
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {meetingStats.map((stat, index) => (
          <Card key={index} className="hover-lift shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                )}
                <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Schedule */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Today's Schedule
          </CardTitle>
          <CardDescription>Your meetings scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetingData.filter(m => m.date === "2025-01-18").map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 bg-primary-light/30 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-lg font-bold text-primary">{meeting.time}</div>
                    <div className="text-xs text-muted-foreground">{meeting.duration}m</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {meeting.location}
                      <Users className="w-3 h-3 ml-2" />
                      {meeting.participants.length} participants
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(meeting.status)}
                  {meeting.meetingLink && (
                    <Button 
                      size="sm" 
                      className="hover-lift"
                      onClick={() => handleJoinMeeting(meeting.meetingLink)}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Meetings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>View and manage all scheduled meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Meeting Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Team Meeting">Team Meeting</SelectItem>
                  <SelectItem value="Client Meeting">Client Meeting</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{meeting.title}</h3>
                        <Badge className={`text-xs ${getTypeColor(meeting.type)}`}>
                          {meeting.type}
                        </Badge>
                        {getStatusBadge(meeting.status)}
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {meeting.duration} minutes
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {meeting.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {meeting.participants.length} participants
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-1">Agenda:</h4>
                        <p className="text-sm text-muted-foreground">{meeting.agenda}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Participants:</span>
                        <div className="flex items-center gap-1">
                          {meeting.participants.slice(0, 3).map((participant, index) => (
                            <Avatar key={index} className="w-6 h-6">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {participant.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.participants.length > 3 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              +{meeting.participants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {meeting.meetingLink && (
                        <Button 
                          size="sm" 
                          className="hover-lift"
                          onClick={() => handleJoinMeeting(meeting.meetingLink)}
                        >
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="hover-lift">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common meeting-related tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
              <Calendar className="w-6 h-6 text-primary" />
              <div className="text-center">
                <div className="font-medium">Calendar View</div>
                <div className="text-xs text-muted-foreground">See all meetings in calendar</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
              <UserPlus className="w-6 h-6 text-success" />
              <div className="text-center">
                <div className="font-medium">Invite Participants</div>
                <div className="text-xs text-muted-foreground">Add people to meetings</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover-lift">
              <Video className="w-6 h-6 text-warning" />
              <div className="text-center">
                <div className="font-medium">Start Instant Meeting</div>
                <div className="text-xs text-muted-foreground">Quick video call</div>
              </div>
            </Button>
            
           
          </div>
        </CardContent>
      </Card>
    </div>
  );
}