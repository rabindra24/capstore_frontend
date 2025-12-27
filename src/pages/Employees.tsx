import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
    DialogHeader,
    DialogTitle,
    DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
    Search,
    Filter,
    UserPlus,
    Target,
    Clock,
    TrendingUp,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { employeeAPI } from "@/lib/api";
import AiEmployeeInsights from "@/components/ai/AiEmployeeInsights";

type Employee = {
    _id: string;
    name: string;
    email: string;
    position?: string | null;
    department?: string | null;
    status: string;
    joined_date: string;
    tasksCompleted: number;
    totalTasks: number;
    permissions?: string[];
};

type Task = {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    start_time: string;
    end_time: string;
    actual_start_time?: string;
    actual_end_time?: string;
    time_taken?: number;
    assigned_by: { name: string; email: string };
    createdAt: string;
};

type EmployeeStats = {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    avgCompletionTime: number;
    completionRate: number;
};

const PERMISSIONS = {
    dashboard: "Dashboard Access",
    inventory: "Inventory Management",
    orders: "Order Management",
    customers: "Customer Management",
    meetings: "Meetings & Calendar",
    mail: "Email Management",
    messages: "Messages & Chat Widget",
    chat: "Live Chat",
    analytics: "Analytics & Reports",
    settings: "Settings Access",
};

export default function Employees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [loading, setLoading] = useState(false);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTaskOpen, setIsTaskOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [selectedEmployeeTasks, setSelectedEmployeeTasks] = useState<Task[]>([]);
    const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState("");

    const [newEmployee, setNewEmployee] = useState({
        name: "",
        email: "",
        position: "",
        department: "",
    });

    const [task, setTask] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        priority: "medium",
        category: "general",
    });

    const { toast } = useToast();

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const { data } = await employeeAPI.getAllEmployees();
            setEmployees(data.employees || []);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load employees",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async () => {
        try {
            const { data } = await employeeAPI.createEmployee({
                ...newEmployee,
                permissions: selectedPermissions,
            });

            toast({
                title: "Employee added successfully",
                description: data.message || "Welcome email sent to employee"
            });
            setIsAddOpen(false);
            setNewEmployee({ name: "", email: "", position: "", department: "" });
            setSelectedPermissions([]);
            fetchEmployees();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to add employee",
                variant: "destructive",
            });
        }
    };

    const handleEditEmployee = async () => {
        try {
            await employeeAPI.updateEmployee(selectedEmployeeId, {
                name: newEmployee.name,
                email: newEmployee.email,
                position: newEmployee.position,
                department: newEmployee.department,
            });

            toast({ title: "Employee updated successfully" });
            setIsEditOpen(false);
            setNewEmployee({ name: "", email: "", position: "", department: "" });
            setSelectedEmployeeId("");
            fetchEmployees();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to update employee",
                variant: "destructive",
            });
        }
    };

    const handleDeleteEmployee = async (employeeId: string) => {
        if (!confirm("Are you sure you want to deactivate this employee?")) return;

        try {
            await employeeAPI.deleteEmployee(employeeId);

            toast({ title: "Employee deactivated successfully" });
            fetchEmployees();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to delete employee",
                variant: "destructive",
            });
        }
    };

    const handleAssignTask = async () => {
        try {
            if (!selectedEmployeeId) {
                toast({
                    title: "Error",
                    description: "Please select an employee",
                    variant: "destructive",
                });
                return;
            }

            await employeeAPI.assignTask(selectedEmployeeId, task);

            toast({ title: "Task assigned successfully" });
            setIsTaskOpen(false);
            setTask({ title: "", description: "", start_time: "", end_time: "", priority: "medium", category: "general" });
            setSelectedEmployeeId("");
            fetchEmployees();
        } catch (error: any) {
            console.log(error)
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to assign task",
                variant: "destructive",
            });
        }
    };

    const handleViewDetails = async (employeeId: string) => {
        try {
            setLoading(true);

            const [tasksResponse, statsResponse] = await Promise.all([
                employeeAPI.getEmployeeTasks(employeeId),
                employeeAPI.getEmployeeStats(employeeId)
            ]);

            setSelectedEmployeeTasks(tasksResponse.data.tasks || []);
            setEmployeeStats({
                totalTasks: statsResponse.data.employee.totalTasks,
                completedTasks: statsResponse.data.employee.completedTasks,
                pendingTasks: statsResponse.data.employee.pendingTasks,
                inProgressTasks: statsResponse.data.employee.inProgressTasks,
                avgCompletionTime: statsResponse.data.employee.avgCompletionTime,
                completionRate: statsResponse.data.employee.completionRate,
            });
            setSelectedEmployeeId(employeeId);
            setIsDetailOpen(true);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message || "Failed to load employee details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const initials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    const filteredEmployees = employees.filter((e) => {
        const matchSearch =
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept =
            departmentFilter === "all" || e.department === departmentFilter;
        return matchSearch && matchDept;
    });

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Employee Management</h1>
                    <p className="text-muted-foreground">
                        Manage employees and assign tasks
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsTaskOpen(true)}>
                        <Target className="w-4 h-4 mr-2" /> Assign Task
                    </Button>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" /> Add Employee
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[200px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent>
                    {loading ? (
                        <div className="py-8 text-center text-muted-foreground">Loading...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Role / Dept</TableHead>
                                    <TableHead>Tasks</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((e) => (
                                    <TableRow key={e._id}>
                                        <TableCell>
                                            <div className="flex gap-3 items-center">
                                                <Avatar>
                                                    <AvatarFallback>{initials(e.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold">{e.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {e.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-medium">{e.position || "—"}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {e.department || "—"}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span>
                                                        {e.tasksCompleted}/{e.totalTasks} tasks
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {e.totalTasks
                                                            ? Math.round(
                                                                (e.tasksCompleted / e.totalTasks) * 100
                                                            )
                                                            : 0}
                                                        %
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        e.totalTasks
                                                            ? (e.tasksCompleted / e.totalTasks) * 100
                                                            : 0
                                                    }
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant={e.status === "active" ? "default" : "secondary"}>
                                                {e.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            {new Date(e.joined_date).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(e._id)}
                                                    title="View Details"
                                                >
                                                    <TrendingUp className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedEmployeeId(e._id);
                                                        setNewEmployee({
                                                            name: e.name,
                                                            email: e.email,
                                                            position: e.position || "",
                                                            department: e.department || "",
                                                        });
                                                        setSelectedPermissions(e.permissions || []);
                                                        setIsEditOpen(true);
                                                    }}
                                                    title="Edit Employee"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteEmployee(e._id)}
                                                    title="Delete Employee"
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* ADD EMPLOYEE DIALOG */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    placeholder="John Doe"
                                    value={newEmployee.name}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    placeholder="john@example.com"
                                    type="email"
                                    value={newEmployee.email}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Position</Label>
                                <Input
                                    placeholder="Sales Executive"
                                    value={newEmployee.position}
                                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Department</Label>
                                <Select
                                    value={newEmployee.department}
                                    onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sales">Sales</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Engineering">Engineering</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <Label className="text-base font-semibold">Access Permissions</Label>
                            <p className="text-sm text-muted-foreground mb-3">
                                Select which routes and features this employee can access
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(PERMISSIONS).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`perm-${key}`}
                                            checked={selectedPermissions.includes(key)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedPermissions([...selectedPermissions, key]);
                                                } else {
                                                    setSelectedPermissions(selectedPermissions.filter(p => p !== key));
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={`perm-${key}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm font-medium flex items-center gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Auto-Generated Password
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                A secure password will be automatically generated and sent to the employee's email address along with their login credentials.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsAddOpen(false);
                            setSelectedPermissions([]);
                        }}>Cancel</Button>
                        <Button onClick={handleAddEmployee}>Add Employee</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT EMPLOYEE DIALOG */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <div>
                            <Label>Name</Label>
                            <Input
                                placeholder="John Doe"
                                value={newEmployee.name}
                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                placeholder="john@example.com"
                                type="email"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Position</Label>
                            <Input
                                placeholder="Sales Executive"
                                value={newEmployee.position}
                                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label>Department</Label>
                            <Select
                                value={newEmployee.department}
                                onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Support">Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditEmployee}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ASSIGN TASK DIALOG */}
            <Dialog open={isTaskOpen} onOpenChange={setIsTaskOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Task</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-3">
                        <div>
                            <Label>Employee</Label>
                            <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((e) => (
                                        <SelectItem key={e._id} value={e._id}>
                                            {e.name} - {e.position || "No position"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Title</Label>
                            <Input
                                placeholder="Task title"
                                value={task.title}
                                onChange={(e) => setTask({ ...task, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Task description"
                                value={task.description}
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Priority</Label>
                                <Select
                                    value={task.priority}
                                    onValueChange={(value) => setTask({ ...task, priority: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Category</Label>
                                <Select
                                    value={task.category}
                                    onValueChange={(value) => setTask({ ...task, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general">General</SelectItem>
                                        <SelectItem value="order_management">Order Management</SelectItem>
                                        <SelectItem value="inventory">Inventory</SelectItem>
                                        <SelectItem value="customer_service">Customer Service</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Start Time</Label>
                                <Input
                                    type="datetime-local"
                                    value={task.start_time}
                                    onChange={(e) => setTask({ ...task, start_time: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Due Date</Label>
                                <Input
                                    type="datetime-local"
                                    value={task.end_time}
                                    onChange={(e) => setTask({ ...task, end_time: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTaskOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignTask}>Assign Task</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EMPLOYEE DETAIL DIALOG */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Employee Performance & Tasks</DialogTitle>
                    </DialogHeader>

                    {employeeStats && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{employeeStats.totalTasks}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{employeeStats.completionRate}%</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Avg Time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatTime(employeeStats.avgCompletionTime)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold mb-3">Task History</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Task</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Time Taken</TableHead>
                                    <TableHead>Assigned By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedEmployeeTasks.map((task) => (
                                    <TableRow key={task._id}>
                                        <TableCell>
                                            <div className="font-medium">{task.title}</div>
                                            <div className="text-sm text-muted-foreground">{task.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    task.status === "completed" ? "default" :
                                                        task.status === "in_progress" ? "secondary" :
                                                            "outline"
                                                }
                                            >
                                                {task.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{task.priority}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {task.time_taken ? formatTime(task.time_taken) : "—"}
                                        </TableCell>
                                        <TableCell>{task.assigned_by.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* AI Performance Insights */}
                    {selectedEmployeeId && employees.find(e => e._id === selectedEmployeeId) && (
                        <AiEmployeeInsights
                            employee={employees.find(e => e._id === selectedEmployeeId)!}
                            stats={employeeStats}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
