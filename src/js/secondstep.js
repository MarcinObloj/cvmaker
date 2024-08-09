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
document
	.querySelector('.btn-bold')
	.addEventListener('click', () => insertTag('<b></b>'));
document
	.querySelector('.btn-strike-through')
	.addEventListener('click', () => insertTag('<s></s>'));
document
	.querySelector('.btn-underline')
	.addEventListener('click', () => insertTag('<u></u>'));
document
	.querySelector('.btn-list')
	.addEventListener('click', () => insertTag('<ul><li></li></ul>'));
document
	.querySelector('.btn-ordered-list')
	.addEventListener('click', () => insertTag('<ol><li></li></ol>'));

// Handle image upload
let uploadedPhoto = null; // Zmienna do przechowywania pliku zdjęcia
document
	.getElementById('photo-upload')
	.addEventListener('change', function (event) {
		const file = event.target.files[0];
		if (file) {
			uploadedPhoto = file; // Przechowaj przesłane zdjęcie
			const reader = new FileReader();
			reader.onload = function (e) {
				const previewPhoto = document.getElementById('preview-photo');
				previewPhoto.innerHTML = `<img src="${e.target.result}" alt="Photo" style="max-width: 150px; max-height: 150px; margin-bottom: 20px; border-radius: 50%; overflow: hidden;">`;
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

    document.getElementById('save-cv').addEventListener('click', function (event) {
        event.preventDefault();

        console.log('Kliknięcie zarejestrowane!');

        const cvContent = document.getElementById('cv-preview').outerHTML;
        console.log('Pobrany HTML:', cvContent);

        const formData = new FormData();
        formData.append('cvContent', new Blob([cvContent], { type: 'text/html' }));
        formData.append('userId', sessionStorage.getItem('userId')); // Używaj `getItem` do pobrania wartości

        if (uploadedPhoto) {
            formData.append('photo', uploadedPhoto); // Dodanie przesłanego zdjęcia do FormData
        }

        console.log('Rozpoczynanie fetch...');

        fetch('http://localhost:8080/api/cvfile/uploadPdf', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                console.log('Fetch zakończony. Status odpowiedzi:', response.status);

                if (!response.ok) {
                    console.error('Fetch error:', response);
                    return response.text().then((errorText) => {
                        throw new Error(errorText);
                    });
                }

                return response.text(); // Pobierz odpowiedź jako tekst
            })
            .then((text) => {
                console.log('Odpowiedź serwera:', text);

                // Parsowanie odpowiedzi jako JSON, jeśli odpowiedź jest w formacie JSON
                try {
                    const data = JSON.parse(text);

                    // Sprawdź, czy odpowiedź zawiera `cvFileId` i zapisz do `sessionStorage`
                    if (data.cvFileId) {
                        sessionStorage.setItem('cvFileId', data.cvFileId);
                        console.log('cvFileId zapisany w sessionStorage:', data.cvFileId);
                    }
                } catch (e) {
                    console.error('Błąd parsowania odpowiedzi:', e);
                }

                alert('CV saved successfully!');
                // Po zapisaniu CV na serwerze, przekierowanie do trzeciego kroku
                window.location.href = 'thirdstep.html';
            })
            .catch((error) => {
                console.error('Błąd podczas przetwarzania odpowiedzi:', error);
                alert('Wystąpił błąd podczas zapisywania CV: ' + error.message);
            });
    });
});

function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
