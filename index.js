let boards = [];
let currentBoardId = null;

const createBoardBtn = document.getElementById('createBoardBtn');
const boardListEl = document.getElementById('boardList');
const boardDetailsEl = document.getElementById('boardDetails');

const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalTitle = document.getElementById('modalTitle');
const modalInput = document.getElementById('modalInput');
const modalContextType = document.getElementById('modalContextType');
const modalContextId = document.getElementById('modalContextId');
const modalSaveBtn = document.getElementById('modalSaveBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');


createBoardBtn.addEventListener('click', ()=> {
    openModal({
        title: 'Create Board',
        contextType: 'createBoard'
    })
})

modalCancelBtn.addEventListener('click',() => closeModal())
modalSaveBtn.addEventListener('click', () => handleModalSave());

function openModal({title, defaultValue="",contextType, contextId= ""}){

    modalTitle.textContent = title;
    modalInput.value= defaultValue;
    modalContextType.value = contextType;
    modalContextId.value = contextId;

    modalOverlay.style.display = 'flex';
    modalInput.focus();
}

function closeModal(){
    modalOverlay.style.display = 'none';
    modalInput.value= "";
    modalContextType.value = "";
    modalContextId.value = "";
}

function handleModalSave(){
    const nameValue = modalInput.value.trim();
    const type = modalContextType.value;
    const id = modalContextId.value;

    if(!nameValue){
        alert('Please enter a name');
        return;
    }

    switch(type){
        case 'createBoard':
            // console.log(type);
            createBoard(nameValue);
            break;
    }

    closeModal();
}

function createBoard(boardName){
    const newBoard = {
        id: genrateId('board'),
        name: boardName,
        columns: []
    };
    boards.push(newBoard);
    renderBoardList();
    selectBoard(newBoard.id);   // after creating new board automaticaly the selectBoard function will set active class to that board.
}

// when someone click on any board item then this function exec, this is used to render the that perticular boards coloumn on the main page.
function selectBoard(boardId){
    currentBoardId = boardId;
    renderBoardList();
    const board = boards.find(b => b.id === boardId);  //finds the perticular board and then add the details on the main page for that perticular board.
    renderBoardDetails(board) ;
}

// genrate the id for boards,
function genrateId(prefix){
    let val = prefix+`-${Math.floor(Math.random()*1000000)}`;
    return val;
}

// the below function perform 2 things first:- update the list to add new list items in board list if any new list element is pushed into boards array using the createBoard function, second:- is whenever any boardList item is clicked then also this is rendered using the selectionBoard function.
function renderBoardList(){
    boardListEl.innerHTML = '';
    boards.forEach(board =>{
        const li = document.createElement('li');
        li.textContent = board.name;
        li.dataset.id = board.id;
        if(board.id === currentBoardId){    // this logic is used just to change the color of currently clicked boardList element.
            li.classList.add('active');
        }
        li.addEventListener('click', ()=> selectBoard(board.id));
        boardListEl.appendChild(li);
    })
}

// this function will create the neww coloumn (adding details to a perticular board as tasks.)
function renderBoardDetails(board){
    boardDetailsEl.innerHTML ='';
    if(!board){             // this will exec when no any board is created or selected.
        const p = document.createElement('p');
        p.textContent = 'No board is selected. Create or select a board.';
        boardDetailsEl.appendChild(p);
        return;
    }

    const titleArea = document.createElement('div');
    titleArea.classList.add('boaardTitleArea');

    const h2 = document.createElement('h2');
    h2.textContent = board.name;
    titleArea.appendChild(h2);

    const addColumnBtn = document.createElement('button');
    addColumnBtn.classList.add('addColumnBtn');
    addColumnBtn.textContent= 'Add Column';
    addColumnBtn.addEventListener('click', ()=> {
        openModal({
            title: 'Create Column',
            contextType: 'createColumn',
            contextId: ""
        })
    })

    console.log(titleArea);
    boardDetailsEl.appendChild(titleArea);
}

//  fix:- the issue time:-1:49:00