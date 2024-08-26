const addTaskButton = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModalButton = document.querySelector('.modal-background');
const cancelTaskButton = document.getElementById('cancelTaskBtn');
const taskForm = document.getElementById('taskForm');
const toggleModeBtn = document.getElementById('toggleModeBtn');

// Mapa de conversiones de valores a nombres visibles
const userMap = {
    "Persona1": "Juan",
    "Persona2": "Diego",
    "Persona3": "Álvaro"
};

// Dark/Light Mode
toggleModeBtn.addEventListener('click', toggleMode);
function toggleMode(){
    let actualMode = document.documentElement.getAttribute('data-theme');

    if(actualMode === 'light'){
        document.documentElement.setAttribute('data-theme','dark');
    }else{
        document.documentElement.setAttribute('data-theme','light');
    }
}

// Inicio MODAL --------------------------------

function openModal() {
    taskModal.classList.add('is-active');
    taskForm.reset();  // Limpiar el formulario cuando se abre el modal
}

function closeModal() {
    taskModal.classList.remove('is-active');
    taskForm.reset();  // Limpiar el formulario cuando se cierra el modal
    document.querySelector('.modal-card-title').textContent = 'Tarea'; // Resetear el título
    currentTaskId = null; // Resetear el ID para nuevas tareas
}

addTaskButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
cancelTaskButton.addEventListener('click', closeModal);

function openEditModal(taskId) {
    currentTaskId = taskId; // Almacena el ID de la tarea que se está editando
    const taskElement = document.querySelector(`[data-id='${taskId}']`);

    // Cargar la información de la tarea en los campos del formulario
    taskForm['taskTitle'].value = taskElement.querySelector('h3').textContent;
    taskForm['taskDescription'].value = taskElement.querySelector('.description').textContent;
    
    const assignedText = taskElement.querySelector('.details p:first-child').textContent.split(': ')[1];
    const assignedValue = Object.keys(userMap).find(key => userMap[key] === assignedText);
    taskForm['taskAssigned'].value = assignedValue || assignedText;

    taskForm['taskPriority'].value = taskElement.querySelector('.priority').textContent.split(': ')[1];
    taskForm['taskStatus'].value = taskElement.closest('.column').id;
    taskForm['taskDeadline'].value = taskElement.querySelector('.deadline').textContent.split(': ')[1];

    // Cambiar el título del modal para indicar que es una edición
    document.querySelector('.modal-card-title').textContent = 'Editar Tarea';

    // Abrir el modal
    taskModal.classList.add('is-active');
}

// Fin MODAL --------------------------------

// Inicio ADD TASKS --------------------------------
const taskColumns = {
    backlog: document.getElementById('backlog').querySelector('.tasks'),
    todo: document.getElementById('todo').querySelector('.tasks'),
    'in-progress': document.getElementById('in-progress').querySelector('.tasks'),
    blocked: document.getElementById('blocked').querySelector('.tasks'),
    done: document.getElementById('done').querySelector('.tasks')
};

let currentTaskId = null;

function createTaskElement(title, description, assigned, priority, deadline, id = Date.now()) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('box', 'task');
    taskElement.classList.add('notification', 'is-info');
    taskElement.dataset.id = id;
    taskElement.draggable = true;  // Hacer que la tarea sea draggable

    const assignedName = userMap[assigned] || assigned;

    taskElement.innerHTML = `
        <h3>${title}</h3>
        <p class="description">${description}</p>
        <div class="details">
            <p><strong>Asignado:</strong> ${assignedName}</p>
            <p class="priority ${priority.toLowerCase()}"><strong>Prioridad:</strong> ${priority}</p>
        </div>
        <p class="deadline"><strong>Fecha límite:</strong> ${deadline}</p>
    `;

    // Evento de arrastrar (dragstart)
    taskElement.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', id); // Guardar el id de la tarea arrastrada
    });

    // Evento de clic para editar la tarea
    taskElement.addEventListener('click', function() {
        openEditModal(id);
    });

    return taskElement;
}

document.getElementById('saveTaskBtn').addEventListener('click', function(event) {
    event.preventDefault();
    
    const title = taskForm['taskTitle'].value;
    const description = taskForm['taskDescription'].value;
    const assigned = taskForm['taskAssigned'].value;
    const priority = taskForm['taskPriority'].value;
    const status = taskForm['taskStatus'].value;
    const deadline = taskForm['taskDeadline'].value;

    if (currentTaskId) {
        const taskElement = document.querySelector(`[data-id='${currentTaskId}']`);

        taskElement.querySelector('h3').textContent = title;
        taskElement.querySelector('.description').textContent = description;
        taskElement.querySelector('.details p:first-child').innerHTML = `<strong>Asignado:</strong> ${userMap[assigned] || assigned}`;
        taskElement.querySelector('.priority').innerHTML = `<strong>Prioridad:</strong> ${priority}`;
        taskElement.querySelector('.priority').className = `priority ${priority.toLowerCase()}`;
        taskElement.querySelector('.deadline').innerHTML = `<strong>Fecha límite:</strong> ${deadline}`;

        if (taskElement.closest('.column').id !== status) {
            taskColumns[status].appendChild(taskElement);
        }

        currentTaskId = null;
    } else {
        const newTask = createTaskElement(title, description, assigned, priority, deadline);
        taskColumns[status].appendChild(newTask);
    }

    closeModal();
});

// FIN ADD TASKS --------------------------------

// Inicio DRAG AND DROP --------------------------------
Object.keys(taskColumns).forEach(status => {
    const column = taskColumns[status];

    column.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    column.addEventListener('drop', function(event) {
        event.preventDefault();

        const taskId = event.dataTransfer.getData('text/plain');
        const taskElement = document.querySelector(`[data-id='${taskId}']`);

        column.appendChild(taskElement);
    });
});
// Fin DRAG AND DROP --------------------------------
