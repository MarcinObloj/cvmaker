console.log('Register form script loaded');
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    console.log('Form submit event triggered');

    // Resetowanie wiadomości
    document.querySelector('.error').textContent = '';
    document.querySelector('.success').textContent = '';

    const registerButton = event.target.querySelector('button[type="submit"]');
    registerButton.disabled = true;

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        email: email,
        passwordHash: password,
    };

    fetch('http://localhost:8080/api/users/register', {
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
        document.querySelector('.success').textContent = data.message;
    })
    .catch((error) => {
        document.querySelector('.error').textContent = error.message;
    })
    .finally(() => {
        registerButton.disabled = false; // Ponowne włączenie przycisku po zakończeniu żądania
    });
});
