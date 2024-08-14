document.addEventListener('DOMContentLoaded', () => {
    
    const userName = sessionStorage.getItem('userName');
    const userId = sessionStorage.getItem('userId');

   
    if (userName) {
       
        document.getElementById('userStrong').textContent = userName;
        document.getElementById('userGreeting').textContent = userName;
    } else {
        console.error('Nazwisko użytkownika nie znalezione w sessionStorage.');
    }

    // Wyszukiwanie kontenera dla CV
    const cvBoxesContainer = document.querySelector('.cv__boxes');
    if (!cvBoxesContainer) {
        console.error('Element kontenera CV nie został znaleziony.');
        return;
    }

    // Funkcja do tworzenia i dodawania boxów CV
    function createCvBox(cvFile) {
        const cvBox = document.createElement('div');
        cvBox.className = 'cv__box';

        const img = document.createElement('img');
        img.src = './dist/img/cv-box.png'; 
        img.alt = 'Zdjęcie stworzonego CV';
        img.className = 'cv__box-photo';
        cvBox.appendChild(img);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.onclick = () => deleteCv(cvFile.id);
        cvBox.appendChild(deleteBtn);

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML =
            'Download | <i class="fa-solid fa-file-pdf"></i>';
        downloadBtn.onclick = () => downloadCv(cvFile.id);
        cvBox.appendChild(downloadBtn);

        cvBoxesContainer.appendChild(cvBox);
    }

    function loadUserCvFiles(userId) {
        fetch(`http://localhost:8080/api/cvfile/list/${userId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((cvFiles) => {
                cvFiles.forEach((cvFile) => {
                    createCvBox(cvFile);
                });
            })
            .catch((error) => {
                console.error('Błąd podczas ładowania CV:', error);
            });
    }

    
    if (userId) {
        loadUserCvFiles(userId);
    } else {
        console.error('UserId nie znaleziono w sessionStorage.');
    }
});


function downloadCv(cvFileId) {
    window.location.href = `http://localhost:8080/api/cvfile/download/${cvFileId}`;
}

function deleteCv(cvFileId) {
    fetch(`http://localhost:8080/api/cvfile/delete/${cvFileId}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                alert('CV zostało usunięte.');
                location.reload(); // Przeładuj stronę po usunięciu CV
            } else {
                return response.text().then((errorText) => {
                    throw new Error(errorText);
                });
            }
        })
        .catch((error) => {
            console.error('Błąd podczas usuwania CV:', error);
            alert('Wystąpił błąd podczas usuwania CV: ' + error.message);
        });
}