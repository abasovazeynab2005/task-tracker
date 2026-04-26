// Те же переменные, тут всё понятно
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
    sortDownGray: './Pic/down-gray.png',
    sortDown: './Pic/down.png',
    sortUpGray: './Pic/up-gray.png',
    sortUp: './Pic/up.png',
    addIcon: './Pic/add.png',
    addPurple: './Pic/add-violet.png'
};

let isAscending = true;

// 1. Создание строки ввода (максимально просто через строки)
function createInputRow(value = "") {
    const li = document.createElement('li');
    li.className = 'task-item editing';
    
    // Используем обычную склейку строк через "+"
    li.innerHTML = 
        '<input type="text" class="task-input" value="' + value + '">' +
        '<div class="action-icons">' +
            '<img src="' + PATHS.deleteGray + '" class="delete-icon">' +
        '</div>';

    const input = li.querySelector('.task-input');
    const deleteImg = li.querySelector('.delete-icon');

    deleteImg.onclick = function() {
        input.value = "";
        input.focus();
    };

    // Простые функции для наведения
    deleteImg.onmouseenter = function() { deleteImg.src = PATHS.deletePurple; };
    deleteImg.onmouseleave = function() { deleteImg.src = PATHS.deleteGray; };

    return li;
}

// 2. Сортировка (через классический цикл и if-else)
function sortTasks() {
    isAscending = !isAscending;

    // Вместо [...nodeList] используем обычный массив и цикл
    const allItems = taskList.querySelectorAll('.task-item');
    const tasksArray = [];
    let editingRow = null;

    for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].classList.contains('editing')) {
            editingRow = allItems[i];
        } else {
            tasksArray.push(allItems[i]);
        }
    }

    // Понятный способ сортировки
    tasksArray.sort(function(a, b) {
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

    // Полная очистка и пересборка списка
    taskList.innerHTML = "";

    // Сначала возвращаем инпут (если он был)
    if (editingRow !== null) {
        taskList.appendChild(editingRow);
    }

    // Затем добавляем отсортированные задачи
    for (let j = 0; j < tasksArray.length; j++) {
        taskList.appendChild(tasksArray[j]);
    }

    updateSortIcon(false);
}

// 3. Обновление иконки (через простые IF)
function updateSortIcon(isHover) {
    if (isAscending === true) {
        if (isHover === true) {
            sortIcon.src = PATHS.sortDown;
        } else {
            sortIcon.src = PATHS.sortDownGray;
        }
    } else {
        if (isHover === true) {
            sortIcon.src = PATHS.sortUp;
        } else {
            sortIcon.src = PATHS.sortUpGray;
        }
    }
}

// 4. События кнопок задач (через старый добрыйappendChild/removeChild)
function attachRowEvents(row) {
    const editImg = row.querySelector('.edit-icon');
    const deleteImg = row.querySelector('.delete-icon');

    // Наведение
    editImg.onmouseenter = function() { editImg.src = PATHS.editPurple; };
    editImg.onmouseleave = function() { editImg.src = PATHS.editGray; };
    deleteImg.onmouseenter = function() { deleteImg.src = PATHS.deletePurple; };
    deleteImg.onmouseleave = function() { deleteImg.src = PATHS.deleteGray; };

    // Удаление строки
    deleteImg.onclick = function() {
        taskList.removeChild(row);
        if (taskList.children.length === 0) {
            taskList.appendChild(createInputRow());
        }
    };

    // Редактирование (без replaceWith, через замену содержимого)
    editImg.onclick = function() {
        const taskText = row.querySelector('.task-text');
        const oldText = taskText.innerText;
        
        // Просто меняем HTML всей строки обратно на инпут
        row.innerHTML = 
            '<input type="text" class="task-input" value="' + oldText + '">' +
            '<div class="action-icons">' +
                '<img src="' + PATHS.addIcon + '" class="confirm-icon">' +
            '</div>';
        
        row.classList.add('editing');
        const input = row.querySelector('.task-input');
        const confirmBtn = row.querySelector('.confirm-icon');
        
        input.focus();

        confirmBtn.onclick = function() {
            const newVal = input.value.trim();
            if (newVal === "") return;

            row.classList.remove('editing');
            row.innerHTML = 
                '<span class="task-text">' + newVal + '</span>' +
                '<div class="action-icons">' +
                    '<img src="' + PATHS.editGray + '" class="edit-icon">' +
                    '<img src="' + PATHS.deleteGray + '" class="delete-icon">' +
                '</div>';
            
            attachRowEvents(row); // Перевешиваем события на новые элементы
        };
    };
}

// 5. Глобальные кнопки
plusBtn.onclick = function() {
    const existing = taskList.querySelector('.task-item.editing');
    if (existing) {
        existing.querySelector('.task-input').focus();
    } else {
        const newRow = createInputRow();
        taskList.prepend(newRow);
        newRow.querySelector('.task-input').focus();
    }
};

addBtn.onclick = function() {
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
        attachRowEvents(editRow);
    }
};

sortBtn.onclick = function() { sortTasks(); };
sortBtn.onmouseenter = function() { updateSortIcon(true); };
sortBtn.onmouseleave = function() { updateSortIcon(false); };

window.onload = function() {
    taskList.appendChild(createInputRow());
};