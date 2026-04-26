const plusBtn = document.getElementById('plus-btn');
const taskList = document.getElementById('task-list');
const addBtn = document.getElementById('add-task-btn');
const sortBtn = document.getElementById('sort-btn');
const sortIcon = document.getElementById('sort-icon');


// 1 Объект с путями к картинкам (иконки)
const PATHS = {
    editGray: 'pic/edit-gray.png',
    editPurple: 'pic/edit-purple.png',
    deleteGray: 'pic/delete-gray.png',
    deletePurple: 'pic/delete-purple.png',
    plusGray: 'pic/plus-gray.png',
    plusPurple: 'pic/plus-purple.png',
    sortDownGray: 'pic/down-gray.png',
    sortDown: 'pic/down.png',
    sortUpGray: 'pic/up-gray.png',
    sortUp: 'pic/up.png',
    addIcon: 'pic/add.png',
    addPurple: 'pic/add-violet1.png'
};


//  ФУНКЦИЯ: создаёт строку с input (поле ввода)
function createInputRow(value = "") {

    const li = document.createElement('li'); 
    // createElement → создаёт новый HTML элемент

    li.className = 'task-item editing'; 
    // className → задаём класс элементу
      li.innerHTML = `
        <input type="text" class="task-input" value="${value}">
        <div class="action-icons">
            <img src="${PATHS.deleteGray}" class="delete-icon" alt="delete">
        </div>
    `;        
    // innerHTML → вставляет HTML внутрь элемента

    const input = li.querySelector('.task-input'); 
    // querySelector → ищет ПЕРВЫЙ элемент внутри li

    const deleteImg = li.querySelector('.delete-icon');

        // Кнопка удаления
    deleteImg.addEventListener('click', () => {
        input.value = ''; 
        // value → получить/изменить текст в input
        input.focus(); 
        // focus → ставит курсор в input
    });

    deleteImg.addEventListener('mouseenter', () => { 
        deleteImg.src = PATHS.deletePurple; 
        // меняем картинку при наведении
    });

    deleteImg.addEventListener('mouseleave', () => { 
        deleteImg.src = PATHS.deleteGray; 
    });

    return li; 
    // return → возвращает созданный элемент
}


//  переменная направления сортировки
let isAscending = true;


// 2 обновляет иконку сортировки
function updateSortIcon(isHover) {
    if (isAscending) { // если текущий порядок сортировки — по возрастанию
        if (isHover) {  // если мышь наведена на кнопку
            sortIcon.src = PATHS.sortDown; // ставим цветную стрелку вниз
        } else {        // если мышь НЕ наведена
            sortIcon.src = PATHS.sortDownGray; // ставим серую стрелку вниз
        }
    } else {            // если текущий порядок сортировки — по убыванию
        if (isHover) {  // если мышь наведена
            sortIcon.src = PATHS.sortUp; // ставим цветную стрелку вверх
        } else {        // если мышь НЕ наведена
            sortIcon.src = PATHS.sortUpGray; // ставим серую стрелку вверх
        }
    }
} 

// 3 ФУНКЦИЯ: сортирует задачи
function sortTasks() {
    // Переключаем направление сортировки
    isAscending = !isAscending;

    // Находим все завершённые задачи (кроме редактируемой строки)
    const nodeList = taskList.querySelectorAll('.task-item:not(.editing)');
    const items = [...nodeList] // Превращаем NodeList в массив, чтобы можно было сортировать

    // Сортируем задачи по тексту
  items.sort(function(a, b) {
    var textA = a.querySelector('.task-text').innerText.toLowerCase();
    var textB = b.querySelector('.task-text').innerText.toLowerCase();

    if (isAscending) {
        if (textA < textB) return -1; // textA идёт перед textB
        if (textA > textB) return 1;  // textA идёт после textB
        return 0;                     // они равны
    } else {
        if (textA > textB) return -1; // по убыванию: textA идёт раньше textB
        if (textA < textB) return 1;  // textA идёт после textB
        return 0;                     // они равны
    }
});

    // Находим строку ввода, если она есть
const editingRow = taskList.querySelector('.task-item.editing');

taskList.innerHTML = ''; // очищаем список

if (editingRow) {
    taskList.prependChild(editingRow);
}

for (let i = 0; i < items.length; i++) {
    taskList.appendChild(items[i]);
}
    // Обновляем иконку сортировки
    updateSortIcon(true);
}

// if (editingRow) {
//     taskList.appendChild(editingRow); // вставляем в конец
// }
// for (let i = 0; i < items.length; i++) {
//     taskList.appendChild(items[i]); // остальные задачи после неё
// }



// 4 ФУНКЦИЯ: добавляет события (edit, delete, hover)
function attachRowEvents(row) {

    const editImg = row.querySelector('.edit-icon');
    const deleteImg = row.querySelector('.delete-icon');

    editImg.addEventListener('mouseenter', () => editImg.src = PATHS.editPurple);
    editImg.addEventListener('mouseleave', () => editImg.src = PATHS.editGray);

    deleteImg.addEventListener('mouseenter', () => deleteImg.src = PATHS.deletePurple);
    deleteImg.addEventListener('mouseleave', () => deleteImg.src = PATHS.deleteGray);

    deleteImg.addEventListener('click', () => {
        row.remove(); 
        // remove → удаляет элемент

        if (taskList.children.length === 0) {
            taskList.prepend(createInputRow()); 
            // prepend → добавляет элемент В НАЧАЛО .Если список стал пустым
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
        // replaceWith → заменяет элемент
        editImg.replaceWith(confirmImg);
        input.focus();
        //на экране текст исчезает, а на его месте появляется
        //  поле, в котором можно печатать.
        //  Карандаш меняется на галочку.

        function confirmEdit() {
            const newVal = input.value.trim(); 
            // trim → убирает пробелы

            if (newVal === '') return; //нельзя сохранить пустую задачу.

            const newSpan = document.createElement('span');
            newSpan.className = 'task-text';
            newSpan.innerText = newVal;

            input.replaceWith(newSpan); 
            //поле ввода заменяется обратно на обычный текст.

            const newEditImg = document.createElement('img');
            newEditImg.src = PATHS.editGray;

            newEditImg.className = 'edit-icon';
            newEditImg.alt = 'edit';

            confirmImg.replaceWith(newEditImg);
            attachRowEvents(row);
        }
        confirmImg.addEventListener('click', confirmEdit);

    });
}


// 5 КНОПКА "+" → создаёт новый input
plusBtn.addEventListener('click', (e) => {

        if (e.target.id === 'plus-btn') {
        return;}
    // e.stopPropagation(); 
    // stopPropagation → останавливает всплытие события

    const existing = taskList.querySelector('.task-item.editing');

   if (existing) {
        //  Поле уже существует
        const input = existing.querySelector('.task-input');
        input.focus();
    } else {
        //  Поля нет, создаем новое
        const newRow = createInputRow();
        taskList.prepend(newRow);}

    const input = newRow.querySelector('.task-input');
    input.focus();
});


// 6 КНОПКА ADD → сохраняет input → делает задачу
addBtn.addEventListener('click', () => {

    const currentInputRow = taskList.querySelector('.task-item.editing');
    if (!currentInputRow) return;

    const input = currentInputRow.querySelector('.task-input');
    const val = input.value.trim();

    if (val === '') return;

    currentInputRow.classList.remove('editing'); 
    // classList.remove → убирает класс

    currentInputRow.innerHTML = `
        <span class="task-text">${val}</span>
        <div class="action-icons">
            <img src="${PATHS.editGray}" class="edit-icon">
            <img src="${PATHS.deleteGray}" class="delete-icon">
        </div>
    `;
    attachRowEvents(currentInputRow);
});


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