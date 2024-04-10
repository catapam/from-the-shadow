let timerInterval;
let currentEnemy;
let currentStats = {
    hero: {
        name: "",
        health: 100,
        mana: 1,
        xp: 1,
        level: 1
    },
    enemy: {
        name: "",
        health: 100,
        mana: 1,
        xp: 1,
        level: 1
    }
};

let character = [{
    name: "Hero",
    type: "hero",
    path: "hero",
    scream: "charge",
    strength: 150,
    health: 1000,
    xp: 1000,
    mana: 500,
    minManaMagic: 20,
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
    strength: 160,
    health: 1100,
    xp: 1100,
    mana: 500,
    minManaMagic: 15,
    minManaCharge: 40,
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
    strength: 170,
    health: 800,
    xp: 800,
    mana: 500,
    minManaMagic: 20,
    minManaCharge: 20,
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
    strength: 140,
    health: 1100,
    xp: 800,
    mana: 200,
    minManaMagic: 20,
    minManaCharge: 20,
    gifDuration: {
        "Attack_1.gif": 800,
        "Attack_2.gif": 800,
        "Attack_3.gif": 700,
        "Dead.gif": 800,
        "Hurt.gif": 750,
        "Scream.gif": 1320
    }
}]

let gifArray = ["assets/images/gotoku/Run.gif", "assets/images/gotoku/Idle.gif", "assets/images/hero/Run.gif", "assets/images/hero/Idle.gif", "assets/images/onrei/Run.gif", "assets/images/onrei/Idle.gif", "assets/images/yurei/Run.gif", "assets/images/yurei/Idle.gif"];

character.forEach(char => {
    Object.keys(char.gifDuration).forEach(gifName => {
        const fullPath = `assets/images/${char.path}/${gifName}`;
        gifArray.push(fullPath);
    });
});

updatePosition("hero");
updatePosition("enemy");
window.addEventListener("resize", function () {
    updatePosition("hero");
    updatePosition("enemy");
});

document.addEventListener("DOMContentLoaded", function () {
    var infoButton = document.getElementById("info_button");
    var modal = document.getElementById("info_modal");
    var closeButton = document.getElementsByClassName("close")[0];
    var startButton = document.getElementById("start_button");
    var startArea = document.getElementById("start_area");
    var nameArea = document.getElementById("name");
    var body = document.body;
    var heroNameInput = document.getElementById("id");
    var fightButton = document.getElementById("fight_button");
    var actionButton = document.getElementsByClassName("btn-fight");

    infoButton.addEventListener("click", function () {
        modal.style.display = "block";
    });

    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
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
        var inputName = heroNameInput.value;
        if (inputName) {
            heroNameInput.value = inputName.charAt(0).toUpperCase() + inputName.slice(1);
            currentStats["hero"].name = heroNameInput.value;
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

    document.getElementById("attack").addEventListener("click", function () {
        attack("hero", "hero");
        document.getElementById("control").style.display = "none";
        score("time", document.getElementById("timer").textContent);
    });

    document.getElementById("magic").addEventListener("click", function () {
        document.getElementById("control").style.display = "none";
        score("time", document.getElementById("timer").textContent);
        magic("hero", "hero");
    });

    document.getElementById("charge").addEventListener("click", function () {
        document.getElementById("control").style.display = "none";
        score("time", document.getElementById("timer").textContent);
        charge("hero", "hero");
    });

    document.getElementById("level-up").addEventListener("click", function () {
        document.getElementById("control").style.display = "none";
        score("time", document.getElementById("timer").textContent);
        levelUp("hero");
    });
});

function preloadGifs(gifArray) {
    gifArray.forEach(gif => {
        const img = new Image();
        img.src = gif;
    });
}

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

function start() {
    document.getElementById("enemy").style.display = "block";
    document.getElementById("hero").style.right = "100vw";
    document.getElementById("enemy").style.left = "100vw";

    document.getElementById("stats").style.display = "none";
    document.getElementById("control").style.display = "none";

    runIn("hero", "hero");
    tutorial();
}

function runIn(elementId, path) {
    var characterDiv = document.getElementById(elementId);
    var characterImage = characterDiv.querySelector("img");
    var viewportWidth = window.innerWidth;
    var elementWidth = characterDiv.offsetWidth;
    characterImage.src = `assets/images/${path}/Run.gif`;

    var finalPosition = ((viewportWidth / 2) - (elementWidth / 4));
    var startPosition = viewportWidth;

    let start = null;
    const duration = 800;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const timeFraction = progress / duration;
        const easeOut = 1 - Math.pow(1 - timeFraction, 2);
        var distance = finalPosition - (startPosition - viewportWidth) + (elementWidth / 4);
        var currentPos = easeOut * distance;

        if (elementId === "hero") {
            characterDiv.style.right = `${startPosition - currentPos}px`;
        } else {
            characterDiv.style.left = `${startPosition - currentPos}px`;
        }
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            characterImage.src = `assets/images/${path}/Idle.gif`;
            updatePosition(elementId);
        }
    }

    requestAnimationFrame(animate);
};

function tutorial() {
    document.getElementById("tutorial_modal").style.display = "block";

    let stories = [
        "Wow! What is that big round shadow?",
        "Did you hear that scream?",
        "What is that coming out of the shadow?",
        "This is bad, I will have to protect the village!"
    ];
    let currentIndex = 0;

    document.getElementById("story").style.display = "block";

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
                scream()
            }
            if (currentIndex == 2) {
                enemyArrives()
            }
        } else {
            currentIndex++;
            storyParagraph.textContent = stories[currentIndex];
            nextButton.textContent = "x";
            nextButton.onclick = function () {
                document.getElementById("story").style.display = "none";
                document.getElementById("stats").style.display = "flex";
                updateUI("hero");
                // document.getElementById("tutorial-stats").style.display = "block";
                //add details about stats, and hide the modal again once the close button is clicked>
                // document.getElementById("tutorial-stats").style.display = "none";

                //add timer details:
                // document.getElementById("tutorial-stats").style.display = "block";

                document.getElementById("control").style.display = "flex";
                // document.getElementById("tutorial-controls").style.display = "block";
                //add details about controls, and hide the modal again once the close button is clicked>
                // document.getElementById("tutorial-controls").style.display = "none";
                timer("start");
            };
        }
    });
}

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

function enemyArrives() {
    document.getElementById("enemy").style.display = "block";
    const enemies = character.filter(character => character.type === "enemy");
    const enemy = enemies[Math.floor(Math.random() * enemies.length)]
    const randomMana = Math.floor((Math.random() * 99)-50) + 1;
    const randomXP = Math.floor((Math.random() * 99)-50) + 1;
    currentEnemy = enemy.path;
    currentStats["enemy"].name = enemy.name;
    currentStats["enemy"].health = 100;
    currentStats["enemy"].mana = randomMana;
    currentStats["enemy"].xp = randomXP;
    currentStats["enemy"].level = currentStats["hero"].level;

    updateUI("enemy");
    runIn("enemy", currentEnemy);
}

function attack(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");
    let attackType = Math.random() < 0.5 ? "Attack_1.gif" : "Attack_2.gif";
    characterImage.src = `assets/images/${characterObj.path}/${attackType}`;
    let gifDuration = characterObj.gifDuration[attackType];
    let strength = characterObj.strength;
    let multiplier = attackType === "Attack_1.gif" ? 1 : 1.2;
    let damageScore = multiplier * strength;

    setTimeout(() => {
        characterImage.src = `assets/images/${characterObj.path}/Idle.gif`;
    }, gifDuration);
    damage(elementId, damageScore);

    if (elementId === "hero" && currentStats.enemy.health > 0) {
        timer("stop");
        //score timer
        setTimeout(enemyTurn, 1500);
    } else if (elementId === "enemy" && currentStats.hero.health <= 0) {
        timer("stop");
    } else {
        // setTimeout(heroTurn, 1500);
        setTimeout(currentStats.hero.health > 0 ? heroTurn : timer("stop"), 1500);
    }
}

function magic(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");
    let cost = character.find(char => char.path === path).minManaCharge;

    if (elementId === "hero") {
        var attackType = Math.random() < 0.5 ? "Fireball.gif" : "Flame_jet.gif";
        mana(elementId, "decrease", cost);
    } else {
        var attackType = "Attack_3.gif";
        mana(elementId, "decrease", cost);
    }

    characterImage.src = `assets/images/${characterObj.path}/${attackType}`;
    let gifDuration = characterObj.gifDuration[attackType];
    let strength = characterObj.strength;
    let multiplier = attackType === "Flame_jet.gif" ? 3 : 2.5;
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
    damage(elementId, damageScore);
};

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
        health(elementId, "add", "0.5");
        mana(elementId, "decrease", cost);
    } else {
        let scoreValue = currentStats.hero.health <= 50 ? (0.5 * characterObj.health * currentStats.hero.level) + (0.2 * characterObj.mana * currentStats.hero.level) : ((100 - currentStats.hero.health) * characterObj.health * currentStats.hero.level) + (0.2 * characterObj.mana * currentStats.hero.level);
        timer("stop");
        setTimeout(enemyTurn, 1500);
        health(elementId, "add", "0.5");
        mana(elementId, "decrease", cost);
        score("charge", scoreValue);
    }
};

function levelUp(elementId) {
    let characterPath = elementId === "hero" ? "hero" : currentEnemy;
    character.find(char => char.path === characterPath).health *= 1.1
    character.find(char => char.path === characterPath).mana *= 1.05
    character.find(char => char.path === characterPath).xp *= 1.2
    character.find(char => char.path === characterPath).strength *= 1.1
    document.getElementById(elementId).classList.add('glow-once'); 
    score("levelUp", (currentStats[elementId].level));
    document.getElementById(elementId).addEventListener('animationend', () => {
        document.getElementById(elementId).classList.remove('glow-once');
    });

    currentStats[elementId].health = currentStats[elementId].health >= 50 ? 100 : currentStats[elementId].health + 50;
    currentStats[elementId].level += 1;
    if (currentStats[elementId].mana < 50) {
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
};

function score(type, value) {
    let scoreElement = document.getElementById("score-value");
    let currentScore = parseInt(scoreElement.textContent) || 0;
    let roundElement = document.getElementById("round-value");
    let round = parseInt(roundElement.textContent) || 1;
    let newScore = 0;
    let multiplier = 10;

    if (type === "time" || type === "levelUp" || type === "round") {
        // next round: new round x 10 (pass value as 1)
        newScore = Math.round(value * round * multiplier);
        currentScore += newScore;
        scoreElement.textContent = currentScore;
    } else if (type === "damage" || type === "kill") {
        newScore = Math.round(value * (1 + (round / multiplier)));
        currentScore += newScore;
        scoreElement.textContent = currentScore;
    } else if (type === "charge") {
        currentScore += Math.round(value);
        scoreElement.textContent = currentScore;
    } else if (type === "defence") {
        newScore = Math.round(value * (1 + (round / multiplier))) > 0 ? Math.round(value * (1 + (round / multiplier))) : 0;
        currentScore += newScore;
        scoreElement.textContent = currentScore;
    }

    console.log(`score update, action: ${type} , size: ${newScore} `);
};

function timer(type) {
    const timerElement = document.getElementById("timer");
    let totalTime = 5;
    let timeLeft = totalTime;

    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("control").style.display = "none";
            timerElement.classList.add("hidden");
            if (type === "start") {
                enemyTurn();
            }
        } else {
            timerElement.textContent = timeLeft;
        }
    }

    if (type === "start") {
        clearInterval(timerInterval);
        timerElement.classList.remove("hidden");
        timerElement.textContent = timeLeft;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimer();
        }, 1000);
    } else if (type === "stop") {
        clearInterval(timerInterval);
        document.getElementById("control").style.display = "none";
        timerElement.classList.add("hidden");
        timerElement.textContent = totalTime;
    }
};

function damage(elementId, attack) {
    let randomFrequency = Math.random();
    let random = Math.random();
    let ownLevel = elementId === "hero" ? currentStats.hero.level : currentStats.enemy.level;
    let enemyLevel = elementId === "enemy" ? currentStats.hero.level : currentStats.enemy.level;

    let multiplier;
    if (randomFrequency < 0.9) {
        multiplier = 0.5 + (random * 0.5);
    } else {
        multiplier = random * 0.5;
    }

    let totalDamage = Math.round(attack * multiplier * (1+(ownLevel*0.1)));
    let enemyStrength = elementId === "hero" ? character.find(char => char.name === currentStats.enemy.name).strength : character.find(char => char.name === "Hero").strength;
    let scoreDamage = ((enemyStrength * enemyLevel) - totalDamage);

    let p;
    if (elementId === "hero") {
        p = document.getElementById("enemy-damage");
        p.style.opacity = 1;
        p.textContent = totalDamage;

        hurt("enemy", totalDamage);
        xp("enemy", "add", totalDamage / (character.find(char => char.path === currentEnemy).strength * 30));
        score("damage", totalDamage);
    } else if (elementId === "enemy") {
        p = document.getElementById("hero-damage");
        p.style.opacity = 1;
        p.textContent = totalDamage;

        hurt("hero", totalDamage);
        xp("hero", "add", totalDamage / (character.find(char => char.path === "hero").strength * 30));
        score("defence", scoreDamage);
    };

    let ownCharacter = character.find(char => char.path === (elementId === "hero" ? "hero" : currentEnemy));
    xp(elementId, "add", (totalDamage / ownCharacter.xp)*0.7);
    mana(elementId, "add", (totalDamage / ownCharacter.mana) * 0.5);

    setTimeout(() => {
        p.style.opacity = 0;
    }, 1000);
};

function health(elementId, type, size) {
    var currentWidth = currentStats[elementId].health;

    if (type === "add") {
        var newWidth = currentWidth + (size * 100);
        if (newWidth > 100) {
            newWidth = 100;
        }
        currentStats[elementId].health = newWidth;
        updateUI(elementId);
    } else if (type === "decrease") {
        var newWidth = (currentWidth - (size * 100)) > 0 ? (currentWidth - (size * 100)) : 0;
        currentStats[elementId].health = newWidth;
        updateUI(elementId);
        if (newWidth <= 0) {
            dead(elementId);
        }
    }
};

function mana(elementId, type, size) {
    var currentWidth = currentStats[elementId].mana;

    if (type === "add") {
        var newWidth = currentWidth + (size * 100);
        if (newWidth > 100) {
            newWidth = 100;
        }
        currentStats[elementId].mana = newWidth;
        updateUI(elementId);
    } else if (type === "decrease") {
        var newWidth = (currentWidth - (size * 100)) > 1 ? (currentWidth - (size * 100)) : 1;
        currentStats[elementId].mana = newWidth;
        updateUI(elementId);
    }
};

function xp(elementId, type, size) {
    var currentWidth = currentStats[elementId].xp;

    if (type === "add") {
        var newWidth = currentWidth + (size * 100);
        if (newWidth > 100) {
            newWidth = 100;
        }
        currentStats[elementId].xp = newWidth;
        updateUI(elementId);
    } else if (type === "decrease") {
        var newWidth = (currentWidth - (size * 100)) > 1 ? (currentWidth - (size * 100)) : 1;
        currentStats[elementId].xp = newWidth;
        updateUI(elementId);
    }
};

function heroTurn() {
    if (currentStats["hero"].health > 0) {
        document.getElementById("control").style.display = "flex";
        timer("start");
    } else {
        gameOver();
    }
};

function hurt(elementId, value) {
    let elementDiv = document.getElementById(elementId);
    let elementImage = elementDiv.querySelector("img");
    let path = elementId === "hero" ? "hero" : currentEnemy;
    let damageHealth = value / (character.find(char => char.path === path).health);

    if (damageHealth < currentStats[elementId].health) {
        elementImage.src = `assets/images/${path}/Hurt.gif`;
        setTimeout(() => {
            elementImage.src = `assets/images/${path}/Idle.gif`;
            health(elementId, "decrease", damageHealth);
        }, character.find(char => char.path === path).gifDuration["Hurt.gif"]);
    } else {
        health(elementId, "decrease", damageHealth);
    }
};

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
        let health = character.find(char => char.path === path).health;
        score("kill", health);
        nextRound();
    }
    document.getElementById("enemy").style.zIndex = "3";
};

function preloadGifs(gifArray) {
    gifArray.forEach(gif => {
        const img = new Image();
        img.src = gif;
    });
};

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
};

function gameOver() {
    document.getElementById("control").style.display = "none";

    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "block";
};

function enemyTurn() {
    if (currentStats["enemy"].health > 0 && currentStats["hero"].health > 0) {
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
};

function AI() {
    const enemyHealth = currentStats.enemy.health;
    const enemyMana = currentStats.enemy.mana;
    const heroHealth = currentStats.hero.health;
    let availableActions = ['attack', 'attack', 'attack', 'attack','attack', 'attack']; 

    if (currentStats.enemy.xp >= 100) {
        availableActions.push('levelUp', 'levelUp', 'levelUp', 'levelUp');
    }

    if (enemyMana >= character.find(char => char.path === currentEnemy).minManaMagic) {
        availableActions.push('magic','magic','magic');
        if (heroHealth < 20){
            availableActions.push('magic','magic');
        }
    }

    if (enemyMana >= character.find(char => char.path === currentEnemy).minManaCharge) {
        availableActions.push('charge');
        if (enemyHealth < 30){
            availableActions.push('charge','charge','charge');
        }
    }

    const randomIndex = Math.floor(Math.random() * availableActions.length);
    return availableActions[randomIndex];
}

function nextRound() {
    //run out
    //new background selection
    //new enemy selected
    //previous hero stats are kept, health is full restored
    // all enemy stats are restored
    // keep score, update round number to 
};

// would like:
// review tutoril adding more info and details
// background change
// add more enemies
// comment codes
// readme
// add effects for level-up (hero and enemy)
// optimize code execution and structure
// review what is broken on score, something makes it go really high sometimes, added console.log to follow it when it happens again
// check animations to see if they can be delayed starting to make more sense (Dead.Gif is fixed already)