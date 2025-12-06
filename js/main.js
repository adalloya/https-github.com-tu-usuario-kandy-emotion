// Main JavaScript for Kandy Emotion

// Global Functions (Accessible by HTML onclick)
// Global Functions (Accessible by HTML onclick)
// Global state for lightbox navigation
let currentLightboxIndex = 0;
let galleryImages = [];

window.openLightbox = (element) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    // Collect all gallery images
    const allItems = document.querySelectorAll('.gallery-grid .gallery-item img');
    galleryImages = Array.from(allItems).map(img => img.src);

    // Find index of clicked image
    const clickedImg = element.querySelector('img');
    currentLightboxIndex = galleryImages.indexOf(clickedImg.src);

    updateLightboxContent();

    lightbox.classList.add('active');

    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.onclick = (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };

    // Add swipe listeners
    const mainContent = lightbox.querySelector('.lightbox-main');
    let touchStartX = 0;
    let touchEndX = 0;

    mainContent.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mainContent.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextLightboxImage();
        if (touchEndX > touchStartX + 50) prevLightboxImage();
    }
};

function updateLightboxContent() {
    const lightbox = document.getElementById('lightbox');
    const imgSrc = galleryImages[currentLightboxIndex];

    // Mock thumbnails (using current image + neighbors or placeholders)
    // For a real app, you might want specific thumbnails for each gallery item
    const thumbnails = [
        imgSrc,
        galleryImages[(currentLightboxIndex + 1) % galleryImages.length],
        galleryImages[(currentLightboxIndex + 2) % galleryImages.length]
    ];

    // Update or Create content
    // Note: Re-rendering the whole content resets listeners, so we should be careful.
    // Better to just update the image if the structure exists, but for simplicity/robustness with current structure:

    const contentHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
            
            <div class="lightbox-main">
                <img src="${imgSrc}" id="lightbox-main-img" alt="Pastel Detalle">
                <div class="lightbox-nav-btn prev" onclick="prevLightboxImage()">&#10094;</div>
                <div class="lightbox-nav-btn next" onclick="nextLightboxImage()">&#10095;</div>
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
                        Quiero uno así
                    </a>
                </div>
            </div>
        </div>
    `;

    lightbox.innerHTML = contentHTML;

    // Re-attach swipe listeners since we replaced innerHTML
    const mainContent = lightbox.querySelector('.lightbox-main');
    let touchStartX = 0;

    mainContent.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mainContent.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextLightboxImage();
        if (touchEndX > touchStartX + 50) prevLightboxImage();
    }, { passive: true });
}

window.nextLightboxImage = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxContent();
};

window.prevLightboxImage = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
};

window.changeLightboxImage = (thumb, src) => {
    // This is for clicking thumbnails - we can just update the main image
    // or jump to that index if it's in our gallery list.
    // For now, let's keep the visual update behavior but maybe find the index if possible.
    const mainImg = document.getElementById('lightbox-main-img');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.lightbox-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    // Try to sync index if this src is in our main list
    const idx = galleryImages.indexOf(src);
    if (idx !== -1) currentLightboxIndex = idx;
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

    // WhatsApp Message
    const phoneNumber = '526562699857';
    const message = `
*SOLICITUD DE COTIZACIÓN - KANDY EMOTION*
------------------------------------------------
*CLIENTE*
👤 Nombre: ${name}
📱 Contacto: ${contact}
📅 Fecha del Evento: ${date}
------------------------------------------------
*DETALLES DEL DISEÑO*
------------------------------------------------
🎂 Invitados: ${guests} personas
🍰 Sabor Base: ${flavor}
🍫 Relleno: ${filling}
🎨 Estilo Visual: ${style}
🚚 Método de Entrega: ${delivery}
------------------------------------------------
*NOTAS ADICIONALES*
(El cliente puede agregar notas aquí...)
------------------------------------------------
Enviado desde el Configurador Web
    `.trim();

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    alert('¡Listo! Se ha abierto WhatsApp para enviar tu cotización. ¡Gracias por elegirnos!');

    setTimeout(() => {
        window.location.reload();
    }, 1000);
};

// Menu Modal Logic
const menuData = {
    'vainilla': {
        title: 'Vainilla Bourbon Imperial',
        img: 'assets/images/menu-vanilla.png',
        desc: 'La elegancia hecha sabor. Utilizamos vainas de vainilla de Madagascar maceradas en bourbon añejo.',
        ingredient: 'Vainilla Planifolia Grado A',
        phrase: '"Un clásico que nunca pasa de moda, elevado a la perfección."'
    },
    'cacao': {
        title: 'Cacao Trufado Belga',
        img: 'assets/images/menu-cacao.png',
        desc: 'Para los verdaderos amantes del chocolate. Una experiencia intensa, húmeda y profundamente aromática.',
        ingredient: 'Cacao Barry Extra Brute',
        phrase: '"El chocolate no es un postre, es una emoción."'
    },
    'citrus': {
        title: 'Citrus Zest & Butter',
        img: 'assets/images/menu-citrus.png',
        desc: 'Un equilibrio vibrante entre la acidez del limón eureka y la dulzura de nuestra crema de mantequilla.',
        ingredient: 'Limones Eureka Orgánicos',
        phrase: '"Un rayo de sol en cada rebanada."'
    },
    'pink': {
        title: 'Pink Velvet Natural',
        img: 'assets/images/menu-pink.png',
        desc: 'Suavidad aterciopelada con un toque de cacao y el color vibrante del betabel fresco.',
        ingredient: 'Betabel Orgánico & Cacao',
        phrase: '"Romántico, suave y absolutamente irresistible."'
    },
    // Fillings
    'mousse': {
        title: 'Mousse de Cheesecake',
        img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400&auto=format&fit=crop',
        desc: 'Una nube de sabor. Queso crema de primera calidad batido hasta obtener una textura aireada y ligera.',
        ingredient: 'Queso Crema Philadelphia',
        phrase: '"La cremosidad que tus sueños merecen."'
    },
    'avellana': {
        title: 'Ganache de Avellana',
        img: 'https://images.unsplash.com/photo-1615485925694-a035aa0f471e?q=80&w=400&auto=format&fit=crop',
        desc: 'Inspirado en los mejores bombones europeos. Chocolate con leche y pasta de avellanas tostadas.',
        ingredient: 'Avellanas del Piamonte',
        phrase: '"Un abrazo de sabor en cada bocado."'
    },
    'frutos': {
        title: 'Compota de Frutos Rojos',
        img: 'https://images.unsplash.com/photo-1596367407372-96cb8807410e?q=80&w=400&auto=format&fit=crop',
        desc: 'Cocinada a fuego lento para concentrar el sabor de las fresas, frambuesas y zarzamoras frescas.',
        ingredient: 'Frutos Rojos Frescos',
        phrase: '"La frescura del bosque en tu pastel."'
    },
    'caramelo': {
        title: 'Caramelo Salado',
        img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop',
        desc: 'El equilibrio perfecto entre dulce y salado. Toffee casero preparado con mantequilla y sal de mar.',
        ingredient: 'Sal de Mar de Colima',
        phrase: '"Atrevido, intenso y adictivo."'
    }
};

window.openMenuModal = (type) => {
    const modal = document.getElementById('menu-modal');
    const data = menuData[type];

    if (!data) return;

    document.getElementById('menu-modal-title').innerText = data.title;
    document.getElementById('menu-modal-img').src = data.img;
    document.getElementById('menu-modal-desc').innerText = data.desc;
    document.getElementById('menu-modal-ingredient').innerText = data.ingredient;
    document.getElementById('menu-modal-phrase').innerText = data.phrase;

    modal.classList.add('active');

    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeMenuModal();
        }
    };
};

window.closeMenuModal = () => {
    const modal = document.getElementById('menu-modal');
    if (modal) modal.classList.remove('active');
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

    // Load Custom Images from LocalStorage
    const customGallery = JSON.parse(localStorage.getItem('customGallery')) || [];
    const galleryGrid = document.querySelector('.gallery-grid');

    if (customGallery.length > 0 && galleryGrid) {
        customGallery.forEach(item => {
            const div = document.createElement('div');
            div.className = `gallery-item ${item.category}`;
            div.onclick = function () { openLightbox(this); };

            div.innerHTML = `
                <img src="${item.src}" alt="${item.alt}" loading="lazy">
                <div class="gallery-overlay"></div>
            `;

            // Append to grid
            galleryGrid.appendChild(div);
        });
    }

    // Gallery Filters (Re-run to include new items)
    const filterBtns = document.querySelectorAll('.filter-btn');
    // Re-select items including new ones
    const allGalleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            allGalleryItems.forEach(item => {
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
