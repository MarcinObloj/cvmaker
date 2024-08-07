function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', () => {
    const imageUrl = getParameterByName('image');
    if (imageUrl) {
        const cvPreviewElement = document.getElementById('cv-preview');
        if (cvPreviewElement) {
            const imgElement = document.createElement('img');
            imgElement.src = decodeURIComponent(imageUrl);
            imgElement.alt = 'CV Preview Image';
            imgElement.id = 'cv-preview-img';
            cvPreviewElement.appendChild(imgElement);
        } else {
            console.error('Element o ID "cv-preview" nie został znaleziony.');
        }
    } else {
        console.error('Parametr "image" nie został znaleziony w URL.');
    }

    document
        .getElementById('save-cv')
        .addEventListener('click', function () {
            const cvPreviewHtml =
                document.getElementById('cv-preview').outerHTML;
            localStorage.setItem('cvPreviewHtml', cvPreviewHtml);
            window.location.href = 'thirdstep.html';
        });
});