// Deity data with images and names
const deities = [
    {
        name: 'Lord Ganesha',
        image: 'https://www.templepurohit.com/wp-content/uploads/2015/07/Lord-Ganesha-Hindu-Gods-and-Deities.jpg'
    },
    {
        name: 'Shiva parivar',
        image: 'https://rukminim2.flixcart.com/image/850/1000/ked56kw0-0/poster/l/v/3/medium-god020-lord-shiva-family-wall-poster-lord-shivaji-hd-original-imafv29auterbtpj.jpeg?q=20&crop=false'
    },
    {
        name: 'Lakshmi Narayana',
        image: 'https://i.pinimg.com/736x/56/29/86/5629863a8b88dc98f1a66e4f841ec7b8.jpg'
    },
    {
        name: 'Radha Krishna',
        image: 'https://i.pinimg.com/1200x/40/60/1b/40601b0bd068ce1bcf8239afdf9a3ad7.jpg'
    }
];

// Offering data with images
const offerings = {
    incense: {
        name: 'Incense',
        image: 'incense.png'
    },
    flowers: {
        name: 'Flowers',
        image: 'flowers.png'
    },
    fruits: {
        name: 'Fruits',
        image: 'fruits.png'
    },
    lamp: {
        name: 'Lamp',
        image: 'lamp.png'
    }
};

// Function to check time and toggle night mode
function updateNightMode() {
    const currentHour = new Date().getHours();
    const body = document.body;
    // Night time is 7 PM (19) to 5:59 AM (exclusive of 6)
    if (currentHour >= 19 || currentHour < 6) {
        if (!body.classList.contains('night-mode')) {
            body.classList.add('night-mode');
            console.log("Night mode activated.");
        }
    } else {
        if (body.classList.contains('night-mode')) {
            body.classList.remove('night-mode');
            console.log("Night mode deactivated.");
        }
    }
}

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    const deityGrid = document.getElementById('deityGrid');
    const deityImage = document.getElementById('deityImage');
    const selectedDeity = document.getElementById('selectedDeity');
    const offeringDisplay = document.getElementById('offeringDisplay');
    const offeringButtons = document.getElementById('offeringButtons');
    const deityUpload = document.getElementById('deityUpload');
    const deityName = document.getElementById('deityName');
    const addDeityBtn = document.getElementById('addDeityBtn');

    // Load saved custom deities from localStorage
    const savedDeities = JSON.parse(localStorage.getItem('customDeities') || '[]');
    deities.push(...savedDeities);

    // Populate deity grid
    function populateDeityGrid() {
        deityGrid.innerHTML = ''; // Clear existing deities
        deities.forEach(deity => {
            const deityItem = document.createElement('div');
            deityItem.className = 'deity-item';
            deityItem.innerHTML = `
                <img src="${deity.image}" alt="${deity.name}">
                <p>${deity.name}</p>
                ${deity.isCustom ? '<button class="remove-deity">Remove</button>' : ''}
            `;
            deityItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-deity')) {
                    selectDeity(deity);
                }
            });
            if (deity.isCustom) {
                deityItem.querySelector('.remove-deity').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeCustomDeity(deity);
                });
            }
            deityGrid.appendChild(deityItem);
        });
    }

    // Function to add custom deity
    function addCustomDeity() {
        const file = deityUpload.files[0];
        const name = deityName.value.trim();

        if (!file || !name) {
            alert('Please select an image and enter a name for the deity');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newDeity = {
                name: name,
                image: e.target.result,
                isCustom: true
            };
            deities.push(newDeity);
            
            // Save to localStorage
            const customDeities = deities.filter(d => d.isCustom);
            localStorage.setItem('customDeities', JSON.stringify(customDeities));
            
            // Reset form and update grid
            deityUpload.value = '';
            deityName.value = '';
            populateDeityGrid();
        };
        reader.readAsDataURL(file);
    }

    // Function to remove custom deity
    function removeCustomDeity(deity) {
        const index = deities.findIndex(d => d.name === deity.name && d.image === deity.image);
        if (index !== -1) {
            deities.splice(index, 1);
            // Update localStorage
            const customDeities = deities.filter(d => d.isCustom);
            localStorage.setItem('customDeities', JSON.stringify(customDeities));
            populateDeityGrid();
        }
    }

    // Event listeners
    addDeityBtn.addEventListener('click', addCustomDeity);
    
    // Handle offering buttons
    offeringButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('offering-btn')) {
            const offeringType = e.target.dataset.offering;
            makeOffering(offeringType);
        }
    });

    // Function to select a deity
    function selectDeity(deity) {
        deityImage.src = deity.image;
        deityImage.alt = deity.name;
        offeringDisplay.innerHTML = ''; // Clear previous offerings
        selectedDeity.classList.add('enlarged');
        
        // Show the offering section
        document.querySelector('.worship-area').classList.add('visible');
        document.querySelector('.selected-deity').classList.add('visible');
        document.querySelector('.offering-buttons').classList.add('visible');
        document.querySelector('.offering-display').classList.add('visible');
        
        // Safari-compatible smooth scroll
        const start = window.pageYOffset;
        const startTime = performance.now();
        const duration = 1000;

        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, start * (1 - progress));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
        
        // Add click event to close enlarged view
        selectedDeity.addEventListener('click', () => {
            selectedDeity.classList.remove('enlarged');
        });
    }

    // Function to create flower particles
    function createFlowerParticle() {
        const particle = document.createElement('div');
        particle.className = 'flower-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
        return particle;
    }

    // Function to make an offering
    function makeOffering(type) {
        if (!deityImage.src) {
            alert('Please select a deity first');
            return;
        }

        const offering = offerings[type];
        const offeringElement = document.createElement('div');
        offeringElement.className = 'offering-item';
        offeringElement.innerHTML = `
            <img src="${offering.image}" alt="${offering.name}" style="width: 50px; height: 50px; object-fit: cover;">
            <p>${offering.name}</p>
        `;

        // Add to offering display
        offeringDisplay.appendChild(offeringElement);

        // Create animation container (reference point)
        const animationContainer = document.createElement('div');
        animationContainer.className = 'offering-animation';

        // Create mover element for orbital rotation
        const mover = document.createElement('div');
        mover.className = 'offering-mover';
        mover.style.animation = `orbit-move 10.4s ease-out forwards`;

        // Create single offering item (img) for translation & orientation
        const item = document.createElement('img');
        item.src = offering.image;
        const size = type === 'fruits' ? '80px' : '40px';
        item.style.width = size;
        item.style.height = size;
        item.style.objectFit = 'cover';
        item.style.borderRadius = '50%';
        item.className = 'offering-item-animated';

        // Set the orbit radius as a CSS variable on the item for the orient animation
        const deityRect = deityImage.getBoundingClientRect();
        const orbitRadius = Math.min(deityRect.width, deityRect.height) * 0.3;
        item.style.setProperty('--orbit-radius', `${orbitRadius}px`);
        item.style.animation = `orbit-orient 10.4s ease-out forwards`;

        // Append item to mover, mover to container
        mover.appendChild(item);
        animationContainer.appendChild(mover);

        // Position the animation container relative to the deity image
        const selectedDeity = document.getElementById('selectedDeity');
        selectedDeity.style.position = 'relative'; // Ensure parent is relative
        selectedDeity.appendChild(animationContainer);

        // Debug logging
        console.log('Animation container added:', {
            deityRect,
            orbitRadius,
            containerPosition: selectedDeity.getBoundingClientRect(),
            animationPosition: animationContainer.getBoundingClientRect()
        });

        // Remove animation elements after completion
        setTimeout(() => {
            animationContainer.remove();
        }, 11400); // Matches animation duration + buffer

        // Play offering sound
        playOfferingSound();
    }

    // Function to play offering sound
    function playOfferingSound() {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.3;
        audio.play().catch(error => console.log('Audio play failed:', error));
    }

    // Initial check for night mode on load
    updateNightMode();

    // Periodically check time to update night mode (e.g., every 5 minutes)
    setInterval(updateNightMode, 5 * 60 * 1000);

    // Initial population of deity grid
    populateDeityGrid();
}); 