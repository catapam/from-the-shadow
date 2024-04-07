let character = [{
    name : "Hero",
    type : "hero",
    path : "hero",
    scream: "charge",
    strength: "100",
    health: "100",
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
    name : "Gotoku",
    type : "enemy",
    path : "gotoku",
    scream: "charge",
    strength: "100",
    health: "100",
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
    name : "Onrei",
    type : "enemy",
    path : "onrei",
    scream: "charge",
    strength: "100",
    health: "100",
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
    name : "Yurei",
    type : "enemy",
    path : "yurei",
    scream: "charge",
    strength: "100",
    health: "100",
    gifDuration: {
        "Attack_1.gif": 800,
        "Attack_2.gif": 800,
        "Attack_3.gif": 700,
        "Dead.gif": 800,
        "Hurt.gif": 750,
        "Scream.gif": 1320
    }
}]

updatePosition('hero','hero');
updatePosition('enemy');
window.addEventListener('resize', function() {
    updatePosition('hero','hero');
    updatePosition('enemy');
});

document.addEventListener('DOMContentLoaded', function () {
    var infoButton = document.getElementById('info_button');
    var modal = document.getElementById('info_modal');
    var closeButton = document.getElementsByClassName('close')[0];
    var startButton = document.getElementById('start_button');
    var startArea = document.getElementById('start_area');
    var nameArea = document.getElementById('name');
    var body = document.body;
    var heroNameInput = document.getElementById('id');
    var fightButton = document.getElementById('fight_button');
    var actionButton = document.getElementsByClassName('btn-fight');

    infoButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    startButton.addEventListener('click', function () {
        startArea.style.display = 'none';
        nameArea.style.display = 'block';
        body.style.backgroundImage = 'radial-gradient(circle at 85vw 35vh,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.50) 100%),url(assets/images/scenario/backgrounds/game_background.png)';
    });

    heroNameInput.addEventListener('blur', function () {
        var inputName = heroNameInput.value;
        if (inputName) {
            heroNameInput.value = inputName.charAt(0).toUpperCase() + inputName.slice(1);
            document.getElementById('hero-name').textContent = heroNameInput.value;
        }
    });

    fightButton.addEventListener('click', function (event) {
        if (!heroNameInput.value.trim()) {
            event.preventDefault();
            alert("Please enter your Hero's Name.");
            heroNameInput.focus();
        } else {
            nameArea.style.display = 'none';
            document.getElementById('fight_area').style.display = 'flex';
            start();
        }
    });

    Array.from(actionButton).forEach(function(button) {
        button.addEventListener('click', function() {
            this.classList.add('btn-clicked');
            setTimeout(() => {
                this.classList.remove('btn-clicked');
            }, 100); 
        });
    });

    document.getElementById('attack').addEventListener('click', function() {
        attack('hero', 'hero');
    });

    document.getElementById('magic').addEventListener('click', function() {
        magic('hero', 'hero');
    });

    document.getElementById('charge').addEventListener('click', function() {
        charge('hero', 'hero');
    });

    document.getElementById('level').addEventListener('click', function() {
        levelUp('hero', 'hero');
    });
});

function updatePosition(elementId) {
    const element = document.getElementById(elementId);
    const viewportWidth = window.innerWidth;
    const elementWidth = element.offsetWidth;
    const position = ((viewportWidth / 2) - ((elementWidth) / 4));

    if (elementId === 'hero') {
        element.style.right = `${position}px`;
    } else if (elementId === 'enemy') {
        element.style.left = `${position}px`;
    }

    element.style.position = 'fixed';
    element.style.bottom = '25vh';
    element.style.height = '30vh';
    element.style.zIndex = elementId === 'hero' ? '2' : '1';
}

function start() {
    document.getElementById('enemy').style.display = 'block';
    document.getElementById('hero').style.right = '100vw';
    document.getElementById('enemy').style.left = '100vw';
    
    document.getElementById('stats').style.display = 'none';
    document.getElementById('control').style.display = 'none';
    
    run('hero', 'hero');
    tutorial();
}

function run(elementId, name) {
    var characterDiv = document.getElementById(elementId);
    var characterImage = characterDiv.querySelector('img');
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
        var distance = finalPosition - (startPosition - viewportWidth)+(elementWidth / 4);
        var currentPos = easeOut * distance;
        
        if (elementId === 'hero') {
            characterDiv.style.right = `${startPosition-currentPos}px`;
        } else {
            characterDiv.style.left = `${startPosition-currentPos}px`;
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
    document.getElementById('tutorial_modal').style.display = 'block';

    let stories = [
        'Wow! What is that big round shadow?',
        'Did you hear that scream?',
        'What is that coming out of the shadow?',
        'This is bad, I will have to protect the village!'
    ];
    let currentIndex = 0;

    document.getElementById('story').style.display = 'block';

    let heroNameInput = document.getElementById('id');

    let player = document.createElement('h4');
    let storyParagraph = document.createElement('p');
    let nextButton = document.createElement('button');
    nextButton.className = 'close btn-next';
    nextButton.id = 'next';
    nextButton.textContent = '>>';
    nextButton.style.color = 'black';
    nextButton.style.width = '15%';
    nextButton.style.minWidth = '40px';
    nextButton.style.alignSelf = 'Right';
    nextButton.style.marginLeft = 'auto';

    player.className = 'player-name';
    player.textContent = heroNameInput.value + ':';
    player.style.color = 'Yellow';

    storyParagraph.textContent = stories[currentIndex];

    let storyContainer = document.getElementById('story');
    storyContainer.innerHTML = '';
    storyContainer.appendChild(player);
    storyContainer.appendChild(storyParagraph);
    storyContainer.appendChild(nextButton);

    nextButton.addEventListener('click', function () {
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
            nextButton.textContent = 'x';
            nextButton.onclick = function () {
                document.getElementById('story').style.display = 'none';
                document.getElementById('stats').style.display = 'flex';
                document.getElementById('tutorial-stats').style.display = 'block';
                //add details about stats, and hide the modal again once the close button is clicked>
                document.getElementById('tutorial-stats').style.display = 'none';

                //add timer details:
                document.getElementById('tutorial-stats').style.display = 'block';

                document.getElementById('control').style.display = 'flex';
                document.getElementById('tutorial-controls').style.display = 'block';
                //add details about controls, and hide the modal again once the close button is clicked>
                document.getElementById('tutorial-controls').style.display = 'none';
            };
        }
    });
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '-10vh';
    overlay.style.left = '35vw';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundImage = "url('assets/images/scenario/scream.png')";
    overlay.style.backgroundSize = 'cover';
    overlay.style.backgroundPosition = 'center';
    overlay.style.backgroundRepeat = 'no-repeat';
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
    document.getElementById('enemy').style.display = 'block';
    const enemies = character.filter(character => character.type === 'enemy');
    const enemy = enemies[Math.floor(Math.random() * enemies.length)]
    const selectedEnemy = enemy.path;

    // randomize the amount of XP and mana the enemy starts with
    document.getElementById('enemy-name').textContent = enemy.name;
    run('enemy',selectedEnemy);
}

function attack(elementId, path) {
    let characterObj = character.find(char => char.path === path);
    let characterDiv = document.getElementById(elementId);
    let characterImage = characterDiv.querySelector('img');
    let attackType = Math.random() < 0.5 ? "Attack_1.gif" : "Attack_2.gif";
    characterImage.src = `assets/images/${characterObj.path}/${attackType}`;
    let gifDuration = characterObj.gifDuration[attackType];
    let strength = characterObj.strength;
    let multiplier = attackType === "Attack_1.gif" ? 1 : 1.2;
    let damageScore = multiplier * strength;

    damage(elementId, damageScore);
    setTimeout(() => {
        characterImage.src = `assets/images/${characterObj.path}/Idle.gif`;
    }, gifDuration);

    if (elementId === "hero"){
        enemyTurn();
    } else if (elementId === "enemy"){
        timer();
    }
}

function magic(elementId) {
    //if hero:
    //magic 1: strenght x 1,5
    //magic 2: strenght x 2
    //random selection
    //consumes 60 mana, need to have at least 60
    //if enemy:
    //attack 3: strenght x 1,5
    //consumes 40 mana, need to have at least 40
};

function charge(elementId) {
    // add 50% health
    // reduces 20% mana
    // add 5% xp
    if (elementId === 'enemy'){

        scream();
    } else {

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
    let scoreElement = document.getElementById('score-value');
    let currentScore = parseInt(scoreElement.textContent) || 0;
    let roundElement = document.getElementById('level-value');
    let round = parseInt(roundElement.textContent) || 1; 
    let newScore = 0;
    let multiplier = 10;

    if (type === 'time' || type === 'levelUp' || type === 'round'){
        // time: time left on turn x round x 10
        // level-up: new level x round x 10
        // next round: new round x 10 (pass value as 1)
        newScore = Math.round(value * round * multiplier);
        currentScore += newScore; 
        scoreElement.textContent = currentScore;
    }

    if (type === 'damage' || type === 'kill' || type === 'defence'){
        // damage: damage x (1+(round/10))
        // kill: full enemy health x (1+(round/10))
        // defence: (enemy strenght - damage) x (1+(round/10)) >>> pass value= (enemy strenght - damage)
        newScore = Math.round(value * (1+ (round / multiplier)));
        currentScore += newScore; 
        scoreElement.textContent = currentScore;
    }
    
    if (type === 'charge'){
        // charge: health recovered + mana recovered >>> pass value= (health recovered + mana recovered)
        currentScore += Math.round(value); 
        scoreElement.textContent = currentScore;
    }
};

function timer() {
    //10s timer for the hero turn
    //if passed without acting, pass turn to enemy
    //create pause option (maybe)
    let timeLeft = 10; 
    const timerElement = document.getElementById('timer');

    timerElement.classList.remove('hidden');
    timerElement.textContent = timeLeft;

    const countdown = setInterval(function() {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.classList.add('hidden');
            enemyTurn();
        }
    }, 1000);
};

function damage(elementId,strenght) {
    let multiplier = Math.random();
    let totalDamage = Math.round(strenght * multiplier);
    if (elementId === 'hero'){
        health("enemy","decrease");
        score("damage", totalDamage);
    } else if (elementId === 'enemy'){
        health("hero","decrease");
    };

    console.log('damage from '+ elementId +' of '+totalDamage);
};

function health(elementId,type) {
    // reduces the damage received
    // adds when level up, round pass or charge activated
};

function mana(elementId,type) {
    // spends when fire or charge is triggered
    // fills up when level up, attack
};

function xp(elementId,type) {
    //base the calculation on score earned
    //when 100%, allow clicking the level-up button
};

function enemyTurn() {
    // if enough mana add the possibility of running attack 3, otherwise random choice between charge. attack 1 and attack 2
    // if health is too low, increases priority of doing a charge
    // pass turn back to hero
};