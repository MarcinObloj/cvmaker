function selectTemplate(event, imageUrl) {
    event.preventDefault();
    window.location.href = 'secondstep.html?image=' + encodeURIComponent(imageUrl);
}