document.addEventListener('DOMContentLoaded', () => {
	const cvPreviewHtml = localStorage.getItem('cvPreviewHtml');
	if (cvPreviewHtml) {
		document.getElementById('cv-preview-container').innerHTML = cvPreviewHtml;
	}
});

document
	.getElementById('download-cv')
	.addEventListener('click', async function () {
		const { jsPDF } = window.jspdf;
		const cvPreviewContainer = document.getElementById('cv-preview-container');

		try {
			const canvas = await html2canvas(cvPreviewContainer, {
				useCORS: true,
				scale: 1.5,
				scrollY: 0,
			});

			const imgData = canvas.toDataURL('image/png');

			if (!imgData || imgData === 'data:,') {
				throw new Error('Nie udało się wygenerować obrazu.');
			}

			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210;
			const pageHeight = 297;
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			if (imgHeight > pageHeight) {
				const totalPages = Math.ceil(imgHeight / pageHeight);

				for (let i = 0; i < totalPages; i++) {
					const position = -pageHeight * i;
					pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pageHeight);
					if (i < totalPages - 1) {
						pdf.addPage();
					}
				}
			} else {
				pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, pageHeight);
			}

			pdf.save('cv.pdf');
		} catch (error) {
			console.error('Błąd przy generowaniu obrazu:', error);
		}
	});
