// Main JavaScript for Kandy Emotion

// Global Functions (Accessible by HTML onclick)
window.openLightbox = (btn) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return; // Guard clause

    const item = btn.closest('.gallery-item');
    const img = item.querySelector('img');
    const imgSrc = img.src;

    // Mock thumbnails (using same image + placeholders for demo)
    const thumbnails = [
        imgSrc,
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=200&auto=format&fit=crop'
    ];

    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            
            <div class="lightbox-main">
                <img src="${imgSrc}" id="lightbox-main-img" alt="Pastel Detalle">
            </div>
            
            <div class="lightbox-sidebar">
                <h3 class="lightbox-title">Diseño Signature</h3>
                
                <div class="lightbox-thumbnails">
                    ${thumbnails.map((thumb, index) => `
                        <img src="${thumb}" class="lightbox-thumb ${index === 0 ? 'active' : ''}" 
                             onclick="changeLightboxImage(this, '${thumb}')">
                    `).join('')}
                </div>
                
                <p class="lightbox-desc">
                    Cada detalle de este pastel ha sido cuidado artesanalmente. 
                    Perfecto para celebraciones que buscan elegancia y sabor inolvidable.
                    <br><br>
                    <strong>Estilo:</strong> Moderno / Romántico<br>
                    <strong>Cobertura:</strong> Buttercream Suizo
                </p>
                
                <div class="lightbox-cta">
                    <a href="#configurator" class="btn btn-primary btn-block" onclick="closeLightbox()">
                        Personalizar este Diseño
                    </a>
                </div>
            </div>
        </div>
    `;
    lightbox.classList.add('active');

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };
};

window.changeLightboxImage = (thumb, src) => {
    const mainImg = document.getElementById('lightbox-main-img');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.lightbox-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
};

window.closeLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
};

window.nextStep = (step) => {
    // Validation
    const currentStep = step - 1;
    const currentStepEl = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    if (!currentStepEl) return;

    const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value) {
            valid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = 'rgba(255,255,255,0.2)';
        }
    });

    if (!valid) return;

    // Navigation
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    const nextStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (nextStepEl) nextStepEl.classList.add('active');

    // Progress Bar
    const progress = (step / 5) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;
};

window.prevStep = (step) => {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    const prevStepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
    if (prevStepEl) prevStepEl.classList.add('active');

    const progress = (step / 5) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;
};

window.submitConfigurator = () => {
    const nameInput = document.getElementById('client-name');
    const contactInput = document.getElementById('client-contact');
    const dateInput = document.getElementById('event-date');
    const fillingInput = document.getElementById('filling');

    const name = nameInput ? nameInput.value : '';
    const contact = contactInput ? contactInput.value : '';
    const date = dateInput ? dateInput.value : '';

    // Helper for Radio Values
    const getRadioValue = (name) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : 'No seleccionado';
    };

    const guests = getRadioValue('guests');
    const flavor = getRadioValue('flavor');
    const filling = fillingInput ? fillingInput.value : 'No seleccionado';
    const style = getRadioValue('cake-style');
    const delivery = getRadioValue('delivery');

    if (!name || !contact) {
        alert('Por favor completa tus datos de contacto.');
        return;
    }

    // Email Body
    const subject = `Nueva Cotización de Pastel - ${name}`;
    const body = `
SOLICITUD DE COTIZACIÓN - KANDY EMOTION
------------------------------------------------
CLIENTE
Nombre: ${name}
Contacto: ${contact}
Fecha del Evento: ${date}
------------------------------------------------
DETALLES DEL DISEÑO
------------------------------------------------
🎂 Invitados: ${guests} personas
🍰 Sabor Base: ${flavor}
🍫 Relleno: ${filling}
🎨 Estilo Visual: ${style}
🚚 Método de Entrega: ${delivery}
------------------------------------------------
NOTAS ADICIONALES
(El cliente puede agregar notas aquí...)

------------------------------------------------
Enviado desde el Configurador Web de Kandy Emotion
    `.trim();

    const mailtoLink = `mailto:adalloya@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    alert('¡Listo! Se ha abierto tu correo para enviar la cotización. ¡Gracias por elegirnos!');

    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// Initialization Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Kandy Emotion loaded');

    // Mobile Menu Logic
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    window.closeMobileMenu = () => {
        if (menuToggle && mobileMenu) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    };

    // Sticky Header
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Gallery Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Create Lightbox Container if not exists
    if (!document.getElementById('lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        document.body.appendChild(lightbox);
    }
});
