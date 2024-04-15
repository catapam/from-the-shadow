/*jshint esversion: 6 */
/* Global Variables Definition */
let timerInterval;
let timeLeft = 5;
let timerElement = document.getElementById("timer");
let growthFactor = 1.2;
let currentEnemy;

/* Character stats and configurations */
let currentStats = {
    hero: {
        name: "",
        health: 100,
        mana: 50,
        xp: 1,
        level: 1,
        currentHealth: 1000,
        currentStrength: 1000,
        currentMana: 1000,
        currentXp: 1000
    },
    enemy: {
        name: "",
        health: 100,
        mana: 1,
        xp: 1,
        level: 1,
        currentHealth: 1000,
        currentStrength: 1000,
        currentMana: 1000,
        currentXp: 1000
    }
};

/* Game characters and animation configurations */
const character = [{
    name: "Hero",
    type: "hero",
    path: "hero",
    scream: "charge",
    strength: 1000,
    health: 1000,
    xp: 1000,
    mana: 1000,
    minManaMagic: 35,
    minManaCharge: 50,
    gifDuration: {
        "Attack_1.gif": 1000,
        "Attack_2.gif": 320,
        "Charge.gif": 960,
        "Dead.gif": 1500,
        "Fireball.gif": 1040,
        "Flame_jet.gif": 1040,
        "Hurt.gif": 750
    }
},
{
    name: "Gotoku",
    type: "enemy",
    path: "gotoku",
    strength: 1000,
    health: 1000,
    xp: 1000,
    mana: 1000,
    minManaMagic: 35,
    minManaCharge: 50,
    gifDuration: {
        "Attack_1.gif": 320,
        "Attack_2.gif": 320,
        "Attack_3.gif": 800,
        "Dead.gif": 1000,
        "Hurt.gif": 600,
        "Scream.gif": 1000
    }
},
{
    name: "Onrei",
    type: "enemy",
    path: "onrei",
    strength: 1000,
    health: 1000,
    xp: 1000,
    mana: 1000,
    minManaMagic: 35,
    minManaCharge: 50,
    gifDuration: {
        "Attack_1.gif": 1000,
        "Attack_2.gif": 800,
        "Attack_3.gif": 560,
        "Dead.gif": 1020,
        "Hurt.gif": 510,
        "Scream.gif": 560
    }
},
{
    name: "Yurei",
    type: "enemy",
    path: "yurei",
    strength: 1000,
    health: 1000,
    xp: 1000,
    mana: 1000,
    minManaMagic: 35,
    minManaCharge: 50,
    gifDuration: {
        "Attack_1.gif": 800,
        "Attack_2.gif": 800,
        "Attack_3.gif": 700,
        "Dead.gif": 800,
        "Hurt.gif": 750,
        "Scream.gif": 1320
    }
}];

let gifArray = ["assets/images/gotoku/Run.gif", "assets/images/gotoku/Idle.gif", "assets/images/hero/Run.gif", "assets/images/hero/Idle.gif", "assets/images/onrei/Run.gif", "assets/images/onrei/Idle.gif", "assets/images/yurei/Run.gif", "assets/images/yurei/Idle.gif"];

/* Add all gifs to gif array */
character.forEach(char => {
    Object.keys(char.gifDuration).forEach(gifName => {
        const fullPath = `assets/images/${char.path}/${gifName}`;
        gifArray.push(fullPath);
    });
});

/* Refresh positioning an pre-load all gifs */
preloadGifs(gifArray);
updatePosition("hero");
updatePosition("enemy");

/* Event Listeners for UI interactions */
setupEventListeners();

/* Functions */
/**
 * Function to preload GIF images for smoother animations.
 */
function preloadGifs(gifArray) {
    gifArray.forEach(gif => {
        const img = new Image();
        img.src = gif;
    });
}

/**
 * Update the visual position of characters based on viewport size.
 * Parameter: elementId is "hero" or "enemy"
 */
function updatePosition(elementId) {
    const element = document.getElementById(elementId);
    const viewportWidth = window.innerWidth;
    const elementWidth = element.offsetWidth;
    const position = ((viewportWidth / 2) - ((elementWidth) / 4));

    if (elementId === "hero") {
        element.style.right = `${position}px`;
    } else if (elementId === "enemy") {
        element.style.left = `${position}px`;
    }

    element.style.position = "fixed";
    element.style.bottom = "35vh";
    element.style.height = "30vh";
    element.style.zIndex = elementId === "hero" ? "2" : "1";
}

/**
 * Setup UI event listeners.
 */
function setupEventListeners() {
    window.addEventListener("resize", function () {
        updatePosition("hero");
        updatePosition("enemy");
    });

    document.addEventListener("DOMContentLoaded", function () {
        let infoButton = document.getElementById("info_button");
        let modal = document.getElementById("info_modal");
        let closeButton = document.getElementsByClassName("close")[0];
        let startButton = document.getElementById("start_button");
        let startArea = document.getElementById("start_area");
        let nameArea = document.getElementById("name");
        let body = document.body;
        let heroNameInput = document.getElementById("id");
        let fightButton = document.getElementById("fight_button");
        let actionButton = document.getElementsByClassName("btn-fight");

        infoButton.addEventListener("click", function () {
            modal.style.display = "flex";
        });

        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target.tagName.toLowerCase() === 'a') {
                return;
            }
            event.preventDefault();
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

        startButton.addEventListener("click", function () {
            startArea.style.display = "none";
            nameArea.style.display = "block";
            body.style.backgroundImage = "radial-gradient(circle at 85vw 35vh,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.50) 100%),url(assets/images/scenario/backgrounds/game_background_1.webp)";
            preloadGifs(gifArray);
        });

        heroNameInput.addEventListener("blur", function () {
            let inputName = heroNameInput.value;
            if (inputName) {
                heroNameInput.value = inputName.charAt(0).toUpperCase() + inputName.slice(1);
                currentStats.hero.name = heroNameInput.value;
            }
        });

        fightButton.addEventListener("click", function (event) {
            if (!heroNameInput.value.trim()) {
                event.preventDefault();
                alert("Please enter your Hero's Name.");
                heroNameInput.focus();
            } else {
                nameArea.style.display = "none";
                document.getElementById("fight_area").style.display = "flex";
                start();
            }
        });

        Array.from(actionButton).forEach(function (button) {
            button.addEventListener("click", function () {
                this.classList.add("btn-clicked");
                setTimeout(() => {
                    this.classList.remove("btn-clicked");
                }, 100);
            });
        });

        //Pause function
        timerElement.addEventListener('mouseenter', function () {
            timerElement.classList.add('hovering');
            timerElement.textContent = '||';
        });

        timerElement.addEventListener('mouseleave', function () {
            timerElement.classList.remove('hovering');
            timerElement.textContent = timeLeft;
        });

        document.getElementById("close-tutorial").addEventListener("click", function () {
            tutorialMode(false);
        });
    });
}

/**
 * Update all character stats and location accordingly
 */
function updateUI(elementId) {
    document.getElementsByClassName("health")[elementId === "hero" ? 0 : 1].style.width = `${currentStats[elementId].health}%`;
    document.getElementsByClassName("mana")[elementId === "hero" ? 0 : 1].style.width = `${currentStats[elementId].mana}%`;
    document.getElementsByClassName("xp")[elementId === "hero" ? 0 : 1].style.width = `${currentStats[elementId].xp}%`;
    document.getElementById(`${elementId}-level-value`).textContent = currentStats[elementId].level;
    document.getElementById(`${elementId}-name`).textContent = currentStats[elementId].name;
    let path = elementId === "hero" ? "hero" : currentEnemy;

    const magicButton = document.getElementById('magic');
    if (currentStats.hero.mana >= character.find(char => char.path === path).minManaMagic) {
        magicButton.disabled = false;
        magicButton.classList.remove('button-disabled');
    } else {
        magicButton.disabled = true;
        magicButton.classList.add('button-disabled');
    }

    // Charge button condition
    const chargeButton = document.getElementById('charge');
    if (currentStats.hero.mana >= character.find(char => char.path === path).minManaCharge) {
        chargeButton.disabled = false;
        chargeButton.classList.remove('button-disabled');
    } else {
        chargeButton.disabled = true;
        chargeButton.classList.add('button-disabled');
    }

    // Level-Up button condition
    const levelUpButton = document.getElementById('level-up');
    if (currentStats.hero.xp >= 100) {
        levelUpButton.disabled = false;
        levelUpButton.classList.remove('button-disabled');
    } else {
        levelUpButton.disabled = true;
        levelUpButton.classList.add('button-disabled');
    }
}

/**
 * Function to start the game.
 */
function start() {
    document.getElementById("enemy").style.display = "block";
    document.getElementById("hero").style.right = "100vw";
    document.getElementById("enemy").style.left = "100vw";

    document.getElementById("stats").style.display = "none";
    document.getElementById("control").style.display = "none";

    run("hero", "hero", "in");
    if (document.getElementById("round-value").textContent <= 1) {
        story();
    }
}

// Effetcs

/**
 * Runs the character into and out of the scene.
 * Parameters:
 * - elementId = "hero" or "enemy"
 * - path = caracter.path of selected hero/enemy
 * - direction = "in" or "out"
 */
function run(elementId, path, direction) {
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");
    let viewportWidth = window.innerWidth;
    let elementWidth = characterDiv.offsetWidth;
    characterImage.src = `assets/images/${path}/Run.gif`;
    let screenOverlay = document.getElementById('screen-overlay');
    let finalPosition, startPosition, duration = 1000;

    if (direction === "in") {
        finalPosition = ((viewportWidth / 2) - (elementWidth / 4));
        startPosition = viewportWidth;
    } else {
        screenOverlay.style.display = "block";
        characterDiv.style.zIndex = 201;
        startPosition = ((viewportWidth / 2) - (elementWidth / 4));
        finalPosition = elementWidth / 2;
        screenOverlay.style.transition = 'opacity 500ms ease-in-out';
        screenOverlay.style.opacity = 1;
        setTimeout(() => animate(), 0);
    }

    let start = null;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const timeFraction = progress / duration;
        const easeOut = 1 - Math.pow(1 - timeFraction, 2);
        let distance = finalPosition - (startPosition - viewportWidth) + (elementWidth / 4);
        let currentPos = easeOut * distance;

        if (elementId === "hero") {
            characterDiv.style.right = `${startPosition - currentPos}px`;
            if (direction === "out") {
                screenOverlay.style.opacity = Math.min(1, timeFraction);
            }
        } else {
            characterDiv.style.left = `${startPosition - currentPos}px`;
        }

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            if (direction === "in") {
                characterImage.src = `assets/images/${path}/Idle.gif`;
                updatePosition(elementId);
            } else if (direction === "out" && elementId === "hero") {
                screenOverlay.style.opacity = 1;
            }
        }
    }
    requestAnimationFrame(animate);
}

/**
 * Create overlay effect to use on enemy scream effect
 */
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "-10vh";
    overlay.style.left = "35vw";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundImage = "url('assets/images/scenario/scream.webp')";
    overlay.style.backgroundSize = "cover";
    overlay.style.backgroundPosition = "center";
    overlay.style.backgroundRepeat = "no-repeat";
    overlay.style.opacity = 0;
    document.body.appendChild(overlay);
    return overlay;
}

/**
 * Create scream effect
 */
function scream() {
    const overlay = createOverlay();
    let opacity = 0;
    const step = 0.001;
    const maxOpacity = 0.1;
    let increasing = true;

    const intervalId = setInterval(() => {
        if (increasing) {
            opacity += step;
            if (opacity >= maxOpacity) increasing = false;
        } else {
            opacity -= step;
            if (opacity <= 0) {
                clearInterval(intervalId);
                document.body.removeChild(overlay);
                return;
            }
        }

        overlay.style.opacity = opacity;
    }, 10);
}

// Dialog

/**
 * Manages the story modal and narrative progression.
 */
function story() {
    document.getElementById("story_modal").style.display = "flex";
    document.getElementById("round-value").textContent = 1;

    let stories = [
        "Wow! What is that big round shadow?",
        "Did you hear that scream?",
        "What is that coming out of the shadow?",
        "This is bad, I will have to protect the village!"
    ];
    let currentIndex = 0;

    document.getElementById("story").style.display = "flex";

    let heroNameInput = document.getElementById("id");

    let player = document.createElement("h4");
    let storyParagraph = document.createElement("p");
    let nextButton = document.createElement("button");
    nextButton.className = "close btn-next";
    nextButton.id = "next";
    nextButton.textContent = ">>";
    nextButton.style.color = "black";
    nextButton.style.width = "15%";
    nextButton.style.minWidth = "40px";
    nextButton.style.alignSelf = "Right";
    nextButton.style.marginLeft = "auto";

    player.className = "player-name";
    player.textContent = heroNameInput.value + ":";
    player.style.color = "Yellow";

    storyParagraph.textContent = stories[currentIndex];

    let storyContainer = document.getElementById("story");
    storyContainer.innerHTML = "";
    storyContainer.appendChild(player);
    storyContainer.appendChild(storyParagraph);
    storyContainer.appendChild(nextButton);

    nextButton.addEventListener("click", function () {
        if (currentIndex < stories.length - 2) {
            currentIndex++;
            storyParagraph.textContent = stories[currentIndex];
            if (currentIndex == 1) {
                scream();
            }
            if (currentIndex == 2) {
                enemyArrives();
            }
        } else {
            currentIndex++;
            storyParagraph.textContent = stories[currentIndex];
            nextButton.textContent = "x";
            nextButton.onclick = function () {
                document.getElementById("story").style.display = "none";
                document.getElementById("stats").style.display = "flex";
                updateUI("hero");
                document.getElementById("control").style.display = "flex";
                tutorialMode(true);
            };
        }
    });
}

/**
 * Toggles tutorial mode on or off.
 * Paramenter: enable = true or false
 */
function tutorialMode(enable) {
    const elements = document.getElementsByClassName("tutorial");

    if (enable) {
        timerElement.classList.remove("hidden");
        document.getElementById('tutorial-modal').classList.remove("hidden");
        document.getElementById('tutorial-modal').style.display = "flex";
        let formattedText = "<p>Click on an element to learn what it does...</p>";
        document.getElementById('tutorial-text').innerHTML = formattedText;
        document.getElementById('level-up').disabled = false;
        document.getElementById('level-up').classList.remove('button-disabled');

        Array.from(elements).forEach(element => {
            element.classList.add("pointer");
            element.onclick = function () {
                Array.from(elements).forEach(el => el.classList.remove("tutorial-clicked"));
                if (this.getAttribute('data-tutorial') !== null) {
                    formattedText = this.getAttribute('data-tutorial');
                } else {
                    formattedText = "<p>Click on an element to learn what it does...</p>";
                }
                document.getElementById('tutorial-text').innerHTML = formattedText;
                element.classList.add("tutorial-clicked");
            };
        });
    } else {
        document.getElementById('tutorial-modal').classList.add("hidden");
        document.getElementById('tutorial-modal').style.display = "none";
        Array.from(elements).forEach(element => {
            element.onclick = null;
            element.classList.remove("tutorial-clicked", "pointer");
        });

        timerElement.addEventListener("click", function () {
            timer("pause");
        });

        document.getElementById("attack").addEventListener("click", function () {
            attack("hero", "hero");
            document.getElementById("control").style.display = "none";
        });

        document.getElementById("magic").addEventListener("click", function () {
            document.getElementById("control").style.display = "none";
            magic("hero", "hero");
        });

        document.getElementById("charge").addEventListener("click", function () {
            document.getElementById("control").style.display = "none";
            charge("hero", "hero");
        });

        document.getElementById("level-up").addEventListener("click", function () {
            document.getElementById("control").style.display = "none";
            levelUp("hero");
        });

        updateUI("enemy");
        updateUI("hero");
    }
}

/**
 * Starts game over interaction
 */
function gameOver() {
    document.getElementById("control").style.display = "none";

    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "flex";

    document.getElementById("restart").addEventListener("click", function () {
        window.location.reload();
    });

    document.getElementById("continue").addEventListener("click", function () {
        document.getElementById("game-over-screen").style.display = "none";
        currentStats.hero.health = 100;
        document.getElementById("hero").classList.add('glow-once');
        document.getElementById("hero").querySelector("img").src = `assets/images/hero/Idle.gif`;
        updatePosition("hero");
        updateUI("hero");
        heroTurn();
    });
}

// Battle
/**
 * Choses a random enemy, update stats according to level and enemy selected, enemy run("in") is triggered
 */
function enemyArrives() {
    document.getElementById("enemy").style.display = "block";
    const enemies = character.filter(character => character.type === "enemy");
    const enemy = enemies[Math.floor(Math.random() * enemies.length)];
    const randomMana = Math.floor((Math.random() * 50)) + 1;
    const randomXP = Math.floor((Math.random() * 30)) + 1;
    const level = currentStats.hero.level;
    currentEnemy = enemy.path;
    currentStats.enemy.name = enemy.name;
    currentStats.enemy.health = 100;
    currentStats.enemy.mana = randomMana;
    currentStats.enemy.xp = randomXP;
    currentStats.enemy.level = level;

    if (level !== 1) {
        currentStats.enemy.currentHealth = (Math.pow(growthFactor, level)) * character.find(char => char.path === currentEnemy).health;
        currentStats.enemy.currentMana = (Math.pow(growthFactor, level)) * character.find(char => char.path === currentEnemy).mana;
        currentStats.enemy.currentXp = (Math.pow(1.5, level)) * character.find(char => char.path === currentEnemy).xp;
        currentStats.enemy.currentStrength = (Math.pow(growthFactor, level) * 1.05) * character.find(char => char.path === currentEnemy).strength;
    }

    updateUI("enemy");
    run("enemy", currentEnemy, "in");
}

/**
 * Initiate sword/normal attack
 * Parameters:
 * - elementId = "hero" or "enemy"
 * - path = character.path of selected character
 */
function attack(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");
    let attackType = Math.random() < 0.5 ? "Attack_1.gif" : "Attack_2.gif";
    characterImage.src = `assets/images/${characterObj.path}/${attackType}`;
    let gifDuration = characterObj.gifDuration[attackType];
    let strength = currentStats[`${elementId}`].currentStrength;
    let multiplier = attackType === "Attack_1.gif" ? 1 : 1.1;
    let damageScore = multiplier * strength;

    setTimeout(() => {
        characterImage.src = `assets/images/${characterObj.path}/Idle.gif`;
    }, gifDuration);
    damage(elementId, damageScore, "attack");

    if (elementId === "hero" && currentStats.enemy.health > 0) {
        timer("stop");
        setTimeout(enemyTurn, 1500);
    } else if (elementId === "enemy" && currentStats.hero.health <= 0) {
        timer("stop");
    } else {
        setTimeout(currentStats.hero.health > 0 ? heroTurn : timer("stop"), 1500);
    }
}

/**
 * Initiate magic attack
 * Parameters:
 * - elementId = "hero" or "enemy"
 * - path = character.path of selected character
 */
function magic(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");
    let cost = character.find(char => char.path === path).minManaCharge;
    let attackType;

    if (elementId === "hero") {
        attackType = Math.random() < 0.5 ? "Fireball.gif" : "Flame_jet.gif";
        mana(elementId, "decrease", cost / 100);
    } else {
        attackType = "Attack_3.gif";
        mana(elementId, "decrease", cost / 100);
    }

    characterImage.src = `assets/images/${characterObj.path}/${attackType}`;
    let gifDuration = characterObj.gifDuration[attackType];
    let strength = currentStats[`${elementId}`].currentStrength;
    let multiplier = (attackType === "Fireball.gif" ? 1.25 : 1.35);
    let damageScore = multiplier * strength;

    setTimeout(() => {
        characterImage.src = `assets/images/${characterObj.path}/Idle.gif`;
    }, gifDuration);

    if (elementId === "hero") {
        timer("stop");
        setTimeout(enemyTurn, 1500);
    } else if (elementId === "enemy") {
        setTimeout(heroTurn, 1500);
    }
    damage(elementId, damageScore, "magic");
}

/**
 * Initiate health recharge
 * Parameters:
 * - elementId = "hero" or "enemy"
 * - path = character.path of selected character
 */
function charge(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");
    let fileName = elementId === "hero" ? "Charge.gif" : "Scream.gif";
    let cost = character.find(char => char.path === path).minManaCharge;

    characterImage.src = `assets/images/${characterObj.path}/${fileName}`;
    let gifDuration = characterObj.gifDuration[fileName];

    setTimeout(() => {
        characterImage.src = `assets/images/${characterObj.path}/Idle.gif`;
    }, gifDuration);

    if (elementId === "enemy") {
        setTimeout(heroTurn, 1500);
        scream();
        health(elementId, "add", 0.5);
        mana(elementId, "decrease", cost / 100);
    } else {
        timer("stop");
        setTimeout(enemyTurn, 1500);
        health(elementId, "add", 0.5);
        mana(elementId, "decrease", cost / 100);
    }
}

/**
 * Level Up
 * Parameters:
 * - elementId = "hero" or "enemy"
 */
function levelUp(elementId) {
    let characterPath = elementId === "hero" ? "hero" : currentEnemy;
    currentStats[`${elementId}`].level += 1;
    const level = currentStats[`${elementId}`].level;
    currentStats[`${elementId}`].currentHealth = (Math.pow(growthFactor, level)) * character.find(char => char.path === characterPath).health;
    currentStats[`${elementId}`].currentMana = (Math.pow(growthFactor, level)) * character.find(char => char.path === characterPath).mana;
    currentStats[`${elementId}`].currentXp = (Math.pow(1.5, level)) * character.find(char => char.path === characterPath).xp;
    currentStats[`${elementId}`].currentStrength = (Math.pow(growthFactor, level) * 1.05) * character.find(char => char.path === characterPath).strength;

    document.getElementById(elementId).classList.add('glow-once');
    document.getElementById(elementId).addEventListener('animationend', () => {
        document.getElementById(elementId).classList.remove('glow-once');
    });

    currentStats[elementId].health = currentStats[elementId].health >= 50 ? 100 : currentStats[elementId].health + 50;
    if (currentStats[elementId].mana <= 50) {
        currentStats[elementId].mana = 50;
    }
    currentStats[elementId].xp = 1;
    updateUI(elementId);

    if (elementId === "hero") {
        timer("stop");
        setTimeout(enemyTurn, 1500);
    } else if (elementId === "enemy") {
        setTimeout(heroTurn, 1500);
    }
}

/**
 * Initiates hero turn
 */
function heroTurn() {
    if (currentStats.hero.health > 0) {
        document.getElementById("control").style.display = "flex";
        timer("start");
    } else {
        gameOver();
    }
}

/**
 * Initiates enemy turn
 */
function enemyTurn() {
    if (currentStats.enemy.health > 0 && currentStats.hero.health > 0) {
        document.getElementById("enemy").style.zIndex = "3";
        const action = AI();

        switch (action) {
            case 'attack':
                attack("enemy", currentEnemy);
                break;
            case 'magic':
                magic("enemy", currentEnemy);
                break;
            case 'charge':
                charge("enemy", currentEnemy);
                break;
            case 'levelUp':
                levelUp("enemy");
                break;
            default:
                console.log("Unknown action:", action);
        }

        document.getElementById("enemy").style.zIndex = "1";
    }
}

/**
 * Initiates hurt animation and reduces health
 * Parameters:
 * - elementId = "hero" or "enemy"
 * - value = value of damage received
 */
function hurt(elementId, value) {
    let elementDiv = document.getElementById(elementId);
    let elementImage = elementDiv.querySelector("img");
    let path = elementId === "hero" ? "hero" : currentEnemy;
    let opponent = elementId === "enemy" ? "hero" : "enemy";
    let totalHealth = (character.find(char => char.path === path).health * currentStats[opponent].level);
    let damageHealth = value / totalHealth;

    if (damageHealth < currentStats[elementId].health) {
        elementImage.src = `assets/images/${path}/Hurt.gif`;
        setTimeout(() => {
            elementImage.src = `assets/images/${path}/Idle.gif`;
            health(elementId, "decrease", damageHealth);
        }, character.find(char => char.path === path).gifDuration["Hurt.gif"]);
    } else {
        health(elementId, "decrease", damageHealth);
    }
}

/**
 * Initiates dead animation, stops timer and initiate gameOver()
 * Parameters:
 * - elementId = "hero" or "enemy"
 */
function dead(elementId) {
    let elementDiv = document.getElementById(elementId);
    let elementImage = elementDiv.querySelector("img");
    let path = elementId === "hero" ? "hero" : currentEnemy;

    elementImage.src = `assets/images/${path}/Dead.gif`;
    timer("stop");
    if (elementId === "hero") {
        gameOver();
    } else {
        setTimeout(() => {
            elementDiv.style.display = "none";
        }, character.find(char => char.path === path).gifDuration["Dead.gif"]);

        setTimeout(() => {
            nextRound();
        }, 1500);
    }
    document.getElementById("enemy").style.zIndex = "3";
}

/**
 * Intiates and calculates next round
 */
function nextRound() {
    document.getElementById("control").style.display = "none";
    document.getElementById("stats").style.display = "none";
    run("hero", "hero", "out");
    currentStats.hero.health = 100;
    currentStats.hero.xp = (currentStats.hero.xp += 20) > 100 ? 100 : (currentStats.hero.xp += 20);
    let round = parseInt(document.getElementById("round-value").textContent) + 1;
    document.getElementById("round-value").textContent = round;

    let randomBackgroundNumber = Math.floor(Math.random() * 8) + 1;
    let newBackgroundImage = `assets/images/scenario/backgrounds/game_background_${randomBackgroundNumber}.webp`;

    setTimeout(() => {
        newBackgroundImage.onload = function () {
            document.body.style.backgroundImage = `radial-gradient(circle at 85vw 35vh, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.50) 100%), url(${newBackgroundImage})`;
        };
        document.getElementById('screen-overlay').style.display = "none";
        setTimeout(() => {
            start();
            setTimeout(() => {
                enemyArrives();
                document.getElementById("control").style.display = "flex";
                document.getElementById("stats").style.display = "flex";
            }, 1000);
        }, 1000);
    }, 3000);
    updateUI("hero");
    updateUI("enemy");
}

// Data handling
/**
 * Calculate and updates scores
 * Parameters:
 * - value = value of damage caused
 */
function score(value) {
    let scoreElement = document.getElementById("score-value");
    let currentScore = parseInt(scoreElement.textContent) || 0;
    let round = parseInt(document.getElementById("round-value").textContent) || 1;
    let newScore = round * value;

    currentScore += newScore;
    scoreElement.textContent = currentScore;
}

/**
 * Manipulates the timer clock
 * Parameters:
 * - type = "start", "stop", "pause", "resume"
 */
function timer(type) {
    let totalTime = timeLeft;

    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("control").style.display = "none";
            timerElement.classList.add("hidden");
            if (type === "start" || type === "resume") {
                enemyTurn();
            }
        } else {
            if (!timerElement.classList.contains('hovering')) {
                timerElement.textContent = timeLeft;
            }
        }
    }

    if (type === "start") {
        timeLeft = 5;
        clearInterval(timerInterval);
        timerElement.classList.remove("hidden");
        if (!timerElement.classList.contains('hovering')) {
            timerElement.textContent = timeLeft;
        }
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
        }, 1000);
    } else if (type === "stop") {
        clearInterval(timerInterval);
        document.getElementById("control").style.display = "none";
        timerElement.classList.add("hidden");
        timerElement.textContent = totalTime;
    } else if (type === "pause") {
        clearInterval(timerInterval);
        document.getElementById("pause-screen").style.display = "flex";
        timerElement.textContent = timeLeft;

        document.getElementById("unpause").addEventListener("click", function () {
            document.getElementById("pause-screen").style.display = "none";
            timer("resume");
        });

        document.getElementById("give-up").addEventListener("click", function () {
            window.location.reload();
        });
    } else if (type === "resume") {
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
        }, 1000);
    }
}

// Game calculations
/**
 * Calculates the damage
 * Parameters:
 * - elemntId = value of character causing damage. "hero" or "enemy"
 * - attack = value of attack calculated
 * - type = "attack" or "magic"
 */
function damage(elementId, attack, type) {
    let randomFrequency = Math.random();
    let multiplier;

    if (randomFrequency < 0.02) {
        multiplier = 0;
    } else if (randomFrequency < 0.3) {
        multiplier = 0.7;
    } else if (randomFrequency < 0.9) {
        multiplier = 0.4 + (Math.random() * 0.1);
    } else {
        multiplier = 0.6;
    }

    let defense = (currentStats[`${elementId === "hero" ? "enemy" : "hero"}`].currentStrength) * multiplier;
    let rawDamage = attack - defense;
    let totalDamage = rawDamage > 0 ? Math.round(rawDamage * multiplier) : 0;

    let p = document.getElementById(elementId === "hero" ? "enemy-damage" : "hero-damage");
    p.style.opacity = 1;
    p.textContent = totalDamage > 0 ? totalDamage : "miss";

    hurt(elementId === "hero" ? "enemy" : "hero", totalDamage);

    let xpGainForAttacker = ((totalDamage * (totalDamage / currentStats[`${elementId === "hero" ? "enemy" : "hero"}`].currentStrength)) / currentStats[`${elementId === "hero" ? "hero" : "enemy"}`].currentHealth) / 2;
    let xpGainForDefender = xpGainForAttacker / 2;

    xp(elementId, "add", xpGainForAttacker);
    xp(elementId === "hero" ? "enemy" : "hero", "add", xpGainForDefender);

    if (type === "attack") {
        mana(elementId, "add", (totalDamage / currentStats[`${elementId === "hero" ? "hero" : "enemy"}`].currentHealth) / 2);
    }

    if (elementId === "hero") {
        score(totalDamage);
    }

    setTimeout(() => {
        p.style.opacity = 0;
    }, 1000);
}

/**
 * Manipulates health
 * Parameters:
 * - elemntId = "hero" or "enemy"
 * - type = "add" or "decrease"
 * - size = between 0 and 1 (it will be multipled by 100 for %)
 */
function health(elementId, type, size) {
    let currentWidth = currentStats[elementId].health;
    let newWidth;

    if (type === "add") {
        newWidth = currentWidth + (size * 100);
        if (newWidth > 100) {
            newWidth = 100;
        }
        currentStats[elementId].health = newWidth;
        updateUI(elementId);
    } else if (type === "decrease") {
        newWidth = (currentWidth - (size * 100)) > 0 ? (currentWidth - (size * 100)) : 0;
        currentStats[elementId].health = newWidth;
        updateUI(elementId);
        if (newWidth <= 0) {
            dead(elementId);
        }
    }
}

/**
 * Manipulates mana
 * Parameters:
 * - elemntId = "hero" or "enemy"
 * - type = "add" or "decrease"
 * - size = between 0 and 1 (it will be multipled by 100 for %)
 */
function mana(elementId, type, size) {
    let currentWidth = currentStats[elementId].mana;
    let newWidth;

    if (type === "add") {
        newWidth = currentWidth + (size * 100);
        if (newWidth > 100) {
            newWidth = 100;
        }
        currentStats[elementId].mana = newWidth;
        updateUI(elementId);
    } else if (type === "decrease") {
        newWidth = (currentWidth - (size * 100)) > 1 ? (currentWidth - (size * 100)) : 1;
        currentStats[elementId].mana = newWidth;
        updateUI(elementId);
    }
}

/**
 * Manipulates experience/XP
 * Parameters:
 * - elemntId = "hero" or "enemy"
 * - type = "add" or "decrease"
 * - size = between 0 and 1 (it will be multipled by 100 for %)
 */
function xp(elementId, type, size) {
    let currentWidth = currentStats[elementId].xp;
    let newWidth;

    if (type === "add") {
        newWidth = currentWidth + (size * 100);
        if (newWidth > 100) {
            newWidth = 100;
        }
        currentStats[elementId].xp = newWidth;
        updateUI(elementId);
    } else if (type === "decrease") {
        newWidth = (currentWidth - (size * 100)) > 1 ? (currentWidth - (size * 100)) : 1;
        currentStats[elementId].xp = newWidth;
        updateUI(elementId);
    }
}

/**
 * Enemy's decision making AI
 */
function AI() {
    const enemyHealth = currentStats.enemy.health;
    const enemyMana = currentStats.enemy.mana;
    const heroHealth = currentStats.hero.health;
    let availableActions = ['attack', 'attack', 'attack', 'attack', 'attack', 'attack'];

    if (currentStats.enemy.xp >= 100) {
        availableActions.push('levelUp', 'levelUp', 'levelUp', 'levelUp');
    }

    if (enemyMana >= character.find(char => char.path === currentEnemy).minManaMagic) {
        availableActions.push('magic', 'magic', 'magic');
        if (heroHealth < 50) {
            availableActions.push('magic');
        }
        if (heroHealth < 20) {
            availableActions.push('magic', 'magic');
        }
    }

    if (enemyMana >= character.find(char => char.path === currentEnemy).minManaCharge && enemyHealth < 75) {
        availableActions.push('charge', 'charge');
        if (enemyHealth < 25) {
            availableActions.push('charge', 'charge');
        }
        if (enemyHealth < 15) {
            availableActions.push('charge', 'charge', 'charge');
        }
    }

    const randomIndex = Math.floor(Math.random() * availableActions.length);
    return availableActions[randomIndex];
}