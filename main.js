const tasks = document.getElementById('today-todo-list');
const finishedTasks = document.getElementById("today-finished-list");
const date = document.getElementById('today-date');
const create = document.getElementById('create-tasks');
const remove = document.getElementById('remove-tasks');
const removeAll = document.getElementById('remove-all-tasks');
const saveAll = document.getElementById('save-all-tasks');
const taskCreationWindow = document.getElementById('task-creation-window');
const taskCreationOverlay = document.getElementById('task-creation-overlay');
const taskTitleInp = document.getElementById('task-title-input');
const taskDescriptionInp  = document.getElementById('task-description-input')
const submitTask = document.getElementById('submit-task')
let tasksObj = JSON.parse(localStorage.getItem('tasks-todo')) || {}
if (tasksObj != {}){
	console.log("loaded tasks from localSotrage:", tasksObj);
	for (let title in tasksObj) {
		createNewTask(title,tasksObj[title]);
	}
} else {
	console.log("no stored tasks found")
}

let doneTasks = JSON.parse(localStorage.getItem('tasks-finished')) || {}
if (doneTasks != {}){
	console.log("loaded finished tasks from localSotrage:", doneTasks);
	for (let title in doneTasks) {
		createFinishedTask(title,doneTasks[title]);
	}
} else {
	console.log("no stored finished tasks found")
}



create.addEventListener('click', createTask)
remove.addEventListener('click', () => {
	Array.from(tasks.children).forEach(element => {
		if (element.lastChild.classList.contains('fa-trash')){
			element.lastChild.classList.toggle('hidden');
			element.lastChild.style.paddingTop = "2px";
			element.lastChild.style.margin = "auto";
		}
	});
	if (remove.value === "finished") remove.value = "remove tasks";
	else remove.value = "finished"
})
submitTask.addEventListener('click', addNewTask)

saveAll.addEventListener('click', saveAllTasks)

removeAll.addEventListener('click', ()=>{
	console.log("removing all tasks from storage...")
	Array.from(tasks.children).forEach(ele=>{
		ele.remove();
	})
	localStorage.removeItem('tasks-todo')
	localStorage.removeItem('tasks-finished')
})


tasks.addEventListener('click', (e)=> {
	if(e.target.classList.contains('fa-trash')) {
		const li = e.target.closest('li');
		if (li) {
			console.log("this is supposed to delete item with title:", li.firstChild.textContent);
			delete tasksObj[li.firstChild.textContent];
			saveAllTasks();
			li.remove();
		}
	}

	if(e.target.classList.contains('fa-pen-to-square')) {
		const li = e.target.closest('li');
		if (li) {
			console.log("this is supposed to edit item with title:", li.firstChild.textContent);
			submitTask.value = "save"
			taskCreationOverlay.classList.remove('hidden');
			taskTitleInp.value = li.firstChild.textContent;
			taskDescriptionInp.value = li.children[1].textContent;
			submitTask.removeEventListener('click', addNewTask);
			function editTask() {
				delete tasksObj[li.firstChild.textContent];
				li.firstChild.textContent = taskTitleInp.value;
				li.children[1].textContent = taskDescriptionInp.value;
				tasksObj[taskTitleInp.value] = taskDescriptionInp.value;
				taskCreationOverlay.classList.add('hidden');
				
				localStorage.setItem('tasks-todo', JSON.stringify(tasksObj));
				submitTask.removeEventListener('click', editTask);
				submitTask.addEventListener('click', addNewTask)
			}
			submitTask.addEventListener('click', editTask)
		}
	}

	if(e.target.classList.contains('fa-check')) {
		const li = e.target.closest('li');
		if (li) {
			console.log("this is supposed to finish item with title:", li.firstChild.textContent);
			delete tasksObj[li.firstChild.textContent];
			createFinishedTask(li.firstChild.textContent, li.children[1].textContent);
			saveAllTasks();
			li.remove();
		}
	}
} )


finishedTasks.addEventListener('click', (e)=> {
	if(e.target.classList.contains('fa-trash')) {
		const li = e.target.closest('li');
		if (li) {
			console.log("this is supposed to delete item with title:", li.firstChild.textContent);
			delete doneTasks[li.firstChild.textContent];
			saveAllTasks();
			li.remove();
		}
	}

	if(e.target.classList.contains('fa-xmark')) {
		const li = e.target.closest('li');
		if (li) {
			console.log("this is supposed to unfinish item with title:", li.firstChild.textContent);
			delete doneTasks[li.firstChild.textContent];
			createNewTask(li.firstChild.textContent, li.children[1].textContent);
			saveAllTasks();
			li.remove();
		}
	}
} )



function createTask(){
	console.log('createTask function called');
	taskCreationOverlay.classList.remove('hidden');
}

function createNewTask(title, description) {
	console.log('createNewTask function called with title:', title, 'and description:', description);
	const task = document.createElement('li');
	const taskTitle = document.createElement('tasktitle');
	const taskDescription = document.createElement('taskdescription')
	taskTitle.textContent = title;
	taskDescription.textContent = description;


	task.appendChild(taskTitle);
	task.appendChild(taskDescription);


	const check = document.createElement('i');
	check.classList.add('fa-solid');
	check.classList.add('fa-check');
	check.classList.add('icon-display-inline');

	const edit = document.createElement('i');
	edit.classList.add('fa-solid');
	edit.classList.add('fa-pen-to-square');
	edit.classList.add('icon-display-inline');


	const del = document.createElement('i');
	del.classList.add('hidden');
	del.classList.add('fa-solid');
	del.classList.add('fa-trash');

	task.appendChild(check);
	task.appendChild(edit);


	task.appendChild(del);
	tasks.appendChild(task);
	tasksObj[title] = description;
	localStorage.setItem('tasks-todo', JSON.stringify(tasksObj));
}

function addNewTask(){
	console.log("adding new task to the list")
	const title = taskTitleInp.value.trim();
	let description = taskDescriptionInp.value.trim();
	if(title === "") {
		alert("task must have a title");
		return;
	}
	if (taskDescriptionInp.value.trim() === "") {
		description = "no description";
	}
	taskDescriptionInp.value = "";
	taskTitleInp.value = "";
	createNewTask(title, description);
	taskCreationOverlay.classList.add('hidden');
}

function saveAllTasks() {
	console.log('saveAllTasks function called');
	localStorage.setItem('tasks-todo', JSON.stringify(tasksObj));
	localStorage.setItem('tasks-finished', JSON.stringify(doneTasks));
}


function createFinishedTask(title, description) {
	console.log('create finished tasks function called with title:', title, 'and description:', description);
	const task = document.createElement('li');
	const taskTitle = document.createElement('tasktitle');
	const taskDescription = document.createElement('taskdescription')
	taskTitle.textContent = title;
	taskDescription.textContent = description;


	task.appendChild(taskTitle);
	task.appendChild(taskDescription);


	const uncheck = document.createElement('i');
	uncheck.classList.add('fa-solid');
	uncheck.classList.add('fa-xmark');
	uncheck.classList.add('icon-display-inline');

	const del = document.createElement('i');
	del.classList.add('fa-solid');
	del.classList.add('fa-trash');


	task.appendChild(uncheck);
	task.appendChild(del);

	finishedTasks.appendChild(task);
	doneTasks[title] = description;
	localStorage.setItem('tasks-finished', JSON.stringify(doneTasks));
}