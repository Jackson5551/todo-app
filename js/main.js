const addListInput = document.querySelector('#addListInput')
const allListsUL = document.querySelector('#allLists')
const viewToDoListDiv = document.querySelector('#viewToDoList')

function addList() {
    let list = {
        name: addListInput.value,
        desc: addListInput.value,
        id: addListInput.value,
        content: {
            item: {
                name: 'IT WORKS!',
                desc: '',
                status: false
            }
        }
    }
    allListsUL.innerHTML = `
        <li class="list-group-item d-flex justify-content-between align-items-start" onclick="showList(${list})">
            <div class="ms-2 me-auto">
                <div class="fw-bold">${list.name}</div>
                    ${list.content.item.name}
                </div>
            <span class="badge bg-primary rounded-pill">14</span>
        </li>
    ` + allListsUL.innerHTML

}

function showList(listName) {
    viewToDoListDiv.innerHTML = `
    <p>${listName.name}</p>
    <p>${listName.desc}</p>
    <p>${listName.content.item.name}</p>
    <p>${listName.content.item.status}</p>
    `
}
