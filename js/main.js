// ======================================================
// Variables
// ======================================================
const addListInput = document.querySelector('#addListInput')
const listView = document.querySelector('#listView')
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
        <li id="${list.id}" class="list-card-1">
            <div class="list-card-text" id="${list.id}">
                <div class="list-card-title" id="${list.id}">${list.name}</div>
                <em id="${list.id}">${list.tasks.length} Tasks</em>
            </div>
            <span class="">
                <i class="bi bi-grip-vertical"></i>
            </span>
        </li>
        `
        view.innerHTML = listToAdd + view.innerHTML
    }
    // Update list card element to active
    static updateToActive(list) {
        const view = allListsUL;
        const dateCreated = new Date(+list.id).toDateString()
        let listToAdd = `
        <li id="${list.id}" class="list-card-1 active">
            <div class="list-card-text" id="${list.id}">
                <div class="list-card-title" id="${list.id}">${list.name}</div>
                <em id="${list.id}">${list.tasks.length} Tasks</em>
            </div>
            <span class="">
                <div class="">
                    <button type="button" class="btn btn-danger" id="deleteListButton" onclick="storageHandler.removeList(${list.id})"><i class="bi bi-trash-fill" id="deleteListButton"></i></button>
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
        <li id="${task.id}" class="task-card-1">
            <span>
                <input class="" type="checkbox" value="" id="${task.id + 'task'}" ${isComplete}>
            </span>
            <label class="" for="${task.id + 'task'}">${task.name}</label>
            <div class="">
                <button type="button" class="btn btn-warning"><i
                    class="bi bi-pencil-fill"></i></button>
                <button type="button" class="btn btn-danger" onClick="storageHandler.removeTask(${task.id})"><i
                    class="bi bi-trash-fill"></i></button>
                    
                <i class="bi bi-grip-vertical"></i>
            </div>
        </li>
    ` + taskElement.innerHTML
    }
    static checkScreenSize(size) {
        if (window.innerWidth < size) {
            return true
        }
        else {
            return false
        }
    }
    static adjustScreen() {
        if (this.checkScreenSize(900)) {
            listView.style.visibility = 'visible';
            viewToDoListDiv.style.visibility = 'hidden';
        } else {
            listView.style.visibility = 'visible';
            viewToDoListDiv.style.visibility = 'visible';
        }
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
                    renderFunc.clearElement(allListsUL)
                    renderFunc.saveAndRender()
                    // UIHandler.addTasksToView(list, newTask)
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
        if (!UIHandler.checkScreenSize(900)) {
            console.log('Big')
            if (e.target.tagName.toLowerCase() !== 'span') {
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
        } else {
            console.log('Small')
            if (e.target.tagName.toLowerCase() !== 'span') {
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
                            listView.style.visibility = 'hidden'
                            viewToDoListDiv.style.visibility = 'visible'
                        } else {
                            return
                        }
                        i++
                    })
                }
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
    <span><h1>${list.name} <button type="button" class="btn btn-transparent" id="${list.id}"><i class="bi bi-pencil-fill"></i></button></h1></span>
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