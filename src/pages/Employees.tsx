import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  DialogDescription,
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
import {
  Search,
  Filter,
  Star,
  Target,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ---------------- ENV ---------------- */

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

/* ---------------- TYPES ---------------- */

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
};

/* ---------------- COMPONENT ---------------- */

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    department: "",
  });

  const [task, setTask] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  const { toast } = useToast();

  /* ---------------- FETCH EMPLOYEES ---------------- */

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/employees`);
      const data = await res.json();

      const mapped = data.employees.map((e: any) => ({
        ...e,
        tasksCompleted: e.tasksCompleted ?? 0,
        totalTasks: e.totalTasks ?? 0,
      }));

      setEmployees(mapped);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ---------------- CREATE EMPLOYEE ---------------- */

  const handleAddEmployee = async () => {
    try {
      await fetch(`${SERVER_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      toast({ title: "Employee added successfully" });
      setIsAddOpen(false);
      setNewEmployee({ name: "", email: "", password: "", position: "", department: "" });
      fetchEmployees();
    } catch {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  /* ---------------- ASSIGN TASK ---------------- */

  const handleAssignTask = async () => {
    try {
      await fetch(`${SERVER_URL}/api/employees/assign/${selectedEmployeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      toast({ title: "Task assigned successfully" });
      setIsTaskOpen(false);
      setTask({ title: "", description: "", start_time: "", end_time: "" });
      fetchEmployees();
    } catch {
      toast({
        title: "Error",
        description: "Failed to assign task",
        variant: "destructive",
      });
    }
  };

  /* ---------------- HELPERS ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}
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

      {/* FILTERS */}
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
          </SelectContent>
        </Select>
      </div>

      {/* EMPLOYEE TABLE */}
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role / Dept</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
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
                    {/* ✅ TASK COMPLETION BOX */}
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
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>

                  <TableCell>
                    {new Date(e.joined_date).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ADD EMPLOYEE DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3">
            <Input placeholder="Name" onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
            <Input placeholder="Email" onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} />
            <Input placeholder="Password" type="password" onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} />
            <Input placeholder="Position" onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })} />
            <Input placeholder="Department" onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
          </div>

          <DialogFooter>
            <Button onClick={handleAddEmployee}>Add</Button>
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
            <Select onValueChange={setSelectedEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input placeholder="Title" onChange={(e) => setTask({ ...task, title: e.target.value })} />
            <Textarea placeholder="Description" onChange={(e) => setTask({ ...task, description: e.target.value })} />
            <Input type="datetime-local" onChange={(e) => setTask({ ...task, start_time: e.target.value })} />
            <Input type="datetime-local" onChange={(e) => setTask({ ...task, end_time: e.target.value })} />
          </div>

          <DialogFooter>
            <Button onClick={handleAssignTask}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
