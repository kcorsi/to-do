(async () => {
  const API_URL = "http://localhost:3000/todos";
  lucide.createIcons();
  //Function to fetch all todos from db.json
  async function getTasks() {
    try {
      const response = await fetch(`${API_URL}`);
      const todos = await response.json();
      return todos;
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  }

  let tasks = await getTasks();
  //Function to open modal to edit todo
  function openEdit(id) {
    const task = tasks.find((task) => {
      return task.id === id;
    });
    const modalInput = document.getElementById("editTaskInput");
    modalInput.value = task.text;
    modalInput.dataset.taskId = id;
    new bootstrap.Modal(document.getElementById("editModal")).show();
  }
  //Function to update task list in html and add creating the update and delete buttons
  function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach((task) => {
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
            <button class="btn btn-sm btn-secondary" onclick="openEdit('${
              task.id
            }')">
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
  //Function to take new text from add task button to add to the list of tasks in db.json
  async function addTask() {
    const input = document.getElementById("newTaskInput");
    const text = input.value.trim();
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          done: false,
        }),
      });
      const newTodo = await response.json();
      return newTodo;
    } catch (error) {
      console.error("Error adding todo:", error);
      return null;
    }
  }
  //Function to take input after clicking the edit button and add the changed information to db.json
  function saveEdit() {
    const modalInput = document.getElementById("editTaskInput");
    const id = modalInput.dataset.taskId;
    const newText = modalInput.value.trim();
    updateTodo(id, { text: newText });
  }
  //Function to select the task being deleted after clicking the trash icon
  function deleteTask(id) {
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    confirmDeleteButton.dataset.taskId = id;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  }
  //Function to take task that was selected and remove from html and db.json
  async function confirmDelete() {
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const id = confirmDeleteButton.dataset.taskId;

    bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await response.json();
      return newTodo;
    } catch (error) {
      console.error("Error deleting todo:", error);
      return null;
    }
  }
  //Function to change status of whether todo is done or not
  async function toggleDone(id) {
    const task = tasks.find((task) => {
      return task.id === id;
    });
    const newStatus = !task.done;
    await updateTodo(id, { done: newStatus });
  }
  //Function to receive changes required from other functions and send them to db.json
  async function updateTodo(id, updates) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      await response.json();
    } catch (error) {
      console.error("Error updating todo:", error);
      return null;
    }
  }

  window.openEdit = openEdit;
  window.deleteTask = deleteTask;
  window.toggleDone = toggleDone;
  window.confirmDelete = confirmDelete;
  window.saveEdit = saveEdit;
  window.addTask = addTask;
  renderTasks();
})();
