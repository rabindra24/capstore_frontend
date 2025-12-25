import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Users,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type Meeting = {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  duration?: number;
  joinUrl?: string;
  startUrl?: string;
  status: string;
  zoomMeetingId?: string;
  attendees?: any[];
};

export default function Meetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [zoomConfigured, setZoomConfigured] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    duration: 60,
    agenda: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchMeetings();
    fetchUpcomingMeetings();
    checkZoomStatus();
  }, []);

  const checkZoomStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/meetings/zoom/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setZoomConfigured(data.configured || false);
    } catch (error) {
      console.error("Check Zoom status error:", error);
      setZoomConfigured(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/meetings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error("Fetch meetings error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingMeetings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/meetings/upcoming`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUpcomingMeetings(data.meetings || []);
    } catch (error) {
      console.error("Fetch upcoming meetings error:", error);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      if (!formData.title || !formData.startTime) {
        toast({
          title: "Error",
          description: "Please fill in required fields",
          variant: "destructive",
        });
        return;
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/meetings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timezone: "Asia/Kolkata",
        }),
      });

      if (!response.ok) throw new Error("Failed to create meeting");

      toast({ title: "Meeting created successfully!" });
      setIsCreateDialogOpen(false);
      setFormData({ title: "", description: "", startTime: "", duration: 60, agenda: "" });
      fetchMeetings();
      fetchUpcomingMeetings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateInstantMeeting = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/meetings/instant`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: "Instant Meeting" }),
      });

      if (!response.ok) throw new Error("Failed to create instant meeting");

      const data = await response.json();
      toast({ title: "Instant meeting created!" });

      // Open meeting in new tab
      if (data.meeting.joinUrl) {
        window.open(data.meeting.joinUrl, "_blank");
      }

      fetchMeetings();
      fetchUpcomingMeetings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${SERVER_URL}/api/meetings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete meeting");

      toast({ title: "Meeting deleted" });
      fetchMeetings();
      fetchUpcomingMeetings();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyJoinLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Join link copied!" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const totalMeetings = meetings.length;
  const upcomingCount = upcomingMeetings.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meetings</h1>
          <p className="text-muted-foreground">
            Schedule and manage your Zoom meetings
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateInstantMeeting} variant="outline">
            <Zap className="w-4 h-4 mr-2" />
            Instant Meeting
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
          <Button variant="outline" size="icon" onClick={fetchMeetings}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
            <Calendar className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zoom API</CardTitle>
            <Video className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {zoomConfigured ? (
                <Badge variant="default" className="bg-green-600">Configured</Badge>
              ) : (
                <Badge variant="secondary">Not Configured</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {zoomConfigured ? "Server-to-Server OAuth" : "Configure in Settings"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
            <CardDescription>Your next scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.slice(0, 3).map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{meeting.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(meeting.startTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.duration || 60} min
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {meeting.joinUrl && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => window.open(meeting.joinUrl, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyJoinLink(meeting.joinUrl!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Meetings */}
      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>View and manage all your meetings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading meetings...</p>
          ) : meetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No meetings scheduled</p>
              <p className="text-sm mt-1">Create your first meeting to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{meeting.title}</h4>
                      {meeting.zoomMeetingId && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Zoom
                        </Badge>
                      )}
                    </div>
                    {meeting.description && (
                      <p className="text-sm text-muted-foreground mt-1">{meeting.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(meeting.startTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.duration || 60} min
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {meeting.joinUrl && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => window.open(meeting.joinUrl, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyJoinLink(meeting.joinUrl!)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteMeeting(meeting._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Meeting Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
            <DialogDescription>
              Create a new Zoom meeting
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Team Standup"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Meeting description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="15"
                step="15"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                value={formData.agenda}
                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                placeholder="Meeting agenda"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMeeting}>
              Create Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}