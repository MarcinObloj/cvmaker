document
				.getElementById('download-cv')
				.addEventListener('click', function () {
					
					const cvFileId = sessionStorage.cvFileId; 

					fetch(`http://localhost:8080/api/cvfile/download/${cvFileId}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					})
						.then((response) => {
							if (!response.ok) {
								throw new Error('Network response was not ok');
							}
							return response.blob();
						})
						.then((blob) => {
							const url = window.URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = 'cv-file.pdf'; 
							document.body.appendChild(a);
							a.click();
							a.remove();
							window.URL.revokeObjectURL(url);
						})
						.catch((error) => {
							console.error(
								'There was a problem with the fetch operation:',
								error
							);
						});
				});