const Task = require("../models/Task");

// @desc Get all tasks
// @route GET /api/tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 }); // newest first
        console.log(`📋 Fetched ${tasks.length} tasks`);
        res.json(tasks);
    } catch (err) {
        console.error("❌ Error fetching tasks:", err);
        res.status(500).json({ error: err.message });
    }
};

// @desc Create a new task
// @route POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        console.log("📥 Incoming request body:", req.body);
        
        const task = new Task({
            text: req.body.text,
            date: req.body.date,           // ✅ Save date
            priority: req.body.priority,   // ✅ Save priority
            completed: req.body.completed || false
        });
        
        const savedTask = await task.save();
        console.log("✅ Saved task:", savedTask);
        res.status(201).json(savedTask);
    } catch (err) {
        console.error("❌ Error creating task:", err);
        res.status(500).json({ error: err.message });
    }
};

// @desc Update a task
// @route PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔄 Updating task ${id}:`, req.body);
        
        const updatedTask = await Task.findByIdAndUpdate(
            id, 
            req.body, 
            {
                new: true,           // return updated document
                runValidators: true  // validate before update
            }
        );
        
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        console.log("✅ Updated task:", updatedTask);
        res.json(updatedTask);
    } catch (err) {
        console.error("❌ Error updating task:", err);
        res.status(500).json({ error: err.message });
    }
};

// @desc Delete a task
// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Deleting task ${id}`);
        
        const deletedTask = await Task.findByIdAndDelete(id);
        
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        console.log("✅ Deleted task:", deletedTask._id);
        res.json({ message: "Task deleted", id: deletedTask._id });
    } catch (err) {
        console.error("❌ Error deleting task:", err);
        res.status(500).json({ error: err.message });
    }
};