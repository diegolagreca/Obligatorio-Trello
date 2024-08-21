// estados
const statuses = ["Backlog", "To Do", "In Progress", "Blocked", "Done"];

// prioridades
const priorities = ["Low", "Medium", "High"];

class Task {
    constructor(title, description, assignedTo, priority, deadline, status) {
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
        this.priority = priority;
        this.deadline = deadline;
        this.status = status;
    }
}

// crear metodo cargarDatos()

// Cargamos informacion para testear
let tarea1 = new Task("Colgar la ropa", "Hay que ir afuera y colgar la ropa antes que llueva", "Pepe", priorities[1], new Date("2024-08-21"), statuses[0]);
let tarea2 = new Task("Programar", "Picar codigo", "Pepe", priorities[1], new Date("2024-08-21"), statuses[1]);
let tarea3 = new Task("Ir al super", "Comprar harina, arroz, coca", "Álvaro", priorities[2], new Date("2024-08-21"), statuses[2]);
let tarea4 = new Task("Sacar la basura", "Dale bo", "Diego", priorities[0], new Date("2024-08-22"), statuses[3]);
let tarea5 = new Task("Estudiar", "Para programacion web obvio", "Juan", priorities[0], new Date("2024-08-23"), statuses[4]);

function loadDataInHTML() {
    const divBacklog = document.getElementById("backlog");
    divBacklog.innerText = "<div class=\"notification is - info\" > < b > Tarea1</b > <p>Descripcion de la tarea lalala</p>  </div > ";

}

loadDataInHTML();

/*
                    <div class="notification is-info" >
                        <b>Tarea1</b>
                        <p>Descripcion de la tarea lalala</p>
                    </div>
*/