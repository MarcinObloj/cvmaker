  // Function to update the CV preview in real-time
  function updatePreview(event) {
    const inputId = event.target.id;
    const inputValue = event.target.value;
    const previewElement = document.getElementById('preview-' + inputId);

    if (previewElement) {
        previewElement.querySelector('p').innerHTML = inputValue;
    }
}

// Function to insert HTML tags at the cursor position in the textarea
function insertTag(tag) {
    const textarea = document.querySelector('textarea:focus');
    if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        textarea.value = before + tag + after;
        textarea.selectionStart = textarea.selectionEnd = start + tag.length / 2;
        textarea.focus();
        updatePreview({ target: textarea }); // Update preview after inserting tag
    }
}

// Attach event listeners to all input and textarea elements
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach((input) => {
    input.addEventListener('input', updatePreview);
});

// Attach event listeners to formatting buttons
document.querySelector('.btn-bold').addEventListener('click', () => insertTag('<b></b>'));
document.querySelector('.btn-strike-through').addEventListener('click', () => insertTag('<s></s>'));
document.querySelector('.btn-underline').addEventListener('click', () => insertTag('<u></u>'));
document.querySelector('.btn-list').addEventListener('click', () => insertTag('<ul><li></li></ul>'));
document.querySelector('.btn-ordered-list').addEventListener('click', () => insertTag('<ol><li></li></ol>'));

// Handle image upload
document.getElementById('photo-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const previewPhoto = document.getElementById('preview-photo');
            previewPhoto.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
        };
        reader.readAsDataURL(file);
    }
});

// On document load, handle image URL for background
document.addEventListener('DOMContentLoaded', () => {
    const imageUrl = getParameterByName('image');
    if (imageUrl) {
        const cvPreviewElement = document.getElementById('cv-preview');
        if (cvPreviewElement) {
            cvPreviewElement.style.backgroundImage = `url(${decodeURIComponent(imageUrl)})`;
            cvPreviewElement.style.backgroundSize = 'cover';
            cvPreviewElement.style.backgroundPosition = 'center';
        } else {
            console.error('Element o ID "cv-preview" nie został znaleziony.');
        }
    } else {
        console.error('Parametr "image" nie został znaleziony w URL.');
    }

    document.getElementById('save-cv').addEventListener('click', function () {
        const cvPreviewHtml = document.getElementById('cv-preview').outerHTML;
        localStorage.setItem('cvPreviewHtml', cvPreviewHtml);
        window.location.href = 'thirdstep.html';
    });
});

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}