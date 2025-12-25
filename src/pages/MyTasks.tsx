import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    CheckSquare,
    Clock,
    AlertCircle,
    Play,
    CheckCircle2,
    Filter,
    Calendar,
    User,
    RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

type Task = {
    _id: string;
    title: string;
    description?: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "in_progress" | "completed" | "cancelled";
    category: string;
    dueDate?: string;
    assigned_by: {
        _id: string;
        name: string;
        email: string;
    };
    actual_start_time?: string;
    actual_end_time?: string;
    completedAt?: string;
    completionNotes?: string;
    createdAt: string;
};

export default function MyTasks() {
    const { toast } = useToast();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const [completionNotes, setCompletionNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
    });

    useEffect(() => {
        fetchTasks();
    }, [statusFilter, priorityFilter]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const filters: any = {};

            if (statusFilter !== "all") filters.status = statusFilter;
            if (priorityFilter !== "all") filters.priority = priorityFilter;

            const response = await api.get("/tasks/my-tasks", { params: filters });
            setTasks(response.data.tasks || []);
            setStats(response.data.stats || {});
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch tasks",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartTask = async (taskId: string) => {
        try {
            setSubmitting(true);
            await api.put(`/tasks/${taskId}/start`);
            toast({
                title: "Task Started",
                description: "Task has been marked as in progress",
            });
            fetchTasks();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to start task",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleCompleteTask = async () => {
        if (!selectedTask) return;

        try {
            setSubmitting(true);
            await api.put(`/tasks/${selectedTask._id}/complete`, {
                completionNotes,
            });
            toast({
                title: "Task Completed",
                description: "Task has been marked as completed",
            });
            setIsCompleteDialogOpen(false);
            setCompletionNotes("");
            fetchTasks();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to complete task",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewDetails = (task: Task) => {
        setSelectedTask(task);
        setIsDetailsOpen(true);
    };

    const openCompleteDialog = (task: Task) => {
        setSelectedTask(task);
        setIsCompleteDialogOpen(true);
    };

    const getPriorityBadge = (priority: string) => {
        const variants: Record<string, any> = {
            low: { className: "bg-gray-500 text-white", label: "Low" },
            medium: { className: "bg-blue-500 text-white", label: "Medium" },
            high: { className: "bg-orange-500 text-white", label: "High" },
            urgent: { className: "bg-red-500 text-white", label: "Urgent" },
        };
        const variant = variants[priority] || variants.medium;
        return <Badge className={variant.className}>{variant.label}</Badge>;
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            pending: { className: "bg-yellow-500 text-white", icon: Clock, label: "Pending" },
            in_progress: { className: "bg-blue-500 text-white", icon: Play, label: "In Progress" },
            completed: { className: "bg-green-500 text-white", icon: CheckCircle2, label: "Completed" },
            cancelled: { className: "bg-gray-500 text-white", icon: AlertCircle, label: "Cancelled" },
        };
        const variant = variants[status] || variants.pending;
        const Icon = variant.icon;
        return (
            <Badge className={variant.className}>
                <Icon className="w-3 h-3 mr-1" />
                {variant.label}
            </Badge>
        );
    };

    const isOverdue = (task: Task) => {
        if (!task.dueDate || task.status === "completed") return false;
        return new Date(task.dueDate) < new Date();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Tasks</h1>
                    <p className="text-muted-foreground">
                        Manage tasks assigned to you
                    </p>
                </div>
                <Button onClick={fetchTasks} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <CheckSquare className="w-8 h-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">In Progress</p>
                                <p className="text-2xl font-bold">{stats.inProgress}</p>
                            </div>
                            <Play className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold">{stats.completed}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Overdue</p>
                                <p className="text-2xl font-bold">{stats.overdue}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tasks Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>View and manage your assigned tasks</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="space-y-4 mb-6">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Priority</label>
                                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Priorities</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="urgent">Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="py-10 text-center text-muted-foreground">
                            Loading tasks...
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="py-10 text-center">
                            <CheckSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No Tasks Found</h3>
                            <p className="text-muted-foreground">
                                {stats.total === 0
                                    ? "You don't have any tasks assigned yet"
                                    : "No tasks match your current filters"}
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Assigned By</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tasks.map((task) => (
                                        <TableRow key={task._id} className={isOverdue(task) ? "bg-red-50 dark:bg-red-950/20" : ""}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{task.title}</p>
                                                    {task.description && (
                                                        <p className="text-sm text-muted-foreground truncate max-w-md">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    {isOverdue(task) && (
                                                        <Badge variant="destructive" className="mt-1">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                                            <TableCell>{getStatusBadge(task.status)}</TableCell>
                                            <TableCell>
                                                {task.dueDate ? (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    "No due date"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {task.assigned_by?.name || "Unknown"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {task.status === "pending" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleStartTask(task._id)}
                                                            disabled={submitting}
                                                        >
                                                            <Play className="w-4 h-4 mr-1" />
                                                            Start
                                                        </Button>
                                                    )}
                                                    {task.status === "in_progress" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openCompleteDialog(task)}
                                                            disabled={submitting}
                                                        >
                                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                                            Complete
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleViewDetails(task)}
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Task Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedTask?.title}</DialogTitle>
                        <DialogDescription>Task details and information</DialogDescription>
                    </DialogHeader>

                    {selectedTask && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {selectedTask.description || "No description provided"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <div className="mt-1">{getPriorityBadge(selectedTask.priority)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="mt-1">{getStatusBadge(selectedTask.status)}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Assigned By</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedTask.assigned_by?.name} ({selectedTask.assigned_by?.email})
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Due Date</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedTask.dueDate
                                            ? new Date(selectedTask.dueDate).toLocaleString()
                                            : "No due date"}
                                    </p>
                                </div>
                            </div>

                            {selectedTask.completionNotes && (
                                <div>
                                    <label className="text-sm font-medium">Completion Notes</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedTask.completionNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Complete Task Dialog */}
            <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Task</DialogTitle>
                        <DialogDescription>
                            Add completion notes for: {selectedTask?.title}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Completion Notes (Optional)</label>
                            <Textarea
                                placeholder="Add any notes about completing this task..."
                                value={completionNotes}
                                onChange={(e) => setCompletionNotes(e.target.value)}
                                rows={4}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCompleteDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleCompleteTask} disabled={submitting}>
                            {submitting ? "Completing..." : "Complete Task"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
