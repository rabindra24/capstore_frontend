const handleAssignTask = async () => {
    console.log("=== ASSIGN TASK BUTTON CLICKED ===");
    console.log("Selected Employee ID:", selectedEmployeeId);
    console.log("Task Data:", task);

    try {
        // Validation 1: Check if employee is selected
        if (!selectedEmployeeId) {
            console.log("❌ VALIDATION FAILED: No employee selected");
            toast({
                title: "Error",
                description: "Please select an employee",
                variant: "destructive",
            });
            return;
        }
        console.log("✅ Employee selected:", selectedEmployeeId);

        // Validation 2: Check if title is provided
        if (!task.title || task.title.trim() === "") {
            console.log("❌ VALIDATION FAILED: No task title");
            toast({
                title: "Error",
                description: "Please enter a task title",
                variant: "destructive",
            });
            return;
        }
        console.log("✅ Task title provided:", task.title);

        console.log("✅ All validations passed");
        console.log("📤 Making API request to assign task...");

        // Make API call using employeeAPI
        const { data } = await employeeAPI.assignTask(selectedEmployeeId, task);

        console.log("✅ API Response received:", data);
        console.log("✅ Task assigned successfully!");

        toast({ title: "Task assigned successfully" });
        setIsTaskOpen(false);
        setTask({ title: "", description: "", start_time: "", end_time: "", priority: "medium", category: "general" });
        setSelectedEmployeeId("");
        fetchEmployees();
    } catch (error: any) {
        console.error("❌ ERROR in handleAssignTask:");
        console.error("Error object:", error);
        console.error("Error response:", error.response);
        console.error("Error message:", error.message);

        toast({
            title: "Error",
            description: error.response?.data?.message || error.message || "Failed to assign task",
            variant: "destructive",
        });
    }
};
