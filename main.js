const tasks = document.getElementById('today-todo-list');
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
let tasksObj = JSON.parse(localStorage.getItem('tasks')) || {}
if (tasksObj != {}){
	console.log("loaded tasks from localSotrage:", tasksObj);
	for (let title in tasksObj) {
		createNewTask(title,tasksObj[title]);
	}
} else {
	console.log("no stored tasks found")
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
submitTask.addEventListener('click', ()=> {
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
	createNewTask(title, description);
	taskCreationOverlay.classList.add('hidden');
})

saveAll.addEventListener('click', saveAllTasks)

removeAll.addEventListener('click', ()=>{
	console.log("removing all tasks from storage...")
	Array.from(tasks.children).forEach(ele=>{
		ele.remove();
	})
	localStorage.removeItem('tasks')
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

	const del = document.createElement('i');
	del.classList.add('hidden');
	del.classList.add('fa-solid');
	del.classList.add('fa-trash');
	task.appendChild(del);

	tasks.appendChild(task);
	tasksObj[title] = description;
}


function saveAllTasks() {
	console.log('saveAllTasks function called');
	localStorage.setItem('tasks', JSON.stringify(tasksObj));
}
