(async () => {
  lucide.createIcons();
  //Function to fetch all todos from db.json
  async function getTasks() {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const todos = await response.json();
      return todos;
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  }
  //let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  let editingIndex = null;
  let deleteIndex = null;
  let tasks = await getTasks();
  console.log(tasks);

  /*  function saveTasks() {
          localStorage.setItem("tasks", JSON.stringify(tasks));
        } */

  async function saveTasks(id, changes) {
    const taskIndex = tasks.findIndex((task) => {
      return task.id === id;
    });
    console.log("taskIndex = ", taskIndex);
    if (tasks[taskIndex].done) {
      tasks[taskIndex].done = false;
    } else {
      tasks[taskIndex].done = true;
    }
    console.log(tasks);
  }

  function openEdit(id) {
    editingIndex = id;
    console.log(`I am editing task number ${id}`);
    document.getElementById("editTaskInput").value = tasks[id].text;
    new bootstrap.Modal(document.getElementById("editModal")).show();
  }

  function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach((task, index) => {
      console.log(task, index);
      const card = document.createElement("div");
      card.className =
        "card-task d-flex justify-content-between align-items-center";

      card.innerHTML = `
          <div>
            <input type="checkbox" class="form-check-input me-2" ${
              task.done ? "checked" : ""
            } onchange="toggleDone('${task.id}')" />
                <span class="task-text ${task.done ? "done" : ""}">${
        task.text
      }</span>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-secondary" onclick="openEdit(${
              task.id
            })">
              <i data-lucide="pencil"></i>
              </button>
              <button class="btn btn-sm btn btn-danger" onclick="deleteTask('${
                task.id
              }')">
                <i data-lucide="trash"></i>
                </button>
                </div>`;
      list.appendChild(card);
    });
    lucide.createIcons();
  }

  async function addTask() {
    const input = document.getElementById("newTaskInput");
    const text = input.value.trim();
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          completed: false,
        }),
      });
      const newTodo = await response.json();
      return newTodo;
    } catch (error) {
      console.error("Error adding todo:", error);
      return null;
    }
  }

  /*function addTask() {
          const input = document.getElementById("newTaskInput");
          const text = input.value.trim();

          if (text) {
            tasks.push({
              text,
              done: false,
            });
            saveTasks();
            renderTasks();
            input.value = "";
            bootstrap.Modal.getInstance(
              document.getElementById("addModal")
            ).hide();
          }
        }*/

  function saveEdit() {
    const text = document.getElementById("editTaskInput").value.trim();
    if (text && editingIndex !== null) {
      tasks[editingIndex].text = text;
      renderTasks();
      bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    }
  }

  function deleteTask(id) {
    deleteIndex = id;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  }

  async function confirmDelete() {
    console.log(deleteIndex);
    tasks.splice(deleteIndex, 1);
    // fetch function here
    renderTasks();

    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
    try {
      const response = await fetch(
        `http://localhost:3000/todos/${deleteIndex}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newTodo = await response.json();
      return newTodo;
    } catch (error) {
      console.error("Error adding todo:", error);
      return null;
    }
  }

  function toggleDone(id) {
    const taskIndex = tasks.findIndex((task) => {
      return task.id === id;
    });
    console.log("taskIndex = ", taskIndex);
    if (tasks[taskIndex].done) {
      tasks[taskIndex].done = false;
    } else {
      tasks[taskIndex].done = true;
    }
    console.log(tasks);
    tasks[taskIndex].done = !tasks[taskIndex].done;
    //saveTasks();
    renderTasks();
  }
  window.openEdit = openEdit;
  window.deleteTask = deleteTask;
  window.toggleDone = toggleDone;
  window.confirmDelete = confirmDelete;
  window.saveEdit = saveEdit;
  window.addTask = addTask;
  renderTasks();
})();
