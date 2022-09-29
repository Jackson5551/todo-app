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
// addTaskForm.style.visibility = 'hidden'
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
    static removeList(id) {
        toggleListFunc.closeList()
        let lists = storageHandler.getLists()
        lists.forEach((list, i) => {
            if (+list.id === +id) {
                listsFromLocalStorage.splice(i, 1);
            }
            i++
        })
        renderFunc.saveAndRender()
    }
    // Removes a task
    static removeTask(id) {
        const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID) || []
        selectedList.tasks.forEach((task, i) => {
            if (+task.id == +id) {
                selectedList.tasks.splice(i, 1)
                renderFunc.saveAndRender()
            }
            i++
        });
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
        const deleteButton = document.createElement('button')
        const deleteIcon = document.createElement('i')
        const handle = document.createElement('i')

        if (+list.id === +selectedListID) {
            listCard.classList.add('list-card-1', 'active')
            toggleListFunc.openList(list)
        } else {
            listCard.classList.add('list-card-1')
        }
        listCard.id = list.id
        cardText.classList.add('list-card-text')
        cardTitle.classList.add('list-card-title')
        cardTitle.innerHTML = `${list.name}`
        cardTaskCount.innerHTML = `${list.tasks.length} Tasks`
        deleteButton.classList.add('btn-danger', 'smallScreenDeleteBtn')
        deleteIcon.classList.add('bi', 'bi-trash-fill')
        handle.classList.add('bi', 'bi-grip-vertical', 'grip')

        listCard.appendChild(handle)
        listCard.appendChild(cardText)
        cardText.appendChild(cardTitle)
        cardText.appendChild(cardTaskCount)
        listCard.appendChild(buttonContainer)
        buttonContainer.appendChild(deleteButton)
        deleteButton.appendChild(deleteIcon)

        if (view.firstChild === null) {
            view.appendChild(listCard)

        } else {
            view.insertBefore(listCard, view.children[0])
        }

        cardText.addEventListener('click', e => {

            if (+selectedListID === +list.id) {
                selectedListID = null
                toggleListFunc.closeList()
                renderFunc.saveAndRender()

            } else if (selectedListID !== null || selectedListID === null) {
                selectedListID = list.id
                renderFunc.saveAndRender()
                let lists = storageHandler.getLists() || []
                lists.forEach((allList, i) => {
                    if (+selectedListID === +allList.id) {
                        let listToOpen = lists[i]
                        toggleListFunc.openList(listToOpen)

                    } else {

                        return
                    }
                    i++
                })
            }

        })

        deleteButton.addEventListener('click', () => {
            const warningBox = document.createElement('li')
            const div = document.createElement('div')
            const warningText = document.createElement('span')
            const warningButtonContainer = document.createElement('div')
            const deleteForSureButton = document.createElement('button')
            const cancelButton = document.createElement('button')

            warningBox.classList.remove('active', 'hover')
            warningBox.classList.add('list-card-1', 'warning')
            div.classList.add('warning-container')
            warningText.innerHTML = `<strong>Delete</strong> ${list.name}?`
            warningButtonContainer.classList.add('warning-btn-container')
            deleteForSureButton.classList.add('btn-danger-invert')
            deleteForSureButton.innerHTML = '<i class="bi bi-trash-fill"></i> <strong>Delete</strong>'
            cancelButton.classList.add('btn-secondary-invert')
            cancelButton.innerHTML = '<i class="bi bi-x-circle-fill"></i> <strong>Cancel</strong>'


            div.appendChild(warningText)
            div.appendChild(warningButtonContainer)
            warningButtonContainer.appendChild(deleteForSureButton)
            warningButtonContainer.appendChild(cancelButton)
            warningBox.appendChild(div)

            view.insertBefore(warningBox, listCard)
            listCard.style.display = 'none'

            deleteForSureButton.addEventListener('click', () => {
                storageHandler.removeList(list.id)
                selectedListID = null
            })

            cancelButton.addEventListener('click', () => {
                view.removeChild(warningBox)
                listCard.style.display = 'flex'
            })
        })

        listCard.addEventListener('dragstart', () => {
            listCard.classList.add('isDraggingClass')
            listCard.classList.remove('hover')
        })
        handle.addEventListener('touchstart', () => {
            listCard.classList.add('isDraggingClass')
            listCard.classList.remove('hover')
        })
        listCard.addEventListener('dragend', () => {
            listCard.classList.remove('isDraggingClass')
            let ulLength = allListsUL.childElementCount
            let listLocation
            var moveInArray = function (arr, from, to) {
                var item = arr.splice(from, 1)
                arr.splice(to, 0, item[0])
                storageHandler.save()
            }

            allListsUL.childNodes.forEach((node, i) => {
                if (node.id === list.id) {
                    listLocation = i
                    return
                } else {
                    i++
                }
            })
            let newListLocation = ulLength - listLocation - 1
            listsFromLocalStorage.forEach((fList, i) => {
                if (fList.id === list.id) {
                    moveInArray(listsFromLocalStorage, i, (newListLocation))
                    renderFunc.saveAndRender()
                    return
                } else {
                    i++
                }
            })
        })
        listCard.addEventListener('touchend', () => {
            listCard.classList.remove('isDraggingClass')
            let ulLength = listsFromLocalStorage.length
            let listLocation = null
            var moveInArray = function (arr, from, to) {
                var item = arr.splice(from, 1)
                arr.splice(to, 0, item[0])
                storageHandler.save()
            }

            allListsUL.childNodes.forEach((node, i) => {
                if (node.id === list.id && listLocation === null) {
                    listLocation = i
                    return
                } else {
                    i++
                }
            })
            let newListLocation = ulLength - listLocation - 1
            listsFromLocalStorage.forEach((fList, i) => {
                if (fList.id === list.id && listLocation !== null) {
                    moveInArray(listsFromLocalStorage, i, newListLocation)
                    renderFunc.saveAndRender()
                    return
                } else {
                    i++
                }
            })
        })
        buttonContainer.addEventListener('mouseover', () => {
            listCard.classList.add('hover')
        })
        buttonContainer.addEventListener('mouseleave', () => {
            listCard.classList.remove('hover')
        })
        cardText.addEventListener('mouseover', () => {
            listCard.classList.add('hover')
        })
        cardText.addEventListener('mouseleave', () => {
            listCard.classList.remove('hover')
        })
    }
    // Create task elements
    static addTasksToView(parent, task) {
        let taskElement = taskListUL

        const taskItem = document.createElement('li')
        taskItem.classList.add('task-card-1')
        const inputCheckbox = document.createElement('input')
        const label = document.createElement('label')
        const labelTextBox = document.createElement('input')
        const taskButtons = document.createElement('div')
        const edit = document.createElement('button')
        const editIcon = document.createElement('i')
        const deleteButton = document.createElement('button')
        const deleteButtonIcon = document.createElement('i')
        const handle = document.createElement('div')

        taskItem.id = task.id
        inputCheckbox.type = 'checkbox'
        inputCheckbox.checked = task.completed
        inputCheckbox.id = `checkBox${task.id}`
        label.classList.add('checkLabel')
        label.htmlFor = `checkBox${task.id}`
        labelTextBox.classList.add('labelTextInput')
        labelTextBox.type = 'textarea'
        labelTextBox.value = task.name
        labelTextBox.disabled = true
        taskButtons.classList.add('taskButtons')
        edit.classList.add('btn-warning')
        deleteButton.classList.add('btn-danger')
        editIcon.classList.add('bi', 'bi-pencil-fill')
        deleteButtonIcon.classList.add('bi', 'bi-trash-fill')
        handle.classList.add('grip')
        handle.innerHTML = `<i class="bi bi-grip-vertical"></i>`

        taskItem.appendChild(handle)
        taskItem.appendChild(inputCheckbox)
        taskItem.appendChild(label)
        label.appendChild(labelTextBox)
        taskItem.appendChild(taskButtons)
        taskButtons.appendChild(edit)
        taskButtons.appendChild(deleteButton)
        edit.appendChild(editIcon)
        deleteButton.appendChild(deleteButtonIcon)

        if (taskElement.children.length === null) {
            taskElement.appendChild(taskItem)

        } else {
            taskElement.insertBefore(taskItem, taskElement.children[0])
        }

        label.addEventListener('click', e => {
            if (labelTextBox.disabled) {
                storageHandler.updateCheckStatus(task.id)
                renderFunc.saveAndRender()
            } else {
                return
            }
        })

        edit.addEventListener('click', e => {
            labelTextBox.disabled = false
            labelTextBox.focus()
            editIcon.classList.remove('bi', 'bi-pencil-fill')
            editIcon.classList.add('bi-check-circle-fill')
            edit.classList.remove('btn-warning')
            edit.classList.add('btn-success')
        })
        labelTextBox.addEventListener(('blur'), e => {
            labelTextBox.disabled = true
            const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
            const selectedTask = selectedList.tasks.find(_task => _task.id === task.id)
            selectedTask.name = labelTextBox.value
            renderFunc.saveAndRender()
        })
        labelTextBox.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                labelTextBox.disabled = true
                const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
                const selectedTask = selectedList.tasks.find(_task => _task.id === task.id)
                selectedTask.name = labelTextBox.value
                renderFunc.saveAndRender()
            }
        })
        deleteButton.addEventListener('click', e => {
            storageHandler.removeTask(task.id)
        })
        label.addEventListener('mouseover', () => {
            taskItem.classList.add('hover')
        })
        label.addEventListener('mouseleave', () => {
            taskItem.classList.remove('hover')
        })
        taskItem.addEventListener('dragstart', () => {
            taskItem.classList.add('isDraggingClass')
            taskItem.classList.remove('hover')
        })
        handle.addEventListener('touchstart', () => {
            taskItem.classList.add('isDraggingClass')
            taskItem.classList.remove('hover')
        })

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('isDraggingClass')
            let selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
            let ulLength = taskListUL.childElementCount
            let listLocation = null
            var moveInArray = function (arr, from, to) {
                var item = arr.splice(from, 1)
                arr.splice(to, 0, item[0])
                storageHandler.save()
            }
            taskListUL.childNodes.forEach((node, i) => {
                if (node.id === task.id && listLocation === null) {
                    listLocation = i
                    return
                } else {
                    i++
                }
            })
            let newListLocation = ulLength - listLocation - 1

            selectedList.tasks.forEach((fTask, i) => {
                if (fTask.id === task.id && listLocation !== null) {
                    moveInArray(selectedList.tasks, i, newListLocation)
                    renderFunc.saveAndRender()
                    return
                } else {
                    i++
                }
            })
        })
        handle.addEventListener('touchend', () => {
            taskItem.classList.remove('isDraggingClass')
            let selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
            let ulLength = taskListUL.childElementCount
            let listLocation = null
            var moveInArray = function (arr, from, to) {
                var item = arr.splice(from, 1)
                arr.splice(to, 0, item[0])
                storageHandler.save()
            }
            taskListUL.childNodes.forEach((node, i) => {
                if (node.id === task.id && listLocation === null) {
                    listLocation = i
                    return
                } else {
                    i++
                }
            })
            let newListLocation = ulLength - listLocation - 2

            selectedList.tasks.forEach((fTask, i) => {
                if (fTask.id === task.id && listLocation !== null) {
                    moveInArray(selectedList.tasks, i, newListLocation)
                    renderFunc.saveAndRender()
                    return
                } else {
                    i++
                }
            })
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
        } else if (window.innerWidth < 900) {
            if (selectedListID === null) {
                listView.style.visibility = 'visible';
                viewToDoListDiv.style.visibility = 'hidden';
            } else if (selectedListID !== null) {
                listView.style.visibility = 'hidden';
                viewToDoListDiv.style.visibility = 'visible';
            }
        }
    }

}

// Class to handle opening and closing the lists
class toggleListFunc {
    static closeList() {
        addTaskForm.style.visibility = 'hidden'
        renderFunc.clearElement(taskListUL)
        let header = listViewHeader
        renderFunc.screenSizeAdjustment()
        header.innerHTML = `
        <h1></h1>
        <p></p>
        `
    }
    static openList(list) {
        let listTasks = list.tasks || []
        const header = listViewHeader
        toggleListFunc.closeList()
        addTaskForm.style.visibility = 'visible'
        const dateCreated = new Date(+list.id)
        renderFunc.clearElement(header)
        const div = document.createElement('div')
        const span = document.createElement('span')
        const h1 = document.createElement('h1')
        const closeBtn = document.createElement('button')
        const input = document.createElement('input')
        const editBtn = document.createElement('button')
        const p = document.createElement('p')

        closeBtn.classList.add('btn-primary')
        closeBtn.innerHTML = `<i class="bi bi-arrow-left"></i> Collapse`
        input.classList.add('headerTextInput')
        input.type = 'text'
        input.value = list.name
        input.disabled = true
        editBtn.classList.add('btn-warning')
        editBtn.innerHTML = `<i class="bi bi-pencil-fill"></i> Edit`
        p.innerHTML = 'Created: ' + dateCreated.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: '2-digit' }) + ' at ' + dateCreated.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' })

        div.appendChild(span)
        span.appendChild(h1)
        h1.appendChild(closeBtn)
        h1.appendChild(input)
        h1.appendChild(editBtn)
        div.appendChild(p)

        header.appendChild(div)
        closeBtn.addEventListener('click', e => {
            this.closeList()
            selectedListID = null
            renderFunc.saveAndRender()
        })
        editBtn.addEventListener('click', e => {
            input.disabled = false
            input.focus()
            editBtn.innerHTML = `<i class="bi bi-check-circle-fill"></i> Save`
            editBtn.classList.remove('btn-warning')
            editBtn.classList.add('btn-success')
        })

        input.addEventListener('blur', e => {
            input.disabled = true
            editBtn.innerHTML = `<i class="bi bi-pencil-fill"></i> Edit`
            editBtn.classList.add('btn-warning')
            editBtn.classList.remove('btn-success')
            const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
            selectedList.name = input.value
            renderFunc.saveAndRender()
        })
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                input.disabled = true
                editBtn.innerHTML = `<i class="bi bi-pencil-fill"></i> Edit`
                editBtn.classList.add('btn-warning')
                editBtn.classList.remove('btn-success')
                const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
                selectedList.name = input.value
                renderFunc.saveAndRender()
            }
        })

        listTasks.forEach(task => {
            UIHandler.addTasksToView(list, task)
        });
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
    renderFunc.screenSizeAdjustment()
}

new Sortable(allListsUL, {
    handle: '.grip', // handle's class
    animation: 150
});
new Sortable(taskListUL, {
    handle: '.grip',
    animation: 150
})

document.addEventListener('DOMContentLoaded', ()=>{
    if(selectedListID === null){
        addTaskForm.style.visibility = 'hidden'
    } else {
        addTaskForm.style.visibility = 'visible'
    }
    renderFunc.renderLists()
})