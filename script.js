const plusBtn = document.getElementById('plus-btn');
const taskList = document.getElementById('task-list');
const addBtn = document.getElementById('add-task-btn');
const sortBtn = document.getElementById('sort-btn');
const sortIcon = document.getElementById('sort-icon');

  
const PATHS = {
    editGray: './Pic/edit-gray.png',
    editPurple: './Pic/edit-purple.png',
    deleteGray: './Pic/delete-gray.png',
    deletePurple: './Pic/delete-purple.png',
    plusGray: './Pic/plus-gray.png',
    plusPurple: './Pic/plus-purple.png',
    sortDownGray: './Pic/down-gray.png',
    sortDown: './Pic/down.png',
    sortUpGray: './Pic/up-gray.png',
    sortUp: './Pic/up.png',
    addIcon: './Pic/add.png',
    addPurple: './Pic/add-violet.png'
};


function createInputRow(value = "") {
    const li = document.createElement('li'); 
    li.className = 'task-item editing'; 
      
    li.innerHTML = 
    '<input type="text" class="task-input" value="'
     + value + '">' + '<div class="action-icons">'
      + '<img src="' + PATHS.deleteGray
       + '" class="delete-icon">' +
     '</div>';     
        

    const input = li.querySelector('.task-input'); 
    const deleteImg = li.querySelector('.delete-icon');

        // Кнопка удаления
    deleteImg.addEventListener('click', () => {
        input.value = ''; 
        input.focus(); 
       
    });

    deleteImg.addEventListener('mouseenter', () => { 
        deleteImg.src = PATHS.deletePurple; 
        // меняем картинку при наведении
    });

    deleteImg.addEventListener('mouseleave', () => { 
        deleteImg.src = PATHS.deleteGray; 
    });

    return li; 

}
let isAscending = true;


// 2 обновляет иконку сортировки
function updateSortIcon(isHover) {
    if (isAscending) { //  по возрастанию вниз
        if (isHover) {  
            sortIcon.src = PATHS.sortDown; 
        } else {        
            sortIcon.src = PATHS.sortDownGray; 
        }
    } else {            // по убыванию вверх
        if (isHover) { 
            sortIcon.src = PATHS.sortUp; 
        } else {       
            sortIcon.src = PATHS.sortUpGray; 
        }
    }
} 

// 3 сортирует задачи
    // Находим все завершённые задачи (кроме редактируемой строки)
    // const nodeList = taskList.querySelectorAll('.task-item:not(.editing)');
    // const items = [...nodeList] 
    function sortTasks() {
    isAscending = !isAscending;
    //  используем обычный массив и цикл
    const allItems = taskList.querySelectorAll('.task-item');
    const items = [];
    let editingRow = null;

    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].classList.contains('editing')) {
            editingRow = allItems[i];
        } else {
        items.push(allItems[i]);
        }
    }

    // Сортируем задачи по тексту
  items.sort(function(a, b) {
    const textA = a.querySelector('.task-text').innerText.toLowerCase();
    const textB = b.querySelector('.task-text').innerText.toLowerCase();
    if (isAscending) {
        if (textA < textB) return -1; 
        if (textA > textB) return 1;  
        return 0;                     
    } else {
        if (textA > textB) return -1; 
        if (textA < textB) return 1;  
        return 0;                     
    }
});

    
// const editingRow = taskList.querySelector('.task-item.editing');        
taskList.innerHTML = ''; 
 if (editingRow) {
     taskList.appendChild(editingRow); // вставляем в конец
 }
 for (let i = 0; i < items.length; i++) {
     taskList.appendChild(items[i]); // остальные задачи после неё
     } updateSortIcon(false);
}

//  "+"  создаёт новый input
    plusBtn.addEventListener('click', (e) => {
    const existing = taskList.querySelector('.task-item.editing');
    if (existing) {
        //  Поле уже существует
        const input = existing.querySelector('.task-input');
        input.focus();
    } else {
        //  Поля нет, создаем новое
        const newRow = createInputRow();
        taskList.prepend(newRow);
        const input = newRow.querySelector('.task-input');
        input.focus();
    }
});


//  ADD сохраняет input 
addBtn.addEventListener('click', () => {
    const editRow = taskList.querySelector('.task-item.editing');
    if (!editRow) return;
    const input = editRow.querySelector('.task-input');
    const val = input.value.trim();
    if (val !== "") {
        editRow.classList.remove('editing');
        editRow.innerHTML = 
            '<span class="task-text">' + val + '</span>' +
            '<div class="action-icons">' +
                '<img src="' + PATHS.editGray + '" class="edit-icon">' +
                '<img src="' + PATHS.deleteGray + '" class="delete-icon">' +
            '</div>';
        makeEvents(editRow);
    }
});

//  (edit, delete, hover)
function makeEvents(row) {
    const editImg = row.querySelector('.edit-icon');
    const deleteImg = row.querySelector('.delete-icon');
    editImg.addEventListener('mouseenter', () => editImg.src = PATHS.editPurple);
    editImg.addEventListener('mouseleave', () => editImg.src = PATHS.editGray);
    deleteImg.addEventListener('mouseenter', () => deleteImg.src = PATHS.deletePurple);
    deleteImg.addEventListener('mouseleave', () => deleteImg.src = PATHS.deleteGray);
    deleteImg.addEventListener('click', () => {
        row.remove(); 
         if (taskList.children.length === 0) {
             taskList.prepend(createInputRow());  
         }
    });

    editImg.addEventListener('click', () => {
        const taskText = row.querySelector('.task-text');
        const currentText = taskText.innerText;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'task-input';
        input.value = currentText;

        const confirmImg = document.createElement('img');
        confirmImg.src = PATHS.addIcon;
         confirmImg.className = 'edit-icon confirm-edit-icon';
        confirmImg.alt = 'confirm';


        // Меняем только иконку Edit на галочку (Delete не трогаем)
        // editImg.replaceWith(confirmImg); нз надо это или нет??

        confirmImg.addEventListener('mouseenter', () => {
            confirmImg.src = PATHS.addPurple;
        });
        confirmImg.addEventListener('mouseleave', () => {
            confirmImg.src = PATHS.addIcon;
        });
// берет текст задачи (taskText.innerText) и 
// создает новый элемент <input>,
//  записывая этот текст туда. 
// Также создается новая кнопка-галочка (confirmImg)
//  вместо карандаша.


        taskText.replaceWith(input); 
        editImg.replaceWith(confirmImg);
        input.focus();
        //на экране текст исчезает, а на его месте появляется
        //  поле, в котором можно печатать.
        //  Карандаш меняется на галочку.

        function confirmEdit() {
            const newVal = input.value.trim(); 
            if (newVal === '') return; 

            const newSpan = document.createElement('span');
            newSpan.className = 'task-text';
            newSpan.innerText = newVal;
            input.replaceWith(newSpan); 
            //поле ввода заменяется обратно на обычный текст.
            const newEditImg = document.createElement('img');
            newEditImg.src = PATHS.editGray;
            newEditImg.className = 'edit-icon';
            newEditImg.alt = 'edit';
            confirmImg.replaceWith(newEditImg); // Возвращаем карандаш вместо +
            makeEvents(row);
        }
        confirmImg.addEventListener('click', confirmEdit);

    });
}

// 7 SORT кнопка
sortBtn.addEventListener('mouseenter', function() {
    updateSortIcon(true);
});
sortBtn.addEventListener('mouseleave', function() {
    updateSortIcon(false);
});
sortBtn.addEventListener('click', function() {
    sortTasks();
});

//  при загрузке страницы создаём input
window.onload = () => {
    taskList.prepend(createInputRow());
};