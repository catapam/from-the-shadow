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
        mana: 500,
        xp: 0,
        level: 1
    }
};
let character = [{
    name: "Hero",
    type: "hero",
    path: "hero",
    scream: "charge",
    strength: "100",
    totalHealth: "500",
    xp: "500",
    mana: "500",
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
    scream: "charge",
    strength: "100",
    totalHealth: "500",
    xp: "500",
    mana: "500",
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
    scream: "charge",
    strength: "100",
    totalHealth: "500",
    xp: "500",
    mana: "500",
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
    scream: "charge",
    strength: "100",
    totalHealth: "500",
    xp: "500",
    mana: "500",
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

updatePosition("hero", "hero");
updatePosition("enemy");
window.addEventListener("resize", function () {
    updatePosition("hero", "hero");
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
            document.getElementById("hero-name").textContent = heroNameInput.value;
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

    document.getElementById("control").addEventListener("click", function () {
        document.getElementById("control").style.display = "none";
    });

    document.getElementById("attack").addEventListener("click", function () {
        attack("hero", "hero");
    });

    document.getElementById("magic").addEventListener("click", function () {
        magic("hero", "hero");
    });

    document.getElementById("charge").addEventListener("click", function () {
        charge("hero", "hero");
    });

    document.getElementById("level-up").addEventListener("click", function () {
        levelUp("hero", "hero");
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

    run("hero", "hero");
    tutorial();
}

function run(elementId, name) {
    var characterDiv = document.getElementById(elementId);
    var characterImage = characterDiv.querySelector("img");
    var viewportWidth = window.innerWidth;
    var elementWidth = characterDiv.offsetWidth;
    characterImage.src = `assets/images/${name}/Run.gif`;

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
            characterImage.src = `assets/images/${name}/Idle.gif`;
            updatePosition(elementId);
        }
    }

    requestAnimationFrame(animate);
}

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
                if (!document.getElementById("hero-health").style.width) {
                    document.getElementById("hero-health").style.width = "100%"; 
                };
                if (!document.getElementById("hero-mana").style.width) {
                    document.getElementById("hero-mana").style.width = "1%"; 
                };
                if (!document.getElementById("hero-xp").style.width) {
                    document.getElementById("hero-xp").style.width = "1%"; 
                };
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
    currentEnemy = enemy.path;

    const randomMana = Math.floor(Math.random() * 99) + 1;
    const randomXP = Math.floor(Math.random() * 99) + 1;
    const randomHealth = 100;
    document.getElementById("enemy-mana").style.width = randomMana + '%';
    document.getElementById("enemy-xp").style.width = randomXP + '%';
    document.getElementById("enemy-health").style.width = randomHealth + '%';

    document.getElementById("enemy-level-value").textContent = document.getElementById("hero-level-value").textContent;
    document.getElementById("enemy-name").textContent = enemy.name;
    run("enemy", currentEnemy);
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

    if (elementId === "hero") {
        timer("stop");
        setTimeout(enemyTurn, 1500);
    } else if (elementId === "enemy") {
        setTimeout(heroTurn, 1500);
    }
}

function magic(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector("img");

    if (elementId === "hero") {
        var attackType = Math.random() < 0.5 ? "Fireball.gif" : "Flame_jet.gif";
        mana(elementId, "decrease", "0.6")
    } else {
        var attackType = "Attack_3.gif";
        mana(elementId, "decrease", "0.4")
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

    characterImage.src = `assets/images/${characterObj.path}/${fileName}`;
    let gifDuration = characterObj.gifDuration[fileName];

    setTimeout(() => {
        characterImage.src = `assets/images/${characterObj.path}/Idle.gif`;
    }, gifDuration);

    if (elementId === "enemy") {
        setTimeout(heroTurn, 1500);
        scream();
        health(elementId, "add", "0.6");
        mana(elementId, "decrease", "0.15");
    } else {
        let level = document.getElementById("hero-level-value").textContent;
        let scoreValue = (0.5 * characterObj.totalHealth * level) + (0.2 * characterObj.mana * level);
        timer("stop");
        setTimeout(enemyTurn, 1500);
        health(elementId, "add", "0.5");
        mana(elementId, "decrease", "0.2");
        score("charge",scoreValue);
    }
};

function levelUp(elementId) {
    // full health and mana restore
    // previous health x 1,1
    // previous mana x 1,05
    // previous xp x 1,2
    // previous strenght x 1,1
};

function nextRound() {
    //run out
    //new background selection
    //new enemy selected
    //previous hero stats are kept, health is full restored
    // all enemy stats are restored
    // keep score, update round number to 
};

function score(type, value) {
    let scoreElement = document.getElementById("score-value");
    let currentScore = parseInt(scoreElement.textContent) || 0;
    let roundElement = document.getElementById("round-value");
    let round = parseInt(roundElement.textContent) || 1;
    let newScore = 0;
    let multiplier = 10;

    if (type === "time" || type === "levelUp" || type === "round") {
        // time: time left on turn x round x 10
        // level-up: new level x round x 10
        // next round: new round x 10 (pass value as 1)
        newScore = Math.round(value * round * multiplier);
        currentScore += newScore;
        scoreElement.textContent = currentScore;
    } else if (type === "damage" || type === "kill" || type === "defence") {
        newScore = Math.round(value * (1 + (round / multiplier)));
        currentScore += newScore;
        scoreElement.textContent = currentScore;
    } else if (type === "charge") {
        currentScore += Math.round(value);
        scoreElement.textContent = currentScore;
    };
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
    let ownLevel = elementId === "hero" ? parseInt(document.getElementById("hero-level-value").textContent) : parseInt(document.getElementById("enemy-level-value").textContent);
    let enemyLevel = elementId === "enemy" ? parseInt(document.getElementById("hero-level-value").textContent) : parseInt(document.getElementById("enemy-level-value").textContent);

    let multiplier;
    if (randomFrequency < 0.9) {5
        multiplier = 0.5 + (random * 0.5);
    } else {
        multiplier = random * 0.5; 
    }

    let totalDamage = Math.round(attack * multiplier * ownLevel);
    let enemyStrength = character.find(char => char.name === document.getElementById("enemy-name").textContent).strength;
    let scoreDamage = ((enemyStrength * enemyLevel) - totalDamage);

    let p;
    if (elementId === "hero") {
        p = document.getElementById("enemy-damage");
        p.style.opacity = 1;
        p.textContent = totalDamage;

        hurt("enemy", totalDamage);
        score("damage", totalDamage);
    } else if (elementId === "enemy") {
        p = document.getElementById("hero-damage");
        p.style.opacity = 1;
        p.textContent = totalDamage;

        hurt("hero", totalDamage);
        score("defence", scoreDamage);
    };

    let ownCharacter = character.find(char => char.path === (elementId === "hero" ? "hero" : currentEnemy));
    xp(elementId, "add", totalDamage / ownCharacter.xp);
    mana(elementId, "add", (totalDamage / ownCharacter.mana) * 0.1);

    setTimeout(() => {
        p.style.opacity = 0;
    }, 1000);
};

function health(elementId, type, size) {
    var healthBar = document.getElementById(`${elementId}-health`);
    var currentWidth = parseFloat(healthBar.style.width);

    if (type === "add") {
        var newWidth = currentWidth + (size * 100);
        if (newWidth > 100){
            newWidth = 100;
        }
        healthBar.style.width = `${newWidth}%`;
    } else if (type === "decrease") {
        var newWidth = (currentWidth - (size * 100))>0 ? (currentWidth - (size * 100)):0;
        healthBar.style.width = `${newWidth}%`;
        if (newWidth <= 0){
            dead(elementId);
        }
    }
};

function mana(elementId, type, size) {
    var manaBar = document.getElementById(`${elementId}-mana`);
    var currentWidth = parseFloat(manaBar.style.width);

    if (type === "add") {
        var newWidth = currentWidth + (size * 100);
        if (newWidth > 100){
            newWidth = 100;
        }
        manaBar.style.width = `${newWidth}%`;
    } else if (type === "decrease") {
        var newWidth = currentWidth - (size * 100);
        manaBar.style.width = `${newWidth}%`;
    }
};

function xp(elementId, type, size) {
    var xpBar = document.getElementById(`${elementId}-xp`);
    var currentWidth = parseFloat(xpBar.style.width);

    if (type === "add") {
        var newWidth = currentWidth + (size * 100);
        if (newWidth > 100){
            newWidth = 100;
        }
        xpBar.style.width = `${newWidth}%`;
    } else if (type === "decrease") {
        var newWidth = currentWidth - (size * 100);
        xpBar.style.width = `${newWidth}%`;
    }
};

function enemyTurn() {
    var healthBar = document.getElementById('enemy-health'); 
    if (!healthBar.style.width) {
        healthBar.style.width = "100%"; 
    }

    var currentHealth = parseFloat(healthBar.style.width);
    var heroHealth = parseFloat(document.getElementById('hero-health').style.width);
    if (currentHealth > 0 && heroHealth > 0) {
        attack("enemy", currentEnemy);
    } else {
        timer("stop");
        return; 
    };

    // if enough mana add the possibility of running attack 3, otherwise random choice between charge. attack 1 and attack 2
    // if health is too low, increases priority of doing a charge
    // pass turn back to hero
};

function heroTurn() {
    document.getElementById("control").style.display = "flex";
    timer("start");
};

function hurt(elementId,value) {
    let elementDiv = document.getElementById(elementId);
    let elementImage = elementDiv.querySelector("img");
    let path = elementId === "hero" ? "hero" : currentEnemy;
    let damageHealth = value/ (character.find(char => char.path === path).totalHealth)

    elementImage.src = `assets/images/${path}/Hurt.gif`;
    setTimeout(() => {
        elementImage.src = `assets/images/${path}/Idle.gif`;
        health(elementId,"decrease",damageHealth);
    }, character.find(char => char.path === path).gifDuration["Hurt.gif"]);
};

function dead(elementId) {
    let elementDiv = document.getElementById(elementId);
    let elementImage = elementDiv.querySelector("img");
    let path = elementId === "hero" ? "hero" : currentEnemy;

    elementImage.src = `assets/images/${path}/Dead.gif`;
    setTimeout(() => {
        elementDiv.style.display = "none";
    }, character.find(char => char.path === path).gifDuration["Dead.gif"]);

    timer("stop");
    if (elementId === "hero") {
        deadMenu();
    } else {
        let health = character.find(char => char.path === path).totalHealth;
        score("kill", health);
        nextRound();
    }
};

function deadMenu() {

};

function preloadGifs(gifArray) {
    gifArray.forEach(gif => {
        const img = new Image();
        img.src = gif;
    });
}