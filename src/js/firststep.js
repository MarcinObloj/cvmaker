function selectTemplate(event, templateName) {
    event.preventDefault();
    
    localStorage.setItem('selectTemplate', templateName);
    
    window.location.href = 'secondstep.html';
}