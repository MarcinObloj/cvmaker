document
				.getElementById('reset-password-form')
				.addEventListener('submit', async function (event) {
					event.preventDefault();

					const email = document.getElementById('email').value;
					const response = await fetch(
						'http://localhost:8080/api/users/reset-password?email=' +
							encodeURIComponent(email),
						{
							method: 'POST',
						}
					);

					const result = await response.text();
					const messageElement = document.querySelector('.message');
					const successElement = messageElement.querySelector('.success');
					const errorElement = messageElement.querySelector('.error');

					if (response.ok) {
						successElement.textContent = result;
						errorElement.textContent = '';
					} else {
						successElement.textContent = '';
						errorElement.textContent = result;
					}
				});