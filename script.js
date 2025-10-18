let tasks = [
    { id: 1, text: 'Complete project proposal', completed: false, priority: 'high' },
    { id: 2, text: 'Review code changes', completed: true, priority: 'medium' },
    { id: 3, text: 'Update documentation', completed: false, priority: 'low' }
];
let currentFilter = 'all';
let editingTaskId = null;

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('prioritySelect');
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority.value
    };

    tasks.push(newTask);
    input.value = '';
    priority.value = 'medium';
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}

function startEdit(id) {
    editingTaskId = id;
    renderTasks();
}

function saveEdit(id) {
    const input = document.getElementById(`edit-input-${id}`);
    const select = document.getElementById(`edit-select-${id}`);
    const task = tasks.find(t => t.id === id);

    if (task && input.value.trim() !== '') {
        task.text = input.value.trim();
        task.priority = select.value;
        editingTaskId = null;
        renderTasks();
    }
}

function cancelEdit() {
    editingTaskId = null;
    renderTasks();
}

function setFilter(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`filter-${filter}`).classList.add('active');
    
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    document.getElementById('count-all').textContent = tasks.length;
    document.getElementById('count-active').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('count-completed').textContent = tasks.filter(t => t.completed).length;

    const completedCount = tasks.filter(t => t.completed).length;
    document.getElementById('stats').textContent = 
        `${completedCount} of ${tasks.length} tasks completed`;

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Add a new task to get started!</p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => {
        if (editingTaskId === task.id) {
            return `
                <div class="task-item">
                    <div class="edit-mode">
                        <input 
                            type="text" 
                            class="edit-input" 
                            id="edit-input-${task.id}" 
                            value="${task.text}"
                        >
                        <select class="edit-select" id="edit-select-${task.id}">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                        <button class="btn btn-success" onclick="saveEdit(${task.id})">Save</button>
                        <button class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="task-item">
                <div 
                    class="task-checkbox ${task.completed ? 'completed' : ''}" 
                    onclick="toggleTask(${task.id})"
                ></div>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                <div class="task-actions">
                    <button class="icon-btn edit-btn" onclick="startEdit(${task.id})">✏️</button>
                    <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

renderTasks();