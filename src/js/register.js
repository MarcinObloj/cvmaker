document.addEventListener('DOMContentLoaded', function () {
    console.log('Register form script loaded');

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const form = document.getElementById('registerForm');

    const validateUsername = () => {
        const usernameError = username.closest('.form-group').querySelector('.error');
        if (username.value.length < 6 && username.value.length > 0) {
            usernameError.textContent = 'Nazwa użytkownika musi mieć co najmniej 6 znaków.';
            username.classList.add('input-error');
            return false; // Walidacja nie powiodła się
        } else {
            usernameError.textContent = '';
            username.classList.remove('input-error');
            return true; // Walidacja powiodła się
        }
    };

    const validateEmail = () => {
        const emailError = email.closest('.form-group').querySelector('.error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.value) && email.value.length > 0) {
            emailError.textContent = 'Proszę podać poprawny adres email.';
            email.classList.add('input-error');
            return false; // Walidacja nie powiodła się
        } else {
            emailError.textContent = '';
            email.classList.remove('input-error');
            return true; // Walidacja powiodła się
        }
    };

    const validatePassword = () => {
        const passwordError = password.closest('.form-group').querySelector('.error');
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if ((password.value.length < 6 || !specialCharRegex.test(password.value)) && password.value.length > 0) {
            passwordError.textContent = 'Hasło musi mieć co najmniej 6 znaków i zawierać co najmniej 1 znak specjalny.';
            password.classList.add('input-error');
            return false; // Walidacja nie powiodła się
        } else {
            passwordError.textContent = '';
            password.classList.remove('input-error');
            return true; // Walidacja powiodła się
        }
    };

    // Dodajemy zdarzenie input do każdego pola
    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);

    // Możesz dodać również zdarzenie focus, jeśli chcesz
    username.addEventListener('focus', validateUsername);
    email.addEventListener('focus', validateEmail);
    password.addEventListener('focus', validatePassword);

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Blokujemy domyślne wysłanie formularza

        console.log('Form submit event triggered');

        // Czyścimy komunikaty błędów i sukcesu
        document.querySelector('.error').textContent = '';
        document.querySelector('.success').textContent = '';
        document.querySelector('.error-register').textContent = '';

        const registerButton = event.target.querySelector('button[type="submit"]');
        registerButton.disabled = true;

        // Walidacja pól
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        // Jeśli wszystkie walidacje przeszły pomyślnie, wykonaj fetch
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            const data = {
                username: username.value,
                email: email.value,
                passwordHash: password.value,
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
                document.querySelector('.error-register').textContent = error.message;
            })
            .finally(() => {
                registerButton.disabled = false; 
            });
        } else {
            document.querySelector('.error-register').textContent = 'Formularz posiada błędy, najpierw je popraw a nastepnie spróbuj ponownie'
            registerButton.disabled = false; // Odblokuj przycisk, jeśli walidacja nie przeszła
        }
    });
});
