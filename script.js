const addTaskButton = document.getElementById('addTaskBtn');
const taskModal = document.getElementById('taskModal');
const closeModalButton = document.querySelector('.modal-background');
const cancelTaskButton = document.getElementById('cancelTaskBtn');
const taskForm = document.getElementById('taskForm');
const toggleModeBtn = document.getElementById('toggleModeBtn');

const serverURL = "http://localhost:3000/api/tasks/";


// Inicio ADD TASKS --------------------------------
let taskColumns = {
    backlog: document.getElementById('backlog').querySelector('.tasks'),
    todo: document.getElementById('todo').querySelector('.tasks'),
    'in-progress': document.getElementById('in-progress').querySelector('.tasks'),
    blocked: document.getElementById('blocked').querySelector('.tasks'),
    done: document.getElementById('done').querySelector('.tasks')
};



renderTasks();

// metodo post
async function postNewTask(title, description, assigned, deadline, status, priority) {
    // Crear el objeto con los datos de la tarea
    const newTask = {
        title: title,
        description: description,
        assignedTo: assigned,
        endDate: deadline,
        status: status,
        priority: priority
    };
    console.log("paso 1");
    console.log(newTask);

    try {
        // Realizar la solicitud POST usando fetch
        const response = await fetch(serverURL, {
            method: "POST",  // Método HTTP POST
            headers: {
                "Content-Type": "application/json"  // Especificamos que el contenido es JSON
            },
            body: JSON.stringify(newTask)  // Convertimos el objeto JavaScript a un string JSON
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Obtener la respuesta del servidor
        const result = await response.json();
        console.log("Task created successfully:", result);

    } catch (error) {
        console.error("Error creating new task:", error);
    }
}

// metodo put
function updateTask(id, title, description, assigned, priority, deadline) {

}

async function getAllTasks() {
    try {
        const response = await fetch(serverURL, { method: 'GET' });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse JSON response
        const tasks = await response.json();
        console.log(tasks);


        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}



async function renderTasks() {
    let taskArray = await getAllTasks(); // Obtener todas las tareas del servidor

    for (let i = 0; i < taskArray.length; i++) {
        let task = taskArray[i];
        let title = task.title;
        let description = task.description;
        let assigned = task.assignedTo;
        let priority = task.priority;
        let status = task.status;
        let deadline = task.endDate;
        let id = task.id;

        //Verificar si la tarea ya existe en el DOM
        if (document.querySelector(`[data-id='${id}']`)) {
            continue; // Si la tarea ya existe, saltar a la siguiente iteración
        } else {
            let parsedStatus = "";

            switch (status.toLowerCase()) { // Convertir a minúsculas para simplificar
                case "backlog":
                    parsedStatus = "backlog";
                    break;
                case "in progress":
                case "in-progress":
                    parsedStatus = "in-progress";
                    break;
                case "to do":
                case "todo":
                    parsedStatus = "todo";
                    break;
                case "blocked":
                    parsedStatus = "blocked";
                    break;
                case "done":
                    parsedStatus = "done";
                    break;
                default:
                    console.log("no status :(");
            }

            if (parsedStatus) { 
                let newTask = renderTaskElement(title, description, assigned, priority, deadline, status, id); 
                taskColumns[parsedStatus].appendChild(newTask);
            }
        }
    }
}


function renderTaskElement(title, description, assigned, priority, deadline, status, id = Date.now()) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('box', 'task');

    // Asignar clases de color según la prioridad
    const priorityClass = {
        'Low': 'priority-low',
        'Medium': 'priority-medium',
        'High': 'priority-high'
    }[priority] || 'priority-low'; // Valor predeterminado si no coincide

    taskElement.classList.add(priorityClass); // Añadir la clase de color según la prioridad
    taskElement.dataset.id = id;
    taskElement.draggable = true;  // Hacer que la tarea sea draggable

    // Definir la imagen de perfil según el usuario asignado
    const profilePics = {
        'Persona1': '1.jpg',
        'Persona2': '3.jpg',
        'Persona3': '2.jpg'
    };
    const profilePic = profilePics[assigned] || '2.jpg';

    taskElement.innerHTML = `
        <div class="task-header">
            <img src="${profilePic}" alt="${assigned}" class="profile-pic">
            <div class="task-title">
                <h3>${title}</h3>
                <p class="description">${description}</p>
            </div>
        </div>
        <div class="details">
            <p>
                <i class="fa-solid fa-user"></i>
                <strong>Asignado:</strong> ${assigned}
            </p>
            <p class="priority ${priority.toLowerCase()}">
                <i class="fa-solid fa-tag"></i>
                <strong>Prioridad:</strong> ${priority}
            </p>
        </div>
        <p class="deadline">
            <i class="fa-solid fa-clock"></i>
            <strong>Fecha límite:</strong> ${deadline}
        </p>
    `;

    // Evento de arrastrar (dragstart)
    taskElement.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', id); // Guardar el id de la tarea arrastrada
    });

    // Evento de clic para editar la tarea
    taskElement.addEventListener('click', function () {
        openEditModal(id);
    });

    return taskElement;
}

// Dark/Light Mode
toggleModeBtn.addEventListener('click', toggleMode);
function toggleMode() {
    let currentMode = document.documentElement.getAttribute('data-theme');

    if (currentMode === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Change Background
backgroundSelector.addEventListener('change', changeBackground);
function changeBackground() {
    let selectedBackground = document.getElementById("backgroundSelector").value;

    if (selectedBackground === "Default") {
        document.getElementById("columnsContainer").style.backgroundImage = "";
    } else {
        document.getElementById("columnsContainer").style.backgroundImage = "url('" + selectedBackground + "')";
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

    taskForm['taskAssigned'].value = taskElement.querySelector('.assigned').textContent.split(': ')[1];

    taskForm['taskPriority'].value = taskElement.querySelector('.priority').textContent.split(': ')[1];
    taskForm['taskStatus'].value = taskElement.closest('.column').id;
    taskForm['taskDeadline'].value = taskElement.querySelector('.deadline').textContent.split(': ')[1];

    // Cambiar el título del modal para indicar que es una edición
    document.querySelector('.modal-card-title').textContent = 'Editar Tarea';

    // Abrir el modal
    taskModal.classList.add('is-active');
}

// Fin MODAL --------------------------------


let currentTaskId = null;

function createTaskElement(title, description, assigned, priority, deadline, status, id = Date.now()) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('box', 'task');

    // Asignar clases de color según la prioridad
    const priorityClass = {
        'Low': 'priority-low',
        'Medium': 'priority-medium',
        'High': 'priority-high'
    }[priority] || 'priority-low'; // Valor predeterminado si no coincide

    taskElement.classList.add(priorityClass); // Añadir la clase de color según la prioridad
    taskElement.dataset.id = id;
    taskElement.draggable = true;  // Hacer que la tarea sea draggable

    // Definir la imagen de perfil según el usuario asignado
    const profilePics = {
        'Persona1': '1.jpg',
        'Persona2': '3.jpg',
        'Persona3': '2.jpg'
    };
    const profilePic = profilePics[assigned] || '2.jpg';

    taskElement.innerHTML = `
        <div class="task-header">
            <img src="${profilePic}" alt="${assigned}" class="profile-pic">
            <div class="task-title">
                <h3>${title}</h3>
                <p class="description">${description}</p>
            </div>
        </div>
        <div class="details">
            <p>
                <i class="fa-solid fa-user"></i>
                <strong>Asignado:</strong> ${assigned}
            </p>
            <p class="priority ${priority.toLowerCase()}">
                <i class="fa-solid fa-tag"></i>
                <strong>Prioridad:</strong> ${priority}
            </p>
        </div>
        <p class="deadline">
            <i class="fa-solid fa-clock"></i>
            <strong>Fecha límite:</strong> ${deadline}
        </p>
    `;

    // Evento de arrastrar (dragstart)
    taskElement.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', id); // Guardar el id de la tarea arrastrada
    });

    // Evento de clic para editar la tarea
    taskElement.addEventListener('click', function () {
        openEditModal(id);
    });

    postNewTask(title, description, assigned, deadline, status, priority);
    return taskElement;
}


document.getElementById('saveTaskBtn').addEventListener('click', function (event) {
    event.preventDefault();

    const title = taskForm['taskTitle'].value;
    const description = taskForm['taskDescription'].value;
    const assigned = taskForm['taskAssigned'].value;
    const priority = taskForm['taskPriority'].value;
    const status = taskForm['taskStatus'].value;
    const deadline = taskForm['taskDeadline'].value;

    const priorityClass = {
        'Low': 'priority-low',
        'Medium': 'priority-medium',
        'High': 'priority-high'
    }[priority] || 'priority-low';

    const profilePics = {
        'Persona1': '1.jpg',
        'Persona2': '3.jpg',
        'Persona3': '2.jpg'
    };
    const profilePic = profilePics[assigned] || '2.jpg';

    if (currentTaskId) {
        const taskElement = document.querySelector(`[data-id='${currentTaskId}']`);

        taskElement.querySelector('h3').textContent = title;
        taskElement.querySelector('.description').textContent = description;
        taskElement.querySelector('.details p:first-child').innerHTML = `<i class="fa-solid fa-user"></i><strong>Asignado:</strong> ${assigned}`;
        taskElement.querySelector('.priority').innerHTML = `<i class="fa-solid fa-tag"></i><strong>Prioridad:</strong> ${priority}`;
        taskElement.querySelector('.priority').className = `priority ${priority.toLowerCase()}`;
        taskElement.querySelector('.deadline').innerHTML = `<i class="fa-solid fa-clock"></i><strong>Fecha límite:</strong> ${deadline}`;

        // Actualizar la imagen de perfil
        taskElement.querySelector('.profile-pic').src = profilePic;
        taskElement.querySelector('.profile-pic').alt = assigned;

        taskElement.classList.remove('priority-low', 'priority-medium', 'priority-high');
        taskElement.classList.add(priorityClass);

        if (taskElement.closest('.column').id !== status) {
            taskColumns[status].appendChild(taskElement);
        }

        currentTaskId = null;
    } else {
        const newTask = createTaskElement(title, description, assigned, priority, deadline, status);
        taskColumns[status].appendChild(newTask);
        console.log("crear nueva")
        //postNewTask(title,description,assigned,deadline,status,priorityClass);
    }

    closeModal();
});



// FIN ADD TASKS --------------------------------

// Inicio DRAG AND DROP --------------------------------
Object.keys(taskColumns).forEach(status => {
    const column = taskColumns[status];

    column.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    column.addEventListener('drop', function (event) {
        event.preventDefault();

        const taskId = event.dataTransfer.getData('text/plain');
        const taskElement = document.querySelector(`[data-id='${taskId}']`);

        column.appendChild(taskElement);
    });
});
// Fin DRAG AND DROP --------------------------------

