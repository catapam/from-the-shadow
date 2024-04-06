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

    fightButton.addEventListener('click', function () {
        nameArea.style.display = 'none';
        start();
     });
});

function start() {
    document.getElementById('fight_area').style.display = 'flex';
    document.getElementById('enemy').style.display = 'none';
    var heroDiv = document.getElementById('hero');
    var heroImage = heroDiv.querySelector('img'); 
    
    heroImage.src = 'assets/images/wizzard/Run.gif';
    heroDiv.style.left = '-100vw'; 

    let start = null;
    const duration = 800;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const timeFraction = progress / duration;
        const easeOut = 1 - Math.pow(1 - timeFraction, 2);
        
        const currentLeft = -100 + easeOut * (150);
        heroDiv.style.left = `calc(${currentLeft}vw - 30%)`

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            heroImage.src = 'assets/images/wizzard/Idle.gif';
            heroDiv.style.left = `calc(50vw - 30%)`; 
            heroDiv.style.transform = 'translateX(-50%)';
        }
    }

    requestAnimationFrame(animate);
    tutorial();
}

function tutorial() {
    let stories = [
        'Wow! What is that big round shadow?',
        'Did you hear that scream?',
        'What is that coming out of the shadow?',
        'This is bad, I will have to protect the village!'
    ];
    let currentIndex = 0;

    document.getElementById('tutorial_modal').style.display = 'block';

    let heroNameInput = document.getElementById('id');

    let player = document.createElement('h4');
    let storyParagraph = document.createElement('p');
    let nextButton = document.createElement('button');
    nextButton.className = 'close btn-next';
    nextButton.id = 'next';
    nextButton.textContent = '>>';
    nextButton.style.color = 'black';
    nextButton.style.width = '15%';
    nextButton.style.alignSelf = 'Right';
    nextButton.style.marginLeft = 'auto';

    player.className = 'player-name';
    player.textContent = heroNameInput.value; 

    storyParagraph.textContent = stories[currentIndex];

    let storyContainer = document.getElementById('story');
    storyContainer.innerHTML = ''; 
    storyContainer.appendChild(player);
    storyContainer.appendChild(storyParagraph);
    storyContainer.appendChild(nextButton);

    nextButton.addEventListener('click', function() {
        if (currentIndex < stories.length-2) {
            currentIndex++;
            storyParagraph.textContent = stories[currentIndex];
            if (currentIndex === 1){
                scream()
            }
            if (currentIndex === 2){
                enemyArives()
            }
        } else {
            currentIndex++;
            storyParagraph.textContent = stories[currentIndex]; 
            nextButton.textContent = 'x';
            nextButton.onclick = function() {
                document.getElementById('tutorial_modal').style.display = 'none';
            };
        }
    });
}

function scream(){

}

function enemyArives(){

}

function attack(){

};

function fire(){

};

function recharge(){

};

function item(){

};

