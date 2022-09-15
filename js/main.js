const addListInput = document.querySelector('#addListInput')
const allListsUL = document.querySelector('#allLists')
const viewToDoListDiv = document.querySelector('#viewToDoList')
const addListForm = document.querySelector('#addListForm')
const deleteListButton = document.querySelector('deleteListButton')


const LOCAL_STORAGE_KEY = 'todoApp.listKey'
const listsFromLocalStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || []

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
            console.log(lists)
        } else {
            lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
            console.log(lists)
        }
        console.log(lists)
        return lists;
    }

    static addList(list) {
        // let lists = storageHandler.getLists()
        listsFromLocalStorage.push(list)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
    }

    static removeList(date) {
        let lists = storageHandler.getLists()
        lists.forEach((list, index) => {
            if (list.date === date) {
                lists.splice(index, 1);
            }
        })
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lists))
    }
}

class UIHandler {
    static displayLists() {
        const lists = storageHandler.getLists();
        clearElement(allListsUL)
        lists.forEach((list) => UIHandler.addListToView(list));
    }
    static addListToView(list) {
        const view = allListsUL;
        // clearElement(view)
        view.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${list.name}</div>
                    ${list.desc}
            </div>
            <span class="d-flex flex-column justify-content-between">
                <span class="badge bg-danger rounded-pill mb-1" id="deleteButton"><i class="bi bi-trash-fill"></i></span>
                <span class="badge bg-warning rounded-pill" id="editButton"><i class="bi bi-pencil-fill"></i></span>
            </span>
        </li>
        ` + view.innerHTML
        console.log(list)
    }
    static deleteList() {

    }
}

// window.addEventListener('DOMContentLoaded', render())

addListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = addListInput.value
    const newList = buildObjects.createList(listName)
    addListInput.value = null
    // listsFromLocalStorage = storageHandler.getLists()
    listsFromLocalStorage.push(newList)
    console.log(newList)
    saveAndRender()
})

function render() {
    clearElement(viewToDoListDiv)
    UIHandler.displayLists()

    const selectedList = listsFromLocalStorage.find(list => list.id === selectedListID)
    // if(selectedListID == null){
    //     return
    // } else {
    //     selectedList.forEach(element => {

    //     });
    // }
}
function clearElement(element){
    element.innerHTML = ''
}
function save() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listsFromLocalStorage))
}

function saveAndRender() {
    save()
    render()
}

render()