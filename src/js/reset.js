document
				.getElementById('new-password-form')
				.addEventListener('submit', async function (event) {
					event.preventDefault();

					const urlParams = new URLSearchParams(window.location.search);
					const token = urlParams.get('token');
					const newPassword = document.getElementById('new-password').value;

					const response = await fetch(
						'http://localhost:8080/api/users/change-password',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								token: token,
								newPassword: newPassword,
							}),
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