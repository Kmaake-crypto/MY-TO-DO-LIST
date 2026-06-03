// --- DOM Element Selectors ---
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

// --- Data State ---
// Retrieve existing array from localStorage, or initialize empty array if none exists
let tasks = JSON.parse(localStorage.getItem("workspace-tasks")) || [];
let currentFilter = "all";

// --- State Synchronization Functions ---
function saveToLocalStorage() {
    localStorage.setItem("workspace-tasks", JSON.stringify(tasks));
}

// --- Core Functionality & Rendering ---
function renderTasks() {
    // Clear out the current UI list entirely before re-rendering
    taskList.innerHTML = "";

    // Apply filtering logic to the array before looping
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "all-completed") return task.completed;
        return true; // Default 'all' filter
    });

    // Handle empty state display
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.style.color = "var(--text-muted)";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "20px";
        emptyMessage.innerText = "No tasks found in this view.";
        taskList.appendChild(emptyMessage);
        return;
    }

    // Build the DOM nodes dynamically for each matching item
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;
        li.setAttribute("data-id", task.id);

        li.innerHTML = `
            <div class="task-left-wrapper">
                <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
                <span class="task-text">${task.title}</span>
            </div>
            <button class="delete-btn" title="Delete Task">&times;</button>
        `;

        taskList.appendChild(li);
    });
}

// --- Event Handlers ---

// Handle Add Task Submission
taskForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Halt default form tracking/reload

    const taskTitle = taskInput.value.trim();
    if (!taskTitle) return;

    // Create unique task object layout
    const newTask = {
        id: Date.now().toString(), // Generates unique identifier string
        title: taskTitle,
        completed: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    
    taskInput.value = ""; // Reset the input box element
});

// Event Delegation for handling clicks inside the task list (Toggle Complete / Delete)
taskList.addEventListener("click", (e) => {
    const targetElement = e.target;
    const taskItem = targetElement.closest(".task-item");
    if (!taskItem) return;
    
    const taskId = taskItem.getAttribute("data-id");

    // Handle Toggle complete click wrapper boundary
    if (targetElement.classList.contains("task-checkbox") || targetElement.closest(".task-left-wrapper")) {
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveToLocalStorage();
        renderTasks();
    }

    // Handle Delete button click action targeting
    if (targetElement.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveToLocalStorage();
        renderTasks();
    }
});

// Handle Filter Tab switching actions
filterButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        // Clear active class from all buttons, then add to clicked button
        filterButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        currentFilter = e.target.getAttribute("data-filter");
        renderTasks();
    });
});

// Initial run to build UI elements saved in memory on application boot
renderTasks();

const dueDateInput = document.getElementById("due-date-input");

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskTitle = taskInput.value.trim();
    if (!taskTitle) return;

    const newTask = {
        id: Date.now().toString(),
        title: taskTitle,
        completed: false,
        dueDate: dueDateInput.value || null  
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    taskInput.value = "";
    dueDateInput.value = "";  
});

li.innerHTML = `
    <div class="task-left-wrapper">
        <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
        <div class="task-content">
            <span class="task-text">${task.title}</span>
            ${task.dueDate ? `<span class="due-date-label ${getDueDateClass(task.dueDate)}">${formatDueDate(task.dueDate)}</span>` : ""}
        </div>
    </div>
    <button class="delete-btn" title="Delete Task">&times;</button>
