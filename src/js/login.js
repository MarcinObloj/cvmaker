document.addEventListener('DOMContentLoaded', function () {
    console.log('Login form script loaded');
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        console.log('Form submit event triggered');

        // Resetowanie wiadomości
        document.querySelector('.error').textContent = '';
        document.querySelector('.success').textContent = '';

        const loginButton = event.target.querySelector('button[type="submit"]');
        loginButton.disabled = true;

        const usernameOrEmail = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const data = {
            emailOrUsername: usernameOrEmail,
            password: password,
        };

        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((error) => {
                    throw new Error(error.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log('Login successful, setting session token');
            localStorage.setItem('sessionToken', data.token);

            // Przechowywanie nazwy użytkownika w sessionStorage
            const userName = usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail;
            sessionStorage.setItem('userName', userName);

            // Ustawienie wygaśnięcia sesji na 10 sekund od teraz
            const sessionExpiration = new Date().getTime() + 1000000; // 10 sekund
            sessionStorage.setItem('sessionExpiration', sessionExpiration);

            // Przekierowanie na userpanel.html
            window.location.href = 'userpanel.html';
        })
        .catch((error) => {
            document.querySelector('.error').textContent = 'Logowanie nie powiodło się: ' + error.message;
        })
        .finally(() => {
            loginButton.disabled = false; // Ponowne włączenie przycisku po zakończeniu żądania
        });
    });
});
