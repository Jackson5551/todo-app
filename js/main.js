const addListInput = document.querySelector('#addListInput')
const allListsUL = document.querySelector('#allLists')
const taskListUL = document.querySelector('#taskList')
const viewToDoListDiv = document.querySelector('#viewToDoList')
const addListForm = document.querySelector('#addListForm')
const listViewHeader = document.querySelector('#listViewHeader')
const addTaskForm = document.querySelector('#addTaskForm')
const addTaskInput = document.querySelector('#addTaskInput')
// let deleteListButton = document.querySelector('#deleteListButton')


const LOCAL_STORAGE_KEY = 'todoApp.listKey'
const LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY = 'todoApp.isSelected'
let listsFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
let selectedListID = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY)) || []

class buildObjects {
    static createList(name) {
        return { id: Date.now().toString(), name: name, desc: '', tasks: [] }
    }
    static createTask(name) {
        return { id: Date.now().toString(), name: name, desc: '', completed: false }
    }
}

class storageHandler {
    static getLists() {
        let lists;
        if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
            lists = []
            // console.log(lists)
        } else {
            lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
            // console.log(lists)
        }
        // console.log(lists)
        return lists;
    }

    static addList(list) {
        // let lists = storageHandler.getLists()
        listsFromLocalStorage.push(list)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
    }

    static removeList(date) {
        console.log("Clicked!" + +date)
        let lists = storageHandler.getLists()
        lists.forEach((list, i) => {
            if (+list.id === +date) {
                listsFromLocalStorage.splice(i, 1);
                console.log("SUCCESS " + i)
                let header = listViewHeader
                header.innerHTML = `
                <h1>Open a List</h1>
                <p></p>
                `
                clearElement(taskListUL)
            } else {
                console.log("FAILED " + i)
            }
            i++
        })
        // listsFromLocalStorage.push(lists)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
        saveAndRender()
    }
    static removeTask(id){
        // console.log("List: "+parent)
        // console.log("ID: "+id)
        // parent.tasks.forEach((task, i) => {
        //     if (+task.id == +id) {
        //         console.log('Yep '+i)
        //         listsFromLocalStorage[i].tasks.splice(i,1)
        //         saveAndRender()
        //     } else {
        //         console.log('Nope '+i)
        //         return
        //     }
        //     i++
        // });
        const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID) || []
        // console.log("List: "+selectedList.name)
        selectedList.tasks.forEach((task, i) => {
            if(+task.id == +id){
                console.log('Yep!')
            }
            i++
        });
        // selectedList.tasks = selectedList.tasks.filter(task => task.)
        // saveAndRender()
    }
}

class UIHandler {
    // static displayLists() {
    //     // const lists = storageHandler.getLists();
    //     clearElement(allListsUL)
    //     listsFromLocalStorage.forEach((list) => UIHandler.addListToView(list));
    // }
    static addListToView(list) {
        const view = allListsUL;
        // clearElement(view)
        let listToAdd = `
        <li id="${list.id}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${list.name}</div>
                    This is a test card
            </div>
            <span class="d-flex flex-column justify-content-between">

                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                    <button type="button" class="btn btn-danger" id="deleteListButton" onclick="storageHandler.removeList(${list.id})"><i class="bi bi-trash-fill" id="deleteListButton"></i></button>
                    <button type="button" class="btn btn-secondary"><i class="bi bi-pencil-fill"></i></button>
                </div>
            </span>
        </li>
        `
        view.innerHTML = listToAdd + view.innerHTML
        // console.log(list)
    }
    static updateToActive(list) {
        const view = allListsUL;
        // clearElement(view)
        let listToAdd = `
        <li id="${list.id}" class="list-group-item list-group-item-action active d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${list.name}</div>
                    This is a test card
            </div>
            <span class="d-flex flex-column justify-content-between">
                <div class="btn-group-vertical" role="group" aria-label="Vertical button group">
                    <button type="button" class="btn btn-outline-light" id="deleteListButton" onclick="storageHandler.removeList(${list.id})"><i class="bi bi-trash-fill" id="deleteListButton"></i></button>
                    <button type="button" class="btn btn-outline-light"><i class="bi bi-pencil-fill"></i></button>
                </div>
            </span>
        </li>
        `
        view.innerHTML = listToAdd + view.innerHTML
        // console.log(list)
    }
}

// window.addEventListener('DOMContentLoaded', render())

addListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = addListInput.value
    if (listName == null || listName == '') {
        return
    } else {
        const newList = buildObjects.createList(listName)
        addListInput.value = null
        listsFromLocalStorage.push(newList)
        // console.log(newList)
        selectedListID = newList.id
        saveAndRender()
    }
})

addTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    console.log('Here')
    const taskName = addTaskInput.value
    if (taskName == null || taskName == '') {
        return
    } else {
        const newTask = buildObjects.createTask(taskName)
        let currentListID = selectedListID
        if (currentListID === null) return
        lists = storageHandler.getLists()
        lists.forEach((list, i) => {
            if (+list.id == +currentListID) {
                taskList = lists.tasks || []                
                
                taskList.push(newTask)
                listsFromLocalStorage[i].tasks.push(newTask)
                list.tasks.push(listsFromLocalStorage)
                renderTasks(list, newTask)
            } else {
                return
            }
            i++
            addTaskInput.value = null
        });
    }
})

allListsUL.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        if (e.target.id === selectedListID) {
            selectedListID = null
            saveAndRender()
            closeList()
        } else if (selectedListID != null || selectedListID === null) {
            selectedListID = e.target.id
            saveAndRender()
            let lists = storageHandler.getLists() || []
            lists.forEach((list, i) => {
                if (+list.id === +selectedListID) {
                    let listToOpen = lists[i]
                    openList(listToOpen)
                } else {
                    return
                    // console.log('NOPE')
                }
                i++
            })

        }

    }
})

function render() {
    clearElement(allListsUL)
    renderLists()
}
function renderLists() {
    listsFromLocalStorage.forEach(list => {
        const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
        // console.log(selectedList)
        if (selectedList == null) {
            UIHandler.addListToView(list)
        } else if (list.id == +selectedListID) {
            UIHandler.updateToActive(list)
            openList(list)
        } else {
            UIHandler.addListToView(list)
        }
    });
}
function clearElement(element) {
    element.innerHTML = ''
}
function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
    localStorage.setItem(LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY, JSON.stringify(selectedListID))
}

function saveAndRender() {
    save()
    render()
}

function renderTasks(parent, task) {
    // console.log("Parent: "+parent)
    let parentToSend = JSON.stringify(parent)
    let taskElement = taskListUL
    let isComplete
    const dateCreated = new Date(+task.id).toDateString()
    if (task.completed === true) {
        isComplete = 'checked'
    }
    taskElement.innerHTML = `
        <li id="${task.id}" class="list-group-item list-group-item-action d-flex justify-content-between">
            <span>
                <input class="form-check-input me-1" type="checkbox" value="" id="${task.id + 'task'}" ${isComplete}>
                <label class="form-check-label" for="${task.id + 'task'}">${task.name}</label> [<em>${dateCreated}</em>]
            </span>
            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                <button type="button" class="btn btn-light btn-sm"><i
                    class="bi bi-pencil-fill"></i></button>
                <button type="button" class="btn btn-danger btn-sm" onClick="storageHandler.removeTask(${task.id})"><i
                    class="bi bi-trash-fill"></i></button>
            </div>
        </li>
    ` + taskElement.innerHTML
}

function closeList() {
    clearElement(taskListUL)
    let header = listViewHeader
    header.innerHTML = `
    <h1>Open a List</h1>
    <p></p>
    `
}
function openList(list) {
    let listTasks = list.tasks || []
    let header = listViewHeader
    closeList()
    console.log(list)
    const dateCreated = new Date(+list.id)
    header.innerHTML = `
    <h1>${list.name}</h1>
    <p>Created: ${dateCreated}</p>
    `
    listTasks.forEach(task => {
        renderTasks(list, task)
    });
}

document.addEventListener('DOMContentLoaded', renderLists())