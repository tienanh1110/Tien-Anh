const addTaskBtn = document.querySelector('#add-task');
const formTitle = document.querySelector('#form-title');
const titleInput = document.querySelector('#title');
const detailInput = document.querySelector('#detail');
const taskList = document.querySelector('#task-list');
const taskListPlaceholder = document.querySelector('#task-list-placeholder');

let isUpdateTask = false;

addTaskBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const detail = detailInput.value;
  if (!isUpdateTask) createTask(title, detail);
  else updateTask(title, detail);
});

taskList.addEventListener('DOMSubtreeModified', (e) => {
  console.log(taskList.children.length);
  if (taskList.children.length === 1) {
    taskListPlaceholder.hidden = false;
    return;
  }
  taskListPlaceholder.hidden = true;
});

const addTaskToDom = (task) => {
  const taskDom = generateTaskTemplate(task._id, task.title, task.detail);
  console.log(task._id);
  const updateBtn = taskDom.querySelector('.update-btn');
  const deleteBtn = taskDom.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => deleteTask(task._id, taskDom));
  updateBtn.addEventListener('click', () => handleUpdateTask(task, taskDom));
  taskList.appendChild(taskDom);
};

const handleUpdateTask = (task, taskDom) => {
  const taskTitle = taskDom.querySelector('.task-title');
  const taskDetail = taskDom.querySelector('.task-detail');
  const titleInput = taskDom.querySelector('.title-input');
  const detailInput = taskDom.querySelector('.detail-input');

  taskTitle.hidden = !taskTitle.hidden;
  taskDetail.hidden = !taskDetail.hidden;
  titleInput.hidden = !titleInput.hidden;
  detailInput.hidden = !detailInput.hidden;

  const updateBtn = taskDom.querySelector('.update-btn');
  if (updateBtn.textContent === 'Update') {
    updateBtn.textContent = 'Save';
    titleInput.value = task.title;
    detailInput.value = task.detail;
    return;
  }
  if (updateBtn.textContent === 'Save') {
    updateBtn.textContent = 'Update';
    updateTask(
      task._id,
      titleInput.value,
      detailInput.value,
      taskTitle,
      taskDetail
    );
  }
};

const getTasks = () => {
  fetch('/api/task')
    .then((res) => res.json())
    .then((data) => data.forEach((task) => addTaskToDom(task)));
};

const createTask = (title, detail) => {
  fetch('/api/task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, detail }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error);
      addTaskToDom(data);
      titleInput.value = '';
      detailInput.value = '';
    })
    .catch((err) => alert(err));
};

const updateTask = (id, title, detail, taskTitle, taskDetail) => {
  fetch('/api/task', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title, detail }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) return alert(data.error);
      taskTitle.textContent = data.title;
      taskDetail.textContent = data.detail;
    });
};

const deleteTask = (id, taskElement) => {
  fetch('/api/task', {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.status === 200)
    .then((result) => {
      if (result === true) {
        let index = 0;
        taskList.removeChild(taskElement);
      }
    });
};

const generateTaskTemplate = (id, title, detail) => {
  return new DOMParser().parseFromString(
    `<li class="card mb-3" id='${id}'>
            <div class="card-header bg-primary">
              <div class="row">
                <h5 class="h5 text-white col task-title">${title}</h5>
                <input class="col form-control title-input" type="text" required hidden/>
                <div class="col text-right">
                  <button class="btn btn-success update-btn"'>Update</button>
                  <button class="btn btn-danger delete-btn"'>Delete</button>
                </div>
              </div>
            </div>
            <div class="card-body">
              <p class="card-text task-detail">${detail}
              </p>
              <textarea class="form-control detail-input" id="detail" required hidden></textarea>
            </div>
          </li>`,
    'text/html'
  ).body.firstChild;
};

getTasks();
