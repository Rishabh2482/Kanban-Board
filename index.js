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
            createBoard(nameValue);
            break;

        case 'createColumn':
            createColumn(currentBoardId, nameValue);
            break;

        case 'editColumn':
            editColumn(id, nameValue);
            break;

        case 'createTicket':
            createTicket(id, nameValue);
            break;

        case 'editTicket':
            updateTicket(id, nameValue);
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

//! Column
function createColumn(boardId, nameValue){
    const board = boards.find(b => b.id == boardId);
    if(!board) return;

    board.columns.push({
        id: genrateId('col'),
        name: nameValue,
        tickets: []
    })
    renderBoardDetails(board);
}

function editColumn(colId, nameValue){
    const board = boards.find(b => b.id===currentBoardId);
    if(!board) return;
    const column = board.columns.find(c => c.id == colId);
    if(!column) return;
    column.name = nameValue;
    renderBoardDetails(board);
}

// remove all the columns in columns array whoes columnid is equal to current colId.
function deleteColumn(colId){
    const board = boards.find(b => b.id===currentBoardId);
    if(!board) return;
    board.columns = board.columns.filter(c => c.id !== colId);
    renderBoardDetails(board);
}

// ! Ticket
function createTicket(colId, nameValue){
    const board = boards.find(b => b.id == currentBoardId);
    if(!board) return;
    const column = board.columns.find(c => c.id == colId);
    if(!column) return;
    column.tickets.push({
        id: genrateId('ticket'),
        name: nameValue,
    })
    renderBoardDetails(board);
}

function updateTicket(ticketId, nameValue){
    const board = boards.find(b => b.id===currentBoardId);
    if(!board) return;
    for(const col of board.columns){
        const ticket = col.tickets.find(t => t.id === ticketId);
        if(ticket){
            ticket.name = nameValue;
            break;
        }
    }
    renderBoardDetails(board);
}

function deleteTicket(ticketId){
    const board = boards.find(b => b.id===currentBoardId);
    if(!board) return;
    for(const col of board.columns){
        col.tickets = col.tickets.filter(t => t.id !== ticketId);
    }
    renderBoardDetails(board);
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
    titleArea.classList.add('boardTitleArea');

    
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

    titleArea.appendChild(addColumnBtn);
    boardDetailsEl.appendChild(titleArea);

    // Now we have to render complete list of all coloumns in a board.
    const columnsContainer = document.createElement('div');
    columnsContainer.classList.add('columnsContainer');

    board.columns.forEach(column => {
        const columnEl = document.createElement('div');
        columnEl.classList.add('column');

        const columnHeader = document.createElement('div');
        columnHeader.classList.add('columnHeader');

        const colTitle = document.createElement('h3');
        colTitle.textContent = column.name;
        // console.log(column.name);       //^ .name property are attached directly with the form values to get the value directly from formelement in js we can use .name property

        const colButtonsDiv = document.createElement('div');
        colButtonsDiv.classList.add('columnButtons');

        const editColBtn = document.createElement("button");
        editColBtn.classList.add('editColBtn');
        editColBtn.textContent = '✏️';
        editColBtn.addEventListener('click', () => {
            openModal({
                title: 'Edit Column',
                contextType: 'editColumn',
                contextId: column.id,
                defaultValue: column.name
            })
        })
        
        const deleteColBtn = document.createElement("button");
        deleteColBtn.classList.add('deleteColBtn');
        deleteColBtn.textContent = '🗑️';
        deleteColBtn.addEventListener('click', () => {
            deleteColumn(column.id);
        })

        colButtonsDiv.appendChild(editColBtn);
        colButtonsDiv.appendChild(deleteColBtn);

        columnHeader.appendChild(colTitle);
        columnHeader.appendChild(colButtonsDiv);

        columnEl.appendChild(columnHeader);

        const addTicketBtn = document.createElement("button");
        addTicketBtn.classList.add('addTicketBtn');
        addTicketBtn.textContent = 'Add Ticket';
        addTicketBtn.addEventListener('click', () => {
            openModal({
                title: 'Create Ticket',
                contextType: 'createTicket',
                contextId: column.id,
                defaultValue: column.name
            })
        })

        columnEl.appendChild(addTicketBtn);

        const ticketsContainer = document.createElement('div');
        ticketsContainer.classList.add('ticketsContainer');
// drag and drop fn
        columnEl.addEventListener('dragover', dragOverHandler);
        columnEl.addEventListener('drop', e => dropHandler(e, column, board));

        column.tickets.forEach(ticket => {
            const ticketEl = document.createElement('div');
            ticketEl.classList.add('ticket');
// drag and drop fn
            ticketEl.draggable = true;
            ticketEl.addEventListener('dragstart', e =>{
                dragStartHandler(e, ticket, column, board);
            })

            ticketEl.addEventListener('dragend', dragEndHandler);
//
            const ticketNameSpan = document.createElement('span');
            ticketNameSpan.classList.add('ticketName');
            ticketNameSpan.textContent = ticket.name;

            const ticketButtonsDiv = document.createElement('div');
            ticketButtonsDiv.classList.add('ticketButtons');

            const editTicketBtn = document.createElement('button');
            editTicketBtn.classList.add('editTicketBtn');
            editTicketBtn.textContent = '✏️';
            editTicketBtn.addEventListener('click', () => {
                openModal({
                    title: 'Edit Ticket',
                    contextType: 'editTicket',
                    contextId: ticket.id,
                    defaultValue: ticket.name
                })
            })

            const deleteTicketBtn = document.createElement('button');
            deleteTicketBtn.classList.add('deleteTicketBtn');
            deleteTicketBtn.textContent = '🗑️';
            deleteTicketBtn.addEventListener('click', () => {
                deleteTicket(ticket.id);
            })

            ticketButtonsDiv.appendChild(editTicketBtn);
            ticketButtonsDiv.appendChild(deleteTicketBtn);

            ticketEl.appendChild(ticketNameSpan);
            ticketEl.appendChild(ticketButtonsDiv);

            ticketsContainer.appendChild(ticketEl);
        })

        columnEl.appendChild(ticketsContainer);
        columnsContainer.appendChild(columnEl);

    })

    boardDetailsEl.appendChild(columnsContainer);
}

// Drag and Drop
let draggedTicketData = null;

function dragStartHandler(e, ticket, fromColumn, fromBoard){// this define the location from where the drag started
    draggedTicketData = {ticket, fromColumn, fromBoard}
}

function dragEndHandler(e){
    draggedTicketData = null;
}
function dragOverHandler(e){
    e.preventDefault();
}
function dropHandler(e, toColumn, toBoard){
    e.preventDefault();
    if(!draggedTicketData) return;
    const {ticket, fromColumn, fromBoard} =draggedTicketData;
    fromColumn.tickets =  fromColumn.tickets.filter(t => t.id !== ticket.id);
    toColumn.tickets.push(ticket);
    renderBoardDetails(fromBoard);
}