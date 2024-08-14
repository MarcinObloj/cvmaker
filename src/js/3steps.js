document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.querySelector('.close-btn');
    const openBtn = document.querySelector('.open-btn');
    const overlay = document.querySelector('.overlay');
    const cvTitle = document.querySelector('.cv-title');
    const infoCircle = document.querySelector('.fa-circle-info');
    let input;

    const handleOverlay = () => {
        overlay.classList.add('overlay-active');
    };

    const closeOverlay = () => {
        overlay.classList.remove('overlay-active');
    };

    if (cvTitle && infoCircle) {
        infoCircle.addEventListener('click', function () {
            const currentText = cvTitle.textContent;
            input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'cv-title-input';

            input.addEventListener('blur', function () {
                cvTitle.textContent = this.value;
                cvTitle.style.display = 'block';
                input.remove();
            });

            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    cvTitle.textContent = this.value;
                    cvTitle.style.display = 'block';
                    input.remove();
                }
            });

            cvTitle.style.display = 'none';
            cvTitle.parentElement.insertBefore(input, cvTitle);
            input.focus();
        });
    }

    if (openBtn) {
        openBtn.addEventListener('click', handleOverlay);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
    }
});
document.addEventListener('DOMContentLoaded', function() {

    const textAreaContainers = document.querySelectorAll('.text-area-box');

    function formatText(textarea, tag) {
        const startTag = `<${tag}>`;
        const endTag = `</${tag}>`;
        const text = textarea.value;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        const beforeText = text.substring(0, startPos);
        const selectedText = text.substring(startPos, endPos);
        const afterText = text.substring(endPos);

        const newText = beforeText + startTag + selectedText + endTag + afterText;
        textarea.value = newText;
    }

    function formatList(textarea, isOrdered) {
        const startTag = isOrdered ? '<ol><li>' : '<ul><li>';
        const endTag = isOrdered ? '</li></ol>' : '</li></ul>';
        const text = textarea.value;
        const startPos = textarea.selectionStart;
        const endPos = textarea.selectionEnd;

        const beforeText = text.substring(0, startPos);
        const selectedText = text.substring(startPos, endPos);
        const afterText = text.substring(endPos);

        const newText = beforeText + startTag + selectedText + endTag + afterText;
        textarea.value = newText;
    }

    
    textAreaContainers.forEach(container => {
        const textarea = container.querySelector('textarea');
        const btnBold = container.querySelector('.btn-bold');
        const btnStrikeThrough = container.querySelector('.btn-strike-through');
        const btnUnderline = container.querySelector('.btn-underline');
        const btnItalic = container.querySelector('.btn-italic');
        const btnList = container.querySelector('.btn-list');
        const btnOrderedList = container.querySelector('.btn-ordered-list');

        // Dodaj event listenery do przycisków
        btnBold.addEventListener('click', () => formatText(textarea, 'b'));
        btnStrikeThrough.addEventListener('click', () => formatText(textarea, 's'));
        btnUnderline.addEventListener('click', () => formatText(textarea, 'u'));
        btnItalic.addEventListener('click', () => formatText(textarea, 'i'));
        btnList.addEventListener('click', () => formatList(textarea, true)); // Ordered list
        btnOrderedList.addEventListener('click', () => formatList(textarea, false)); // Unordered list
    });
});
