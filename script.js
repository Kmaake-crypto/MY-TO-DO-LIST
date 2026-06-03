// --- DOM Element Selectors ---
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const dueDateInput = document.getElementById("due-date-input");

// --- Data State ---
let tasks = JSON.parse(localStorage.getItem("workspace-tasks")) || [];
let currentFilter = "all";

// --- State Synchronization Functions ---
function saveToLocalStorage() {
    localStorage.setItem("workspace-tasks", JSON.stringify(tasks));
}

// --- Helper Functions ---
function getDueDateClass(dateStr) {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr < today) return "overdue";
    if (dateStr === today) return "today";
    return "upcoming";
}

function formatDueDate(dateStr) {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) return "● Due today";
    const date = new Date(dateStr + "T00:00:00");
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return dateStr < today ? `⚠ Overdue · ${label}` : `Due ${label}`;
}

// --- Core Functionality & Rendering ---
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "all-completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.style.color = "var(--text-muted)";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "20px";
        emptyMessage.innerText = "No tasks found in this view.";
        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;
        li.setAttribute("data-id", task.id);

        li.innerHTML = `
            <div class="task-left-wrapper">
                <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
                <div class="task-content">
                    <span class="task-text">${task.title}</span>
                    ${task.dueDate ? `<span class="due-date-label ${getDueDateClass(task.dueDate)}">${formatDueDate(task.dueDate)}</span>` : ""}
                </div>
            </div>
            <button class="delete-btn" title="Delete Task">&times;</button>
        `;

        taskList.appendChild(li);
    });
}

// --- Event Handlers ---
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

taskList.addEventListener("click", (e) => {
    const targetElement = e.target;
    const taskItem = targetElement.closest(".task-item");
    if (!taskItem) return;

    const taskId = taskItem.getAttribute("data-id");

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

    if (targetElement.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveToLocalStorage();
        renderTasks();
    }
});

filterButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        currentFilter = e.target.getAttribute("data-filter");
        renderTasks();
    });
});

renderTasks();
