const cards = document.querySelectorAll('.card');
const columns = document.querySelectorAll('.column');

cards.forEach(card => {
    card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', JSON.stringify({id: card.dataset.id, status: card.dataset.status}));
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', e => card.classList.remove('dragging'));
});

columns.forEach(col => {
    col.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(col, e.clientY);
        const line = col.querySelector('.insert-line');
        if (afterElement == null) {
            col.appendChild(line || createInsertLine());
        } else {
            col.insertBefore(line || createInsertLine(), afterElement);
        }
        col.classList.add('dragover');
    });
    col.addEventListener('dragleave', e => col.classList.remove('dragover'));
    col.addEventListener('drop', e => {
        e.preventDefault();
        col.classList.remove('dragover');
        const line = col.querySelector('.insert-line');
        if (line) line.remove();

        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const draggedCard = document.querySelector(`[data-id="${data.id}"]`);
        draggedCard.dataset.status = col.dataset.status;

        const afterElement = getDragAfterElement(col, e.clientY);
        if (afterElement == null) {
            col.appendChild(draggedCard);
        } else {
            col.insertBefore(draggedCard, afterElement);
        }
    });
});

function createInsertLine() {
    const line = document.createElement('div');
    line.className = 'insert-line';
    return line;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
