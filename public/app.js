document.addEventListener('DOMContentLoaded', function() { 
    
    const toggleButton = document.getElementById('toggle-add-task');
    const addTaskInput = document.getElementById('add-task');
    const confirmButton = document.getElementById('confirm-add');
    const addDateInput = document.getElementById('add-date');
    const addPriorityInput = document.getElementById('add-priority');
    const inputContainer = document.querySelector('.input-container');
    let taskBox = document.querySelector('.tasks-container');
    const addContainer = document.querySelector('.add-task-container');
    let timeContainer = document.querySelector(".Time-container");
    let sky = document.querySelector(".sky");

    // Time based greetings
    let timeNow = new Date().getHours();

    let greeting = 
    timeNow >= 5 && timeNow < 12
     ? "Good Morning"
     : timeNow >= 12 && timeNow < 18
     ? "Good Afternoon"
     : (sky.style.backgroundColor = "rgb(50, 98, 168)", 
        taskBox.style.backgroundColor = "rgb(50, 98, 168)", 
        
        "Good Evening");
    
    timeContainer.innerHTML = `<h1>${greeting}</h1>`;

    // EVENT LISTENERS

    // Toggle input field visibility when + button is clicked
    toggleButton.addEventListener('click', function(e) {
        e.stopPropagation();
        inputContainer.classList.toggle('hidden');
        
        if (!inputContainer.classList.contains('hidden')) {
            addTaskInput.focus();
        }
    });

    // Add task when confirm button is clicked
    confirmButton.addEventListener('click', addTask);   
    
    // Add task when Enter key is pressed in input field
    addTaskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    // TASK MANAGEMENT

    // Adding task 
    async function addTask() {
        const taskText = addTaskInput.value.trim();
        const taskDate = addDateInput.value.trim();
        const taskPriority = addPriorityInput.value.trim();

        if (taskText) {
            const newTask = {
                text: taskText,
                completed: false
            };

            // Only add date and priority if they have values
            if (taskDate) newTask.date = taskDate;
            if (taskPriority) newTask.priority = taskPriority;

            console.log("📤 New task being sent:", newTask);

            try {
                const res = await fetch("/api/tasks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTask)
                });
                const savedTask = await res.json();

                console.log("✅ Saved task from backend:", savedTask);

                renderTask(savedTask);

                // Reset inputs
                addTaskInput.value = "";
                addDateInput.value = "";
                addPriorityInput.value = "";
                inputContainer.classList.add("hidden");
            } catch (err) {
                console.error("❌ Error adding task:", err);
            }
        }
    }

    // RENDER TASK TO DOM
    // THIS IS THE KEY CHANGE - New HTML structure with task-content wrapper
    function renderTask(task) {
        console.log("🎨 Rendering task:", task);
        console.log("   - Text:", task.text);
        console.log("   - Date:", task.date);
        console.log("   - Priority:", task.priority);
        
        const taskElement = document.createElement("div");
        taskElement.className = "Box";
        
        // NEW STRUCTURE: Wrapped in task-content div with task-meta for date/priority
        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                <div class="task-meta">
                    ${task.date ? `<span class="task-date">📅 ${task.date}</span>` : ''}
                    ${task.priority ? `<span class="task-priority">⭐ ${task.priority}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="complete-btn">✓</button>
                <button class="remove-btn">×</button>
            </div>
        `;
        
        taskBox.appendChild(taskElement);
        setupTaskEvents(taskElement, task._id);
    }

    // SETUP EVENT HANDLERS FOR TASK
    function setupTaskEvents(taskElement, taskId) {

        // Complete task
        taskElement.querySelector(".complete-btn").addEventListener("click", async () => {
            const textElement = taskElement.querySelector(".task-text");
            const completed = !textElement.classList.contains("completed");

            // CHANGED: "done" -> "completed" to match schema
            await fetch(`/api/tasks/${taskId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: completed })
            });

            textElement.classList.toggle("completed");
        });

        // Remove task
        taskElement.querySelector(".remove-btn").addEventListener("click", async () => {
            await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
            taskElement.remove();
        });
    }

    // LOAD TASKS FROM BACKEND
    async function loadTasks() {
        try {
            const res = await fetch("/api/tasks");
            const tasks = await res.json();
            console.log("📥 Loaded tasks from backend:", tasks);
            tasks.forEach(task => renderTask(task));
        } catch (err) {
            console.error("❌ Error loading tasks:", err);
        }
    }

    // Close input container when clicking outside
    document.addEventListener('click', function(e) {
        if (!addContainer.contains(e.target) && 
            !inputContainer.contains(e.target) && 
            !inputContainer.classList.contains('hidden')) {
            inputContainer.classList.add('hidden');
        }
    });

    // Load tasks on page load
    loadTasks();
});