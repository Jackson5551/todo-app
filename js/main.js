const addListInput = document.querySelector('#addListInput')
const allListsUL = document.querySelector('#allLists')
const viewToDoListDiv = document.querySelector('#viewToDoList')
const addListForm = document.querySelector('#addListForm')
let deleteListButton = document.querySelector('#deleteListButton')


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
            } else{
                console.log("FAILED " + i )
            }
            i++
        })
        // listsFromLocalStorage.push(lists)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
        saveAndRender()
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
                    <button type="button" class="btn btn-light"><i class="bi bi-pencil-fill"></i></button>
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
                    <button type="button" class="btn btn-danger" id="deleteListButton" onclick="storageHandler.removeList(${list.id})"><i class="bi bi-trash-fill" id="deleteListButton"></i></button>
                    <button type="button" class="btn btn-light"><i class="bi bi-pencil-fill"></i></button>
                </div>
            </span>
        </li>
        `
        view.innerHTML = listToAdd + view.innerHTML
        // console.log(list)
    }
    static deleteList(listID) {

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

allListsUL.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListID = e.target.id
        saveAndRender()
    }
})

// deleteListButton.addEventListener('click', e => {
    
//     console.log('Im here')
//     if (e.target.tagName.toLowerCase() === 'li') {
//         listToRemove = e.target.id
//         storageHandler.removeList(listToRemove)
//         // listsFromLocalStorage = listsFromLocalStorage.filter(list => list.id !== selectedListID)
//         selectedListID = null
//     }
// })

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

document.addEventListener('DOMContentLoaded', renderLists())