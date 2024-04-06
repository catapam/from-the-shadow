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
        }
    });

    fightButton.addEventListener('click', function (event) {
        if (!heroNameInput.value.trim()) {
            event.preventDefault();
            alert("Please enter your Hero's Name.");
            heroNameInput.focus();
        } else {
            nameArea.style.display = 'none';
            start();
        }
    });
});

function updatePosition() {
    const heroDiv = document.getElementById('hero');
    const viewportWidth = window.innerWidth;
    const elementWidth = heroDiv.offsetWidth;

    const rightPosition = (viewportWidth * 0.5) - (elementWidth / 4);
    heroDiv.style.position = 'fixed';
    heroDiv.style.right = `${rightPosition}px`; 
    heroDiv.style.bottom = '25vh'; 
}

updatePosition();
window.addEventListener('resize', updatePosition);

function start() {
    document.getElementById('fight_area').style.display = 'flex';
    document.getElementById('enemy').style.display = 'none';
    document.getElementById('stats').style.display = 'none';
    document.getElementById('control').style.display = 'none';
    var heroDiv = document.getElementById('hero');
    var heroImage = heroDiv.querySelector('img');

    heroImage.src = 'assets/images/wizzard/Run.gif';
    finalRight=((parseFloat(document.getElementById('hero').style.right))/window.innerWidth)*100
    heroDiv.style.right = '100vw';

    console.log(finalRight);
    let start = null;
    const duration = 800;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const timeFraction = progress / duration;
        const easeOut = 1 - Math.pow(1 - timeFraction, 2);

        const currentRight = 100 + (finalRight - 100) * easeOut;
        heroDiv.style.right = `${currentRight}vw`

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            heroImage.src = 'assets/images/wizzard/Idle.gif';
        }
    }

    requestAnimationFrame(animate);
    tutorial();
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
    const enemyDiv = document.getElementById('enemy');
    const img = enemyDiv.querySelector('img');

    const enemies = ['gotoku', 'yurei', 'onrei'];
    const selectedEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    img.src = `/assets/images/${selectedEnemy}/Run.gif`;

    img.style.position = 'fixed';
    img.style.left = '-35vw';
    img.style.bottom = '25vh';
    img.style.height = '0';
    img.style.width = 'auto';
    img.style.opacity = '0';

    // img.animate([
    //     { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.5},
    //     { transform: 'translate(calc(50vw - 30%), 33vh) scale(1)', opacity: 1}
    // ], {
    //     duration: 800,
    //     fill: 'forwards' 
    // }).onfinish = () => {
    //     img.src = `/assets/images/${selectedEnemy}/Idle.gif`;
    // };
}

function attack() {

};

function fire() {

};

function recharge() {

};

function item() {

};

