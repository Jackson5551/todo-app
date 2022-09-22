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
const closeListButton = document.querySelector('#closeButton')
const taskCard = document.querySelector('.task-card-1')

const LOCAL_STORAGE_KEY = 'todoApp.listKey'
const LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY = 'todoApp.isSelected'
let listsFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []
let selectedListID = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_IS_SELECTED_ID_KEY))

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
    static editTask(id) {

    }
    static editListName(id) {

    }
    static updateCheckStatus(taskID) {
        const selectedList = listsFromLocalStorage.find(list => +list.id === +selectedListID)
        selectedList.tasks.forEach((task, i) => {
            if (+task.id == +taskID) {
                if (task.completed === false) {
                    task.completed = true;
                    renderFunc.saveAndRender()
                } else {
                    task.completed = false
                    renderFunc.saveAndRender()
                }
            } else { return }
        })
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
        const listCard = document.createElement('li')
        const cardText = document.createElement('div')
        const cardTitle = document.createElement('div')
        const cardTaskCount = document.createElement('em')
        const buttonContainer = document.createElement('div')
        const drag = document.createElement('i')
        const deleteButton = document.createElement('button')
        const deleteIcon = document.createElement('i')

        // listCard.id = `${list.id}`
        if(+list.id === +selectedListID){
            listCard.classList.add('list-card-1','active')
            drag.style.visibility = 'hidden'
            deleteButton.style.visibility = 'visible'
            toggleListFunc.openList(list)
        } else {
            listCard.classList.add('list-card-1')
            drag.style.visibility = 'visible'
            deleteButton.style.visibility = 'hidden'
        }
        cardText.classList.add('list-card-text')
        cardTitle.classList.add('list-card-title')
        cardTitle.innerHTML = `${list.name}`
        cardTaskCount.innerHTML = `${list.tasks.length} Tasks`
        drag.classList.add('bi', 'bi-grip-vertical')
        deleteButton.classList.add('btn-danger')
        deleteIcon.classList.add('bi', 'bi-trash-fill')

        listCard.appendChild(cardText)
        cardText.appendChild(cardTitle)
        cardText.appendChild(cardTaskCount)
        listCard.appendChild(buttonContainer)
        buttonContainer.appendChild(deleteButton)
        deleteButton.appendChild(deleteIcon)
        buttonContainer.appendChild(drag)

        view.appendChild(listCard)

        listCard.addEventListener('click', e => {
            // listCard.classList.remove('active')

            if (+selectedListID === +list.id) {
                selectedListID = null
                // listCard.classList.remove('active')
                toggleListFunc.closeList()
                renderFunc.saveAndRender()


            } else if (selectedListID !== null || selectedListID === null) {
                selectedListID = list.id
                renderFunc.saveAndRender()
                let lists = storageHandler.getLists() || []
                lists.forEach((allList, i) => {
                    if (+selectedListID === +allList.id) {
                        // listCard.classList.remove('active')
                        let listToOpen = lists[i]
                        // selectedListID = list.id
                        // toggleListFunc.closeList()
                        toggleListFunc.openList(listToOpen)
                    } else {
                        return

                        // listCard.classList.add('active')
                        // toggleListFunc.closeList()
                        // renderFunc.saveAndRender()

                    }
                    i++
                })
            }
        })

        deleteButton.addEventListener('click', e=>{
            storageHandler.removeList(+list.id)
        })

    }
    // Create task elements
    static addTasksToView(parent, task) {
        let taskElement = taskListUL

        const taskItem = document.createElement('li')
        taskItem.classList.add('task-card-1')
        const inputCheckbox = document.createElement('input')
        const inputText = document.createElement('label')
        const taskButtons = document.createElement('div')
        const edit = document.createElement('button')
        const editIcon = document.createElement('i')
        const deleteButton = document.createElement('button')
        const deleteButtonIcon = document.createElement('i')

        inputCheckbox.type = 'checkbox'
        inputCheckbox.checked = task.completed
        inputCheckbox.id = `checkBox${task.id}`
        inputText.classList.add('checkLabel')
        inputText.htmlFor = `checkBox${task.id}`
        inputText.innerHTML = `<input id="taskInput${task.id}" type="text" disabled value="${task.name}" class="labelTextInput"></input>`
        taskButtons.classList.add('taskButtons')
        edit.classList.add('btn-warning')
        deleteButton.classList.add('btn-danger')
        editIcon.classList.add('bi', 'bi-pencil-fill')
        deleteButtonIcon.classList.add('bi', 'bi-trash-fill')

        taskItem.appendChild(inputCheckbox)
        taskItem.appendChild(inputText)
        taskItem.appendChild(taskButtons)
        taskButtons.appendChild(edit)
        taskButtons.appendChild(deleteButton)
        edit.appendChild(editIcon)
        deleteButton.appendChild(deleteButtonIcon)

        taskElement.appendChild(taskItem)

        inputText.addEventListener('click', e => {
            console.log('inputText')
            storageHandler.updateCheckStatus(task.id)
            renderFunc.saveAndRender()
        })

        edit.addEventListener('click', e => {
            console.log('It works!')
        })
        deleteButton.addEventListener('click', e => {
            storageHandler.removeTask(task.id)
        })

    }
    static checkScreenSize(size) {
        if (window.innerWidth < size) {
            return true
        }
        else {
            return false
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
}

// Class to handle rendering
class renderFunc {
    static render() {
        this.screenSizeAdjustment()
        renderFunc.clearElement(allListsUL)
        renderFunc.renderLists()
    }
    static renderLists() {

        listsFromLocalStorage.forEach(list => {
            const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
            UIHandler.addListToView(list)
        });
    }
    static clearElement(element) {
        element.innerHTML = ''
    }


    static saveAndRender() {
        storageHandler.save()
        renderFunc.render()
    }
    static screenSizeAdjustment() {
        if (window.innerWidth > 900) {
            listView.style.visibility = 'visible';
            viewToDoListDiv.style.visibility = 'visible';
            // console.log('Width > 900')
        } else if (window.innerWidth < 900) {
            // console.log('Width < 900')
            // console.log(selectedListID)
            if (selectedListID === null) {
                // console.log('List ID is Null')
                listView.style.visibility = 'visible';
                viewToDoListDiv.style.visibility = 'hidden';
            } else if (selectedListID !== null) {
                // console.log('List ID is not Null')
                listView.style.visibility = 'hidden';
                viewToDoListDiv.style.visibility = 'visible';
            }
        }
    }

}

// Class to handle opening and closing the lists
class toggleListFunc {
    static closeList() {
        renderFunc.clearElement(taskListUL)
        let header = listViewHeader
        // selectedListID = null
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
    <span><h1><button onclick="" class="btn btn-transparent" id="closeButton"><i class="bi bi-arrow-left-square-fill"></i> Close</button>  <input type="text" disabled value="${list.name}" class="headerTextInput"></input> <button type="button" class="btn btn-transparent" id="${list.id}" onclick="storageHandler.editListName(${list.id})"><i class="bi bi-pencil-fill"></i> Edit</button></h1></span>
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

window.addEventListener('resize', renderFunc.screenSizeAdjustment())

window.onresize = () => {
    console.log('Resize')
    renderFunc.screenSizeAdjustment()
}

document.addEventListener('DOMContentLoaded', renderFunc.renderLists())