document.addEventListener('DOMContentLoaded', function () {
    const sessionToken = localStorage.getItem('sessionToken');
    const userName = sessionStorage.getItem('userName');
    const sessionExpiration = sessionStorage.getItem('sessionExpiration');
    
    // Sprawdź, czy istnieje sesja i czy nie wygasła
    if (sessionToken && userName && sessionExpiration) {
        const now = new Date().getTime();
        if (now > sessionExpiration) {
            // Sesja wygasła
            localStorage.removeItem('sessionToken');
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('sessionExpiration');
            alert('Twoja sesja wygasła. Zaloguj się ponownie.');
            window.location.href = 'login.html';
        } else {
            // Przedłuż sesję na dodatkowe 10 sekund
            const newExpiration = now + 1000000; // 10 sekund
            sessionStorage.setItem('sessionExpiration', newExpiration);
        }
    } else {
        // Brak ważnej sesji, przekierowanie do logowania
        // window.location.href = 'login.html';
    }
});
