function updatePreview(event) {
	const inputId = event.target.id;
	const inputValue = event.target.value;
	const previewElement = document.getElementById('preview-' + inputId);

	if (previewElement) {
		previewElement.querySelector('p').innerHTML = inputValue;
	}
}

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

const inputs = document.querySelectorAll('input, textarea');
inputs.forEach((input) => {
	input.addEventListener('input', updatePreview);
});

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

let uploadedPhoto = null;
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

document.addEventListener('DOMContentLoaded', () => {
	document
		.getElementById('save-cv')
		.addEventListener('click', async function (event) {
			event.preventDefault();

			const cvElement = document.getElementById('cv-preview');
			const { jsPDF } = window.jspdf;

			const container = document.createElement('div');
			container.style.position = 'absolute';
			container.style.left = '-9999px';

			const cvElementStyles = window.getComputedStyle(cvElement);
			container.style.width = '210mm';
			container.style.minHeight = '297mm';
			container.style.zoom = 1;

			const clonedElement = cvElement.cloneNode(true);
			clonedElement.style.width = '210mm';
			clonedElement.style.minHeight = '297mm';
			container.appendChild(clonedElement);
			document.body.appendChild(container);

			const canvas = await html2canvas(container, {
				scale: 2,
				useCORS: true,
				logging: false,
				letterSpacing: 1,
				scrollY: 0,
			});

			document.body.removeChild(container);

			const pdf = new jsPDF('portrait', 'mm', 'a4');
			const imgData = canvas.toDataURL('image/jpeg');
			const imgWidth = 210;
			const pageHeight = 297;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			let position = 0;
			let remainingHeight = imgHeight;

			while (remainingHeight > 0) {
				pdf.addImage(
					imgData,
					'JPEG',
					0,
					position,
					imgWidth,
					Math.min(pageHeight, remainingHeight)
				);
				remainingHeight -= pageHeight;

				if (remainingHeight > 0) {
					pdf.addPage();
					position = Math.min(0, remainingHeight - pageHeight);
				}
			}

			const pdfBlob = pdf.output('blob');

			try {
				const formData = new FormData();
				formData.append('cvFile', pdfBlob, 'cv.pdf');
				formData.append('userId', sessionStorage.getItem('userId'));

				const response = await fetch(
					'http://localhost:8080/api/cvfile/uploadPdf',
					{
						method: 'POST',
						body: formData,
					}
				);

				if (response.ok) {
					const data = await response.json();
					if (data.cvFileId) {
						sessionStorage.setItem('cvFileId', data.cvFileId);
					}
					alert('CV saved successfully!');
					window.location.href = 'thirdstep.html';
				} else {
					throw new Error('Network response was not ok.');
				}
			} catch (error) {
				console.error('Błąd podczas przesyłania PDF:', error);
				alert('Wystąpił błąd podczas zapisywania CV: ' + error.message);
			}
		});
});

function getParameterByName(name) {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(name);
}
document.addEventListener('DOMContentLoaded', function () {
	const selectedTemplate = localStorage.getItem('selectTemplate');

	if (selectedTemplate) {
		const cvPreviewElement = document.querySelector('.cv-preview');

		switch (selectedTemplate) {
			case 'cv-classic':
				cvPreviewElement.classList.add('cv-classic-style');

				// Znajdź istniejące elementy
				const firstName = document.getElementById('preview-first-name');
				const lastName = document.getElementById('preview-last-name');
				const jobTitle = document.getElementById('preview-job-title');

				const personalInfoBoxes = document.createElement('div');
				personalInfoBoxes.classList.add('personal-info-boxes');

				if (jobTitle && firstName && lastName) {
					personalInfoBoxes.appendChild(jobTitle);
					personalInfoBoxes.appendChild(firstName);
					personalInfoBoxes.appendChild(lastName);

					cvPreviewElement.prepend(personalInfoBoxes);
				}

				const personalDataBox = document.createElement('div');
				personalDataBox.classList.add('personal-data-boxes');

				const sections = [
					{ id: 'preview-email', icon: 'fa-envelope' },
					{ id: 'preview-phone', icon: 'fa-phone' },
					{ id: 'preview-city', icon: 'fa-city' },
					{ id: 'preview-postal-code', icon: 'fa-map-marker-alt' },
				];

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

				const previewSummary = document.getElementById('preview-summary');
				if (previewSummary) {
					previewSummary.insertAdjacentElement('afterend', personalDataBox);
				}

				const mainBox = document.createElement('div');
				mainBox.classList.add('main-box');

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

				const mainBoxRight = document.createElement('div');
				mainBoxRight.classList.add('main-box-right');

				const sectionsRight = ['preview-languages', 'preview-hobbies'];

				sectionsRight.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxRight.appendChild(sectionElement);
					}
				});

				mainBox.appendChild(mainBoxRight);

				cvPreviewElement.appendChild(mainBox);

				break;
			case 'cv-modern':
				cvPreviewElement.classList.add('cv-modern-style');

				const photosSection = document.createElement('div');
				photosSection.classList.add('photos-section');

				for (let i = 1; i <= 4; i++) {
					const photo = document.createElement('img');
					photo.src = `./dist/img/${i}.png`;
					photo.classList.add(`photo-${i}`);
					photo.classList.add(`photo`);
					photo.alt = `Zdjęcie ${i}`;
					photosSection.appendChild(photo);
				}

				cvPreviewElement.prepend(photosSection);

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
			case 'cv-creative':
				cvPreviewElement.classList.add('cv-creative-style');

				const personalInfoCreative = document.createElement('div');
				personalInfoCreative.classList.add('personal-info-creative');

				const firstNameCreative = document.getElementById('preview-first-name');
				const lastNameCreative = document.getElementById('preview-last-name');
				const jobTitleCreative = document.getElementById('preview-job-title');

				if (jobTitleCreative && firstNameCreative && lastNameCreative) {
					personalInfoCreative.appendChild(jobTitleCreative);
					personalInfoCreative.appendChild(firstNameCreative);
					personalInfoCreative.appendChild(lastNameCreative);
				}

				const personalDataBoxCreative = document.createElement('div');
				personalDataBoxCreative.classList.add('personal-data-box-creative');

				const sectionsCreative = [
					{ id: 'preview-email', icon: 'fa-envelope' },
					{ id: 'preview-phone', icon: 'fa-phone' },
					{ id: 'preview-city', icon: 'fa-city' },
					{ id: 'preview-postal-code', icon: 'fa-map-marker-alt' },
				];

				sectionsCreative.forEach((section) => {
					const sectionElement = document.getElementById(section.id);
					if (sectionElement) {
						const iconElement = document.createElement('i');
						iconElement.classList.add('fa', section.icon);
						sectionElement.classList.add('personal-data-box-creative-item');
						sectionElement.prepend(iconElement);
						personalDataBoxCreative.appendChild(sectionElement);
					}
				});

				const mainBoxLeftCreative = document.createElement('div');
				mainBoxLeftCreative.classList.add('main-box-left-creative');

				mainBoxLeftCreative.appendChild(personalInfoCreative);

				const sectionsLeftCreative = [
					'preview-summary', // Podsumowanie zawodowe
					'preview-education', // Wykształcenie
					'preview-skills', // Umiejętności
				];

				sectionsLeftCreative.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxLeftCreative.appendChild(sectionElement);
					}
				});

				const mainBoxRightCreative = document.createElement('div');
				mainBoxRightCreative.classList.add('main-box-right-creative');

				mainBoxRightCreative.appendChild(personalDataBoxCreative);

				const sectionsRightCreative = [
					'preview-courses',
					'preview-languages',
					'preview-hobbies',
				];

				sectionsRightCreative.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						mainBoxRightCreative.appendChild(sectionElement);
					}
				});

				cvPreviewElement.appendChild(mainBoxLeftCreative);
				cvPreviewElement.appendChild(mainBoxRightCreative);

				break;
			case 'cv-mini':
				cvPreviewElement.classList.add('cv-mini-style');

				const mainBoxMiniLeft = document.createElement('div');
				mainBoxMiniLeft.classList.add('main-box-mini-left');

				const mainBoxMiniRight = document.createElement('div');
				mainBoxMiniRight.classList.add('main-box-mini-right');

				const personalDataBoxMini = document.createElement('div');
				personalDataBoxMini.classList.add('personal-data-box-mini');

				const sectionsMini = [
					{ id: 'preview-email', icon: 'fa-envelope' },
					{ id: 'preview-phone', icon: 'fa-phone' },
					{ id: 'preview-city', icon: 'fa-city' },
					{ id: 'preview-postal-code', icon: 'fa-map-marker-alt' },
				];

				sectionsMini.forEach((section) => {
					const sectionElement = document.getElementById(section.id);
					if (sectionElement) {
						const iconElement = document.createElement('i');
						iconElement.classList.add('fa', section.icon);
						sectionElement.classList.add('personal-data-box-mini-item');
						sectionElement.prepend(iconElement);
						personalDataBoxMini.appendChild(sectionElement);
					}
				});

				mainBoxMiniLeft.appendChild(personalDataBoxMini);

				const sectionsToAdd = [
					'preview-skills',
					'preview-courses',
					'preview-hobbies',
				];

				sectionsToAdd.forEach((id) => {
					const element = document.getElementById(id);
					if (element) {
						const hrElement = document.createElement('hr');
						element.appendChild(hrElement);
						mainBoxMiniLeft.appendChild(element);
					}
				});

				const sectionsToRight = [
					'preview-summary',
					'preview-education',
					'preview-languages',
				];

				sectionsToRight.forEach((id) => {
					const sectionElement = document.getElementById(id);
					if (sectionElement) {
						// Stworzenie div dla nagłówka
						const infoContainer = document.createElement('div');
						infoContainer.classList.add('cv-section-info');

						const h3Element = sectionElement.querySelector('h3');
						if (h3Element) {
							const hrElement = document.createElement('hr');
							infoContainer.appendChild(h3Element);
							infoContainer.appendChild(hrElement);
						}

						const idContainer = document.getElementById(sectionElement.id);
						if (idContainer) {
							idContainer.appendChild(infoContainer);

							// Przeniesienie treści (p) na końcu idContainer
							const pElement = sectionElement.querySelector('p');
							if (pElement) {
								idContainer.appendChild(pElement);
							}

							mainBoxMiniRight.appendChild(idContainer);
						}
					}
				});

				cvPreviewElement.appendChild(mainBoxMiniLeft);
				cvPreviewElement.appendChild(mainBoxMiniRight);

				const authorContainer = document.createElement('div');
				authorContainer.classList.add('cv-mini-style-author');

				const photoElement = document.getElementById('preview-photo');
				const firstNameElement = document.getElementById('preview-first-name');
				const lastNameElement = document.getElementById('preview-last-name');
				const jobTitleElement = document.getElementById('preview-job-title');

				if (photoElement) authorContainer.appendChild(photoElement);

				const nameContainer = document.createElement('div');
				nameContainer.classList.add('cv-mini-style-author-name');

				if (firstNameElement) nameContainer.appendChild(firstNameElement);
				if (lastNameElement) nameContainer.appendChild(lastNameElement);

				authorContainer.appendChild(nameContainer);

				if (jobTitleElement) authorContainer.appendChild(jobTitleElement);

				cvPreviewElement.prepend(authorContainer);

				break;
		}
	}
});
