// Admin Logic

// Credentials
const USER = 'Babel';
const PASS = 'Loya';

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const uploadForm = document.getElementById('upload-form');
const previewImg = document.getElementById('preview');

// Check Session
if (sessionStorage.getItem('isAdmin') === 'true') {
    showDashboard();
}

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === USER && p === PASS) {
        sessionStorage.setItem('isAdmin', 'true');
        showDashboard();
    } else {
        alert('Credenciales incorrectas');
    }
});

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function logout() {
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

// Image Preview
window.previewImage = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        }
        reader.readAsDataURL(input.files[0]);
    }
};

// Upload Handler
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('image-file');
    const category = document.getElementById('image-category').value;
    const alt = document.getElementById('image-alt').value;

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const base64Image = e.target.result;

            // Create Image Object
            const newImage = {
                id: Date.now(),
                src: base64Image,
                category: category,
                alt: alt
            };

            // Save to LocalStorage
            saveImage(newImage);

            alert('¡Imagen subida con éxito! Aparecerá en la galería principal.');
            uploadForm.reset();
            previewImg.style.display = 'none';
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
});

function saveImage(imageObj) {
    let gallery = JSON.parse(localStorage.getItem('customGallery')) || [];
    gallery.push(imageObj);
    localStorage.setItem('customGallery', JSON.stringify(gallery));
}
