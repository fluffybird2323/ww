// Deity data with images and names
const deities = [
    {
        name: 'Lord Ganesha',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/ganesha.jpg'
    },
    {
        name: 'Lord Shiva',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/shiva.jpg'
    },
    {
        name: 'Goddess Lakshmi',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/lakshmi.jpg'
    },
    {
        name: 'Lord Krishna',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/krishna.jpg'
    }
];

// Offering data with images
const offerings = {
    incense: {
        name: 'Incense',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/incense.jpg'
    },
    flowers: {
        name: 'Flowers',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/flowers.jpg'
    },
    fruits: {
        name: 'Fruits',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/fruits.jpg'
    },
    lamp: {
        name: 'Lamp',
        image: 'https://raw.githubusercontent.com/your-username/your-repo/main/images/lamp.jpg'
    }
};

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

        // Create animation container
        const animationContainer = document.createElement('div');
        animationContainer.className = 'offering-animation';
        
        // Create offering image for animation
        const animatedOffering = document.createElement('img');
        animatedOffering.src = offering.image;
        animatedOffering.style.width = '100px';
        animatedOffering.style.height = '100px';
        animatedOffering.style.objectFit = 'cover';
        animatedOffering.style.borderRadius = '50%';

        if (type === 'flowers') {
            // Create flower shower effect
            const showerContainer = document.createElement('div');
            showerContainer.className = 'offering-shower';
            
            // Add multiple flower particles
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = createFlowerParticle();
                    showerContainer.appendChild(particle);
                    
                    // Remove particle after animation
                    particle.addEventListener('animationend', () => {
                        particle.remove();
                    });
                }, i * 100);
            }
            
            animationContainer.appendChild(showerContainer);
        } else {
            // Add rotation animation for other offerings
            animatedOffering.classList.add('offering-rotation');
        }

        animationContainer.appendChild(animatedOffering);
        document.body.appendChild(animationContainer);

        // Remove animation elements after completion
        setTimeout(() => {
            animationContainer.remove();
        }, 3000);

        // Play offering sound
        playOfferingSound();
    }

    // Function to play offering sound
    function playOfferingSound() {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 0.3;
        audio.play().catch(error => console.log('Audio play failed:', error));
    }

    // Initial population of deity grid
    populateDeityGrid();
}); 