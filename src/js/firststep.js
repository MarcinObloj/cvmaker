function selectTemplate(event, templateName) {
    event.preventDefault();
    // Zapisz wybrany szablon w localStorage
    localStorage.setItem('selectTemplate', templateName);
    // Przekieruj użytkownika do secondstep.html
    window.location.href = 'secondstep.html';
}