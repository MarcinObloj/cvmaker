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
// document.addEventListener('DOMContentLoaded', () => {
// 	document
// 		.getElementById('save-cv')
// 		.addEventListener('click', function (event) {
// 			event.preventDefault();

// 			console.log('Kliknięcie zarejestrowane!');

// 			const cvContent = document.getElementById('cv-preview').outerHTML;
// 			console.log('Pobrany HTML:', cvContent);

// 			const formData = new FormData();
// 			formData.append(
// 				'cvContent',
// 				new Blob([cvContent], { type: 'text/html' })
// 			);
// 			formData.append('userId', sessionStorage.getItem('userId')); // Używaj `getItem` do pobrania wartości

// 			if (uploadedPhoto) {
// 				formData.append('photo', uploadedPhoto); // Dodanie przesłanego zdjęcia do FormData
// 			}

// 			console.log('Rozpoczynanie fetch...');

// 			fetch('http://localhost:8080/api/cvfile/uploadPdf', {
// 				method: 'POST',
// 				body: formData,
// 			})
// 				.then((response) => {
// 					console.log('Fetch zakończony. Status odpowiedzi:', response.status);

// 					if (!response.ok) {
// 						console.error('Fetch error:', response);
// 						return response.text().then((errorText) => {
// 							throw new Error(errorText);
// 						});
// 					}

// 					return response.text(); // Pobierz odpowiedź jako tekst
// 				})
// 				.then((text) => {
// 					console.log('Odpowiedź serwera:', text);

// 					// Parsowanie odpowiedzi jako JSON, jeśli odpowiedź jest w formacie JSON
// 					try {
// 						const data = JSON.parse(text);

// 						// Sprawdź, czy odpowiedź zawiera `cvFileId` i zapisz do `sessionStorage`
// 						if (data.cvFileId) {
// 							sessionStorage.setItem('cvFileId', data.cvFileId);
// 							console.log('cvFileId zapisany w sessionStorage:', data.cvFileId);
// 						}
// 					} catch (e) {
// 						console.error('Błąd parsowania odpowiedzi:', e);
// 					}

// 					alert('CV saved successfully!');
// 					// Po zapisaniu CV na serwerze, przekierowanie do trzeciego kroku
// 					window.location.href = 'thirdstep.html';
// 				})
// 				.catch((error) => {
// 					console.error('Błąd podczas przetwarzania odpowiedzi:', error);
// 					alert('Wystąpił błąd podczas zapisywania CV: ' + error.message);
// 				});
// 		});
// });

function getParameterByName(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}
document.addEventListener('DOMContentLoaded', function () {
	// Odczytaj wybrany szablon z localStorage
	const selectedTemplate = localStorage.getItem('selectTemplate');

	// Załaduj odpowiedni plik CSS lub dodaj odpowiednią klasę do elementu .cv-preview
	if (selectedTemplate) {
		const cvPreviewElement = document.querySelector('.cv-preview');

		switch (selectedTemplate) {
			case 'cv-classic':
				cvPreviewElement.classList.add('cv-classic-style');

				// Znajdź istniejące elementy
				const firstName = document.getElementById('preview-first-name');
				const lastName = document.getElementById('preview-last-name');
				const jobTitle = document.getElementById('preview-job-title');

				// Tworzenie personal-info-boxes i przeniesienie do niego elementów
				const personalInfoBoxes = document.createElement('div');
				personalInfoBoxes.classList.add('personal-info-boxes');

				if (jobTitle && firstName && lastName) {
					// Przenoszenie elementów do personal-info-boxes
					personalInfoBoxes.appendChild(jobTitle);
					personalInfoBoxes.appendChild(firstName);
					personalInfoBoxes.appendChild(lastName);

					// Dodanie personal-info-boxes na górze cv-preview
					cvPreviewElement.prepend(personalInfoBoxes);
				}

				// Tworzenie personal-data-box
				const personalDataBox = document.createElement('div');
				personalDataBox.classList.add('personal-data-boxes');

				// Definicje sekcji z ikonami Font Awesome (bez imienia i nazwiska)
				const sections = [
					{ id: 'preview-email', icon: 'fa-envelope' },
					{ id: 'preview-phone', icon: 'fa-phone' },
					{ id: 'preview-city', icon: 'fa-city' },
					{ id: 'preview-postal-code', icon: 'fa-map-marker-alt' },
				];

				// Dodawanie sekcji do personalDataBox
				sections.forEach((section) => {
					const sectionElement = document.getElementById(section.id);
					if (sectionElement) {
						const iconElement = document.createElement('i');
						iconElement.classList.add('fa', section.icon);
						sectionElement.classList.add('personal-data-box');
						sectionElement.prepend(iconElement);
						personalDataBox.appendChild(sectionElement);
					}
				});

				// Umieszczenie personal-data-box za sekcją preview-summary
				const previewSummary = document.getElementById('preview-summary');
				if (previewSummary) {
					previewSummary.insertAdjacentElement('afterend', personalDataBox);
				}

				// Tworzenie main-box i przeniesienie do niego main-box-left i main-box-right
				const mainBox = document.createElement('div');
				mainBox.classList.add('main-box');

				// Tworzenie main-box-left i przeniesienie odpowiednich sekcji
				const mainBoxLeft = document.createElement('div');
				mainBoxLeft.classList.add('main-box-left');

				const sectionsLeft = [
					'preview-summary',
					'preview-education',
					'preview-skills',
					'preview-courses',
				];

				sectionsLeft.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxLeft.appendChild(sectionElement);
					}
				});

				// Dodanie main-box-left do main-box
				mainBox.appendChild(mainBoxLeft);

				// Tworzenie main-box-right i przeniesienie odpowiednich sekcji
				const mainBoxRight = document.createElement('div');
				mainBoxRight.classList.add('main-box-right');

				const sectionsRight = ['preview-languages', 'preview-hobbies'];

				sectionsRight.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxRight.appendChild(sectionElement);
					}
				});

				// Dodanie main-box-right do main-box
				mainBox.appendChild(mainBoxRight);

				// Dodanie main-box do cv-preview
				cvPreviewElement.appendChild(mainBox);

				break;
			case 'cv-modern':
				cvPreviewElement.classList.add('cv-modern-style');

				// Dodaj sekcję na zdjęcia
				const photosSection = document.createElement('div');
				photosSection.classList.add('photos-section');

				// Utwórz cztery elementy img dla zdjęć
				for (let i = 1; i <= 4; i++) {
					const photo = document.createElement('img');
					photo.src = `./dist/img/${i}.png`; // Ustaw ścieżkę do zdjęć
					photo.classList.add(`photo-${i}`);
					photo.classList.add(`photo`);
					photo.alt = `Zdjęcie ${i}`; // Dodaj tekst alternatywny
					photosSection.appendChild(photo);
				}

				// Dodaj sekcję zdjęć do cv-preview
				cvPreviewElement.prepend(photosSection);

				// Dodaj inne sekcje dla cv-modern
				const personalInfoBoxesModern = document.createElement('div');
				personalInfoBoxesModern.classList.add('personal-info-boxes-modern');

				const firstNameModern = document.getElementById('preview-first-name');
				const lastNameModern = document.getElementById('preview-last-name');
				const jobTitleModern = document.getElementById('preview-job-title');

				if (jobTitleModern && firstNameModern && lastNameModern) {
					personalInfoBoxesModern.appendChild(jobTitleModern);
					personalInfoBoxesModern.appendChild(firstNameModern);
					personalInfoBoxesModern.appendChild(lastNameModern);

					cvPreviewElement.prepend(personalInfoBoxesModern);
				}

				// Tworzenie personal-data-box dla modern
				const personalDataBoxModern = document.createElement('div');
				personalDataBoxModern.classList.add('personal-data-boxes-modern');

				const sectionsModern = [
					{ id: 'preview-email', icon: 'fa-envelope' },
					{ id: 'preview-phone', icon: 'fa-phone' },
					{ id: 'preview-city', icon: 'fa-city' },
					{ id: 'preview-postal-code', icon: 'fa-map-marker-alt' },
				];

				sectionsModern.forEach((section) => {
					const sectionElement = document.getElementById(section.id);
					if (sectionElement) {
						const iconElement = document.createElement('i');
						iconElement.classList.add('fa', section.icon);
						sectionElement.classList.add('personal-data-box-modern');
						sectionElement.prepend(iconElement);
						personalDataBoxModern.appendChild(sectionElement);
					}
				});

				const previewSummaryModern = document.getElementById('preview-summary');
				if (previewSummaryModern) {
					previewSummaryModern.insertAdjacentElement(
						'afterend',
						personalDataBoxModern
					);
				}

				const mainBoxModern = document.createElement('div');
				mainBoxModern.classList.add('main-box-modern');

				const mainBoxLeftModern = document.createElement('div');
				mainBoxLeftModern.classList.add('main-box-left-modern');

				const sectionsLeftModern = [
					'preview-summary',
					'preview-education',
					'preview-skills',
					'preview-courses',
				];

				sectionsLeftModern.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxLeftModern.appendChild(sectionElement);
					}
				});

				mainBoxModern.appendChild(mainBoxLeftModern);

				const mainBoxRightModern = document.createElement('div');
				mainBoxRightModern.classList.add('main-box-right-modern');

				const sectionsRightModern = ['preview-languages', 'preview-hobbies'];

				sectionsRightModern.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxRightModern.appendChild(sectionElement);
					}
				});

				mainBoxModern.appendChild(mainBoxRightModern);

				cvPreviewElement.appendChild(mainBoxModern);

				break;
		}
	}
});
