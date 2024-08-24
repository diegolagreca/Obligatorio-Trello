let tasks = [];
let currentTaskIndex = null;

document.getElementById('addTaskBtn').addEventListener('click', function () {
    document.getElementById('taskForm').reset();
    currentTaskIndex = null;  // Reseteamos para indicar que es una nueva tarea

    openTaskModal();
});

document.getElementById('cancelTaskBtn').addEventListener('click', function () {
    closeTaskModal();
});

document.getElementById('saveTaskBtn').addEventListener('click', function () {
    saveTask();
});

function openTaskModal() {
    document.getElementById('taskModal').classList.add('is-active');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('is-active');
    currentTaskIndex = null;  
}

function saveTask() {
    let title = document.getElementById('taskTitle').value;
    let description = document.getElementById('taskDescription').value;
    let assignedTo = document.getElementById('taskAssigned').value;
    let priority = document.getElementById('taskPriority').value;
    let status = document.getElementById('taskStatus').value;
    let deadline = document.getElementById('taskDeadline').value;

    let task = {
        title,
        description,
        assignedTo,
        priority,
        status,
        deadline
    };

    if (currentTaskIndex !== null) {
        // Modo edición
        tasks[currentTaskIndex] = task;
    } else {
        // Modo creación
        tasks.push(task);
    }

    renderTasks();
    closeTaskModal();
}

function renderTasks() {
    let columns = {
        backlog: document.getElementById('backlog').querySelector('.tasks'),
        todo: document.getElementById('todo').querySelector('.tasks'),
        'in-progress': document.getElementById('in-progress').querySelector('.tasks'),
        blocked: document.getElementById('blocked').querySelector('.tasks'),
        done: document.getElementById('done').querySelector('.tasks')
    };

    // Limpiar tareas actuales
    for (let column in columns) {
        columns[column].innerHTML = '';
    }

    // Renderizar nuevas tareas
    tasks.forEach((task, index) => {
        let taskElement = document.createElement('div');
        taskElement.classList.add('notification', 'is-info');
        taskElement.innerHTML = `<b>${task.title}</b><p>${task.description}</p>`;
        columns[task.status].appendChild(taskElement);

        // Evento para editar la tarea al hacer clic
        taskElement.addEventListener('click', function () {
            editTask(task, index);
        });
    });
}

function editTask(task, index) {
    currentTaskIndex = index;  // Guardamos el índice de la tarea que se está editando

    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskAssigned').value = task.assignedTo;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskDeadline').value = task.deadline;

    openTaskModal();
}
