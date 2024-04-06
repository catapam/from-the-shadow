let character = [{
    name : "Hero",
    type : "hero",
    path : "hero",
    scream: "charge",
    strenght: "100",
    health: "100"
},
{
    name : "Gotoku",
    type : "enemy",
    path : "gotoku",
    scream: "charge",
    strenght: "100",
    health: "100"
},
{
    name : "Onrei",
    type : "enemy",
    path : "onrei",
    scream: "charge",
    strenght: "100",
    health: "100"
},
{
    name : "Yurei",
    type : "enemy",
    path : "yurei",
    scream: "charge",
    strenght: "100",
    health: "100"
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
            console.log("Button clicked");
            setTimeout(() => {
                this.classList.remove('btn-clicked');
            }, 100); 
        });
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

function run(elementID, name) {
    var characterDiv = document.getElementById(elementID);
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
        
        if (elementID === 'hero') {
            characterDiv.style.right = `${startPosition-currentPos}px`;
        } else {
            characterDiv.style.left = `${startPosition-currentPos}px`;
        }
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            characterImage.src = `assets/images/${name}/Idle.gif`;
            updatePosition(elementID);
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
                document.getElementById('control').style.display = 'flex';
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
    // const enemyDiv = document.getElementById('enemy');
    // const img = enemyDiv.querySelector('img');
    const enemies = character.filter(character => character.type === 'enemy');
    const enemy = enemies[Math.floor(Math.random() * enemies.length)]
    const selectedEnemy = enemy.path;
    document.getElementById('enemy-name').textContent = enemy.name;
    run('enemy',selectedEnemy);
}

function attack() {

};

function fire() {

};

function recharge() {

};

function item() {

};