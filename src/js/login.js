document.addEventListener('DOMContentLoaded', function () {
    console.log('Login form script loaded');

    document
        .getElementById('loginForm')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            console.log('Form submit event triggered');

            
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
                            throw new Error(error.error || 'Unknown error');
                        });
                    }
                    return response.json();
                })
                .then((data) => {
            
                    const userId = data.userId;
                    const userName = data.username;

                    
                    sessionStorage.setItem('userId', userId);
                    sessionStorage.setItem('userName', userName);

                    
                    localStorage.setItem('sessionToken', data.token);

                    console.log('Login successful, setting session data');

                    
                    const sessionExpiration = new Date().getTime() + (1000 * 60 * 10); 
                    sessionStorage.setItem('sessionExpiration', sessionExpiration);

                    
                    window.location.href = 'userpanel.html';
                })
                .catch((error) => {
                    document.querySelector('.error').textContent =
                        'Logowanie nie powiodło się: ' + error.message;
                })
                .finally(() => {
                    loginButton.disabled = false; 
                });
        });
});
