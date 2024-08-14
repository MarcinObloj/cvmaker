document.addEventListener('DOMContentLoaded', function () {
    const sessionToken = localStorage.getItem('sessionToken');
    const userName = sessionStorage.getItem('userName');
    const sessionExpiration = sessionStorage.getItem('sessionExpiration');
    
   
    if (sessionToken && userName && sessionExpiration) {
        const now = new Date().getTime();
        if (now > sessionExpiration) {
           
            localStorage.removeItem('sessionToken');
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('sessionExpiration');
            alert('Twoja sesja wygasła. Zaloguj się ponownie.');
            window.location.href = 'login.html';
        } else {
            
            const newExpiration = now + 1000000; 
            sessionStorage.setItem('sessionExpiration', newExpiration);
        }
    } else {
       
    }
});
