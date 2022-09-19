// ======================================================
// Variables
// ======================================================
const addListInput = document.querySelector('#addListInput')
const allListsUL = document.querySelector('#allLists')
const taskListUL = document.querySelector('#taskList')
const viewToDoListDiv = document.querySelector('#viewToDoList')
const addListForm = document.querySelector('#addListForm')
const listViewHeader = document.querySelector('#listViewHeader')
const addTaskForm = document.querySelector('#addTaskForm')
const addTaskInput = document.querySelector('#addTaskInput')

const LOCAL_STORAGE_KEY = 'todoApp.listKey'
const LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY = 'todoApp.isSelected'
let listsFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
let selectedListID = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY)) || []

// ======================================================
// Classes
// ======================================================

// Class to hold constructors for the lists and tasks
class buildObjects {
    // List
    static createList(name) {
        return { id: Date.now().toString(), name: name, desc: '', tasks: [] }
    }
    // Task. Will be stored in the tasks:[] of the list
    static createTask(name) {
        return { id: Date.now().toString(), name: name, desc: '', completed: false }
    }
}

// Class to interface with local storage
class storageHandler {
    // Retrieves the lists in local storage
    static getLists() {
        let lists;
        if (localStorage.getItem(LOCAL_STORAGE_KEY) === null) {
            lists = []
        } else {
            lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        }
        return lists;
    }
    // Adds the list
    static addList(list) {
        listsFromLocalStorage.push(list)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
    }
    // Removes the list
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
                renderFunc.clearElement(taskListUL)
            } else {
                console.log("FAILED " + i)
            }
            i++
        })
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
        renderFunc.saveAndRender()
    }
    // Removes a task
    static removeTask(id) {
        const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID) || []
        selectedList.tasks.forEach((task, i) => {
            if (+task.id == +id) {
                console.log('Yep! ' + task.name)
                selectedList.tasks.splice(i, 1)
                console.log(selectedList)
                renderFunc.saveAndRender()
            }
            i++
        });
    }
    // Saves everything to local storage
    static save() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
        localStorage.setItem(LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY, JSON.stringify(selectedListID))
    }
}

// Class to create HTML elements and output them
class UIHandler {
    // Create list card
    static addListToView(list) {
        const view = allListsUL;
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
    }
    // Update list card element to active
    static updateToActive(list) {
        const view = allListsUL;
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
    }
    // Create task elements
    static addTasksToView(parent, task) {
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
}

// Class to hold the functions triggered by event listeners
class eventListenerFunc {
    // Add list event
    static addListEvent(e) {
        e.preventDefault()
        const listName = addListInput.value
        if (listName == null || listName == '') {
            return
        } else {
            const newList = buildObjects.createList(listName)
            addListInput.value = null
            listsFromLocalStorage.push(newList)
            selectedListID = newList.id
            renderFunc.saveAndRender()
        }
    }
    // Add task event
    static addTaskEvent(e) {
        e.preventDefault()
        console.log('Here')
        const taskName = addTaskInput.value
        if (taskName == null || taskName == '') {
            return
        } else {
            const newTask = buildObjects.createTask(taskName)
            let currentListID = selectedListID
            if (currentListID === null) return
            let lists = storageHandler.getLists()
            lists.forEach((list, i) => {
                if (+list.id == +currentListID) {
                    let taskList = lists.tasks || []

                    taskList.push(newTask)
                    listsFromLocalStorage[i].tasks.push(newTask)
                    list.tasks.push(listsFromLocalStorage)
                    storageHandler.save()
                    UIHandler.addTasksToView(list, newTask)
                } else {
                    return
                }
                i++
                addTaskInput.value = null
            });
        }
    }
    // Select list event
    static selectListEvent(e) {
        if (e.target.tagName.toLowerCase() === 'li') {
            if (e.target.id === selectedListID) {
                selectedListID = null
                renderFunc.saveAndRender()
                toggleListFunc.closeList()
            } else if (selectedListID != null || selectedListID === null) {
                selectedListID = e.target.id
                renderFunc.saveAndRender()
                let lists = storageHandler.getLists() || []
                lists.forEach((list, i) => {
                    if (+list.id === +selectedListID) {
                        let listToOpen = lists[i]
                        toggleListFunc.openList(listToOpen)
                    } else {
                        return
                    }
                    i++
                })

            }

        }
    }
}

// Class to handle rendering
class renderFunc {
    static render() {
        renderFunc.clearElement(allListsUL)
        renderFunc.renderLists()
    }
    static renderLists() {
        listsFromLocalStorage.forEach(list => {
            const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
            if (selectedList == null) {
                UIHandler.addListToView(list)
            } else if (list.id == +selectedListID) {
                UIHandler.updateToActive(list)
                toggleListFunc.openList(list)
            } else {
                UIHandler.addListToView(list)
            }
        });
    }
    static clearElement(element) {
        element.innerHTML = ''
    }


    static saveAndRender() {
        storageHandler.save()
        renderFunc.render()
    }


}

// Class to handle opening and closing the lists
class toggleListFunc {
    static closeList() {
        renderFunc.clearElement(taskListUL)
        let header = listViewHeader
        header.innerHTML = `
    <h1>Open a List</h1>
    <p></p>
    `
    }
    static openList(list) {
        let listTasks = list.tasks || []
        let header = listViewHeader
        toggleListFunc.closeList()
        console.log(list)
        const dateCreated = new Date(+list.id)
        header.innerHTML = `
    <h1>${list.name}</h1>
    <p>Created: ${dateCreated}</p>
    `
        listTasks.forEach(task => {
            UIHandler.addTasksToView(list, task)
        });
        if (window.innerWidth <= 750) {
            console.log('Small')
        } else {
            console.log('Big')
        }
    }
}

// ======================================================
// Event listeners
// ======================================================

addListForm.addEventListener('submit', e => {
    eventListenerFunc.addListEvent(e)
})

addTaskForm.addEventListener('submit', e => {
    eventListenerFunc.addTaskEvent(e)
})

allListsUL.addEventListener('click', e => {
    eventListenerFunc.selectListEvent(e)
})

document.addEventListener('DOMContentLoaded', renderFunc.renderLists())