let selectedPet = '';

const petImages = {
    puppy: {
        home: './image/puppyhomeimage.png',
        feed: './image/puppy-chef.png',
        rest: './image/puppy-sleep.png',
        feedWithJuice: './image/puppy-with-juice.png',
        feedWithBread: './image/puppy-in-bread.png',
        feedWithPizza: './image/puppy-with-pizza.png',
        feedWithDonut: './image/puppy-with-donut.png'
    },
    kitty: {
        home: './image/kitty-full.png',
        feed: './image/kitty-chef.png',
        rest: './image/kitty-sleep.png',
        feedWithJuice: './image/kitty-with-juice.png',
        feedWithBread: './image/kitty-with-bread.png',
        feedWithPizza: './image/kitty-with-pizza.png',
        feedWithDonut: './image/kitty-with-donut.png'
    }
};

const playSection = document.getElementById('playSection');
const restSection = document.getElementById('restSection');
const homePage = document.getElementById('homePage');
const feedSection = document.getElementById('feedSection');
const statusSection = document.getElementById('statusSection');

// Modify your initial page display logic
document.getElementById('introPage').style.display = 'flex';
statusSection.style.display = 'none';
document.getElementById('homePage').classList.add('hidden');
document.getElementById('petSelectionPage').classList.add('hidden');

// Update the intro timeout to show pet selection instead of home
setTimeout(() => {
    const introPage = document.getElementById('introPage');
    introPage.style.display = 'none';
    document.getElementById('petSelectionPage').classList.remove('hidden');
}, 1500);

// Add the pet selection function
function selectPet(petType) {
    selectedPet = petType;
    
    // Update initial images
    document.getElementById('homeimage').src = petImages[petType].home;
    document.getElementById('petImage').src = petImages[petType].feed;
    
    // Hide pet selection and show home page with status
    document.getElementById('petSelectionPage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    statusSection.style.display = 'flex';
}

// Update your showSection function
function showSection(section) {
    feedSection.classList.add('hidden');
    playSection.classList.add('hidden');
    restSection.classList.add('hidden');
    homePage.classList.add('hidden');

    if (section === 'feed') {
        feedSection.classList.remove('hidden');
        document.getElementById('petImage').src = petImages[selectedPet].feed;
    }
    else if (section === 'play') {
        playSection.classList.remove('hidden');
        restartGame();
    }
    else if (section === 'rest') {
        restSection.classList.remove('hidden');
        const restImage = document.querySelector('#restSection img');
        restImage.src = petImages[selectedPet].rest;
    }
}

// Handle drag over event to allow dropping
// Store image mappings for different food items
const foodImageMappings = {
    'pizza': function() { return petImages[selectedPet].feedWithPizza; },
    'bread': function() { return petImages[selectedPet].feedWithBread; },
    'juice': function() { return petImages[selectedPet].feedWithJuice; },
    'donut': function() { return petImages[selectedPet].feedWithDonut; }
};

// Handle the drag start event
// First, add the drag start handler function
// Function to start the drag (for both mouse and touch)
// Function to start the drag (for both mouse and touch)
function dragStart(event) {
    // For touchstart event (mobile view)
    if (event.type === "touchstart") {
        event.preventDefault(); // Prevents the default behavior for touch devices
        event = event.touches[0]; // Gets the first touch point
    }
    
    // Set the dragged element's ID as data to be used in the drop event
    var draggedElement = event.target;
    draggedElement.classList.add('dragging');

    // For mouse events (laptop/desktop view)
    if (event.type === "mousedown") {
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
    }

    // For touch events (mobile view)
    if (event.type === "touchstart") {
        document.addEventListener("touchmove", dragMove);
        document.addEventListener("touchend", dragEnd);
    }
}

// Function to handle the drag move (for both mouse and touch)
function dragMove(event) {
    // For touchmove event (mobile view)
    if (event.type === "touchmove") {
        event.preventDefault(); // Prevents scrolling while dragging on mobile
        event = event.touches[0]; // Gets the first touch point
    }

    // Get the dragged element
    var draggedElement = document.querySelector('.dragging');
    if (draggedElement) {
        // Move the dragged element based on the event coordinates
        draggedElement.style.left = (event.pageX || event.touches[0].pageX) - draggedElement.offsetWidth / 2 + 'px';
        draggedElement.style.top = (event.pageY || event.touches[0].pageY) - draggedElement.offsetHeight / 2 + 'px';
    }
}

// Function to handle the drag end (for both mouse and touch)
function dragEnd(event) {
    var draggedElement = document.querySelector('.dragging');
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement.style.left = ''; // Reset position
        draggedElement.style.top = ''; // Reset position
    }

    // Remove event listeners after drag is done
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("touchend", dragEnd);
}

// Simple messages for each food
const foodMessages = {
    pizza: "Yummy! 🍕",
    bread: "Tasty! 🍞",
    juice: "Delicious! 🥤",  
    donut: "Sweet! 🍩"
};

// Function to show message
function showFoodMessage(foodType, petImage) {
    const message = document.createElement('div');
    message.className = 'food-message';
    message.textContent = foodMessages[foodType] || "Yummy!";
    const petPosition = petImage.getBoundingClientRect();
    message.style.left = (petPosition.left + 50) + 'px'; 
    message.style.top = (petPosition.top + 20) + 'px';   
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 2000);
}

// Drop event handler
document.addEventListener('drop', (event) => {
    event.preventDefault();
    const petImage = document.getElementById('petImage');
    if (event.target === petImage) {
        const droppedFoodId = event.dataTransfer.getData('text/plain');
        if (foodImageMappings[droppedFoodId]) {
            showFoodMessage(droppedFoodId, petImage);
            petImage.src = foodImageMappings[droppedFoodId]();
            setTimeout(() => {
                petImage.src = petImages[selectedPet].feed;
            }, 3000);
            handleFeeding();
        }
    }
});

document.addEventListener('dragover', (event) => {
    event.preventDefault(); 
});

const grid = document.getElementById('grid');
const scoreBoard = document.getElementById('score');
const timerBoard = document.getElementById('timer');
const gameOverMessage = document.getElementById('gameOverMessage');
const holes = 16;
const gameTime = 30;
let score = 0;
let timeLeft = gameTime;
let gameInterval, spawnInterval;

// Random assets
const assets = {
    mouse: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    bomb: "https://cdn-icons-png.flaticon.com/512/616/616409.png",
    timer: "https://cdn-icons-png.flaticon.com/512/3505/3505675.png"
};

// Create the grid
function createGrid() {
    grid.innerHTML = ''; // Clear grid before creating
    for (let i = 0; i < holes; i++) {
        const hole = document.createElement('div');
        hole.classList.add('hole');
        hole.setAttribute('data-id', i);
        grid.appendChild(hole);
    }
}

// Randomize hole content
function randomizeContent() {
    const allHoles = document.querySelectorAll('.hole');
    allHoles.forEach(hole => (hole.innerHTML = '')); // Clear holes

    const numItems = timeLeft < 15 ? 2 : 1; // If time < 15s, show more items
    const usedHoles = [];

    for (let i = 0; i < numItems; i++) {
        let randomHole;
        do {
            randomHole = Math.floor(Math.random() * holes);
        } while (usedHoles.includes(randomHole)); // Ensure unique holes
        usedHoles.push(randomHole);

        const hole = allHoles[randomHole];
        const randomAsset = Math.random() < 0.5 ? (Math.random() < 0.7 ? 'mouse' : 'timer') : 'bomb';
        const img = document.createElement('img');
        img.src = assets[randomAsset];
        img.dataset.type = randomAsset;
        hole.appendChild(img);
    }
}

// Handle click events
function handleClick(e) {
    if (e.target.tagName !== 'IMG') return; // Only respond to clicks on images
    const type = e.target.dataset.type;

    if (type === 'mouse') {
        score++;
    } else if (type === 'bomb') {
        endGame(false);
        return;
    } else if (type === 'timer') {
        timeLeft += 10;
    }

    updateScore();
    e.target.remove(); // Remove clicked item
}

// Update the scoreboard
function updateScore() {
    scoreBoard.textContent = `Score: ${score}`;
    timerBoard.textContent = `Time Left: ${timeLeft}s`;
}

// Timer logic
function startTimer() {
    gameInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            endGame(true);
        } else {
            updateScore();
        }
    }, 1000);
}

let gameRunning = false;

// Start game logic
const spawnIntervalTimeBefore15 = 2000;
const spawnIntervalTimeAfter15 = 2500;
function startGame() {
    if (gameRunning) return;
    gameRunning = true;
    score = 0;
    timeLeft = gameTime;
    grid.innerHTML = '';
    gameOverMessage.classList.add('hidden');
    createGrid();
    grid.addEventListener('click', handleClick); // Re-attach the event listener
    updateScore();
    startTimer();
    spawnInterval = setInterval(() => {
        if (timeLeft < 15) {
            clearInterval(spawnInterval);
            spawnInterval = setInterval(randomizeContent, spawnIntervalTimeAfter15);
        }
        randomizeContent();
    }, spawnIntervalTimeBefore15);
}

// End game
function endGame(success) {
    gameRunning = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    grid.removeEventListener('click', handleClick); // Remove the event listener
    grid.innerHTML = '';
    gameOverMessage.classList.remove('hidden');
    gameOverMessage.textContent = success
        ? `Game Over! Your score is ${score}.`
        : `You hit a bomb! Game Over.`;
}

// Restart the game
function restartGame() {
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    gameRunning = false;
    startGame();
}

function resetPetImage() {
    const petImage = document.getElementById('petImage');
    petImage.src = petImages[selectedPet].feed;
}

// Rest section logic
function toggleLight() {
    const restSection = document.getElementById('restSection');
    const lightButton = document.getElementById('lightButton');

    // Make sure we found our elements
    if (!restSection || !lightButton) {
        console.error('Required elements not found');
        return;
    }

    if (lightButton.textContent === "Turn Off Light") {
        // Turn off light
        restSection.style.backgroundColor = "#000000";
        restSection.style.color = "#ffffff";
        lightButton.textContent = "Turn On Light";
        
        // Also darken the button for better visibility in dark mode
        lightButton.style.backgroundColor = "#333333";
        lightButton.style.color = "#ffffff";
    } else {
        // Turn on light
        restSection.style.backgroundColor = "";
        restSection.style.color = "";
        lightButton.textContent = "Turn Off Light";
        
        // Reset button styles
        lightButton.style.backgroundColor = "";
        lightButton.style.color = "";
    }
}

// Go back to Home
function goHome() {
    homePage.classList.remove('hidden');
    feedSection.classList.add('hidden');
    playSection.classList.add('hidden');
    restSection.classList.add('hidden');
    gameOverMessage.classList.add('hidden');
    document.getElementById('homeimage').src = petImages[selectedPet].home;
    resetPetImage();
}

// Pet status variables
// Pet status variables
// Pet status variables with range limits
let hungerLevel = 70;
let energyLevel = 50;
let happinessLevel = 50;

const MIN_LEVEL = 0;
const MAX_LEVEL = 100;
const ENERGY_CRITICAL = 25;
const HAPPY_CRITICAL = 30;
const HUNGRY_CRITICAL = 85;
const CRITICAL_LEVEL = 20;
let statusInterval;

// Utility function to ensure value stays within range
function clampValue(value) {
return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, value));
}

// Update circle progress with range validation
function setProgress(element, percent) {
if (!element) return;
const circle = element.querySelector('.progress-ring-circle');
const value = element.querySelector('.progress-value');
if (!circle || !value) return;

// Ensure percent is within valid range
const clampedPercent = clampValue(percent);
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
const offset = circumference - (clampedPercent / 100 * circumference);
circle.style.strokeDashoffset = offset;
// Display value with no decimal places
value.textContent = `${Math.round(clampedPercent)}%`;
}

// Update all progress bars with range validation
function updateAllProgress() {
requestAnimationFrame(() => {
setProgress(document.getElementById('hungryProgress'), hungerLevel);
setProgress(document.getElementById('energyProgress'), energyLevel);
setProgress(document.getElementById('happyProgress'), happinessLevel);
});
}

// Status update function with range validation
function updateStatus() {
hungerLevel = clampValue(hungerLevel + 0.2);
energyLevel = clampValue(energyLevel - 0.1);
happinessLevel = clampValue(happinessLevel - 0.2);
updateAllProgress();
checkCriticalLevels();
}


// Handle feeding with range validation
function handleFeeding() { 
if (hungerLevel >= MAX_LEVEL) {
showAlert("Pet is so hungry!");

return;
}

hungerLevel = clampValue(hungerLevel - 15);
energyLevel = clampValue(energyLevel + 10);
happinessLevel = clampValue(happinessLevel + 10);
updateAllProgress();
}

// Handle playing with range validation
function handlePlaying() {
if (energyLevel <= CRITICAL_LEVEL) {
showAlert('Your pet is too tired to play! Let them rest.');
return;
}

happinessLevel = clampValue(happinessLevel + 15);
energyLevel = clampValue(energyLevel - 10);
hungerLevel = clampValue(hungerLevel + 10);

updateAllProgress();
}

// Handle resting with range validation
function handleResting() {
if (energyLevel >= MAX_LEVEL) {
showAlert("Your pet is fully rested!");
return;
}

energyLevel = clampValue(energyLevel + 10);
hungerLevel = clampValue(hungerLevel + 5);
happinessLevel = clampValue(happinessLevel + 15);

updateAllProgress();
}

// Show alert popup
function showAlert(message) {
const popup = document.getElementById('alertPopup');
if (!popup) return;

const messageElement = document.getElementById('alertMessage');
if (messageElement) {
messageElement.textContent = message;
}
popup.classList.add('show');

// Auto-hide alert after 3 seconds
setTimeout(() => closeAlert(), 3000);
}

// Close alert popup
function closeAlert() {
const popup = document.getElementById('alertPopup');
if (popup) {
popup.classList.remove('show');
}
}

// Check critical levels
function checkCriticalLevels() {
if (hungerLevel >= HUNGRY_CRITICAL) {
showAlert('I am hungry! Please feed them.');
}
if (energyLevel <= CRITICAL_LEVEL) {
showAlert('I am so tired! They need to rest.');
}
if (happinessLevel <= CRITICAL_LEVEL) {
showAlert('I am sad! Play with them.');
}
}



// Event listeners for interactions
document.addEventListener('drop', (event) => {
event.preventDefault();
const petImage = document.getElementById('petImage');

if (event.target === petImage) {
handleFeeding();
}
});


// Add event listeners for the play and rest buttons
document.addEventListener('DOMContentLoaded', () => {
    const lightButton = document.getElementById('lightButton');
    if (lightButton) {
        // Remove the inline onclick to prevent conflicts
        lightButton.removeAttribute('onclick');
        // Add event listener
        lightButton.addEventListener('click', () => {
            toggleLight();
            handleResting();
        });
    }
});

// Make sure to clean up the interval when needed
window.addEventListener('beforeunload', () => {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
});

// Rest function with status update
function turnOffLight() {
const restSection = document.getElementById('restSection');
if (restSection) {
restSection.style.background = "#000";
restSection.style.color = "#666";
handleResting();
}
}

// Initialize game state
document.addEventListener('DOMContentLoaded', () => {
updateAllProgress();

statusInterval = setInterval(updateStatus, 1000);

const grid = document.getElementById('grid');
if (grid) {
grid.addEventListener('click', handleClick);
}

// Cleanup
window.addEventListener('beforeunload', () => {
if (statusInterval) {
    clearInterval(statusInterval);
}
});
});      // Initialize grid for the game
