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
        body.style.backgroundImage = 'radial-gradient(circle at 85vw 35vh,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.50) 100%),url(/assets/images/game_background.png)';
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

function start(){
    document.getElementById('fight_area').style.display = 'flex';
    var heroImage = document.getElementById('hero').getElementsByTagName('img')[0];
    heroImage.src = '/assets/images/wizzard/Run.gif';
    
    heroImage.style.position = 'relative';
    heroImage.style.left = '-20vw';
    
    let start = null;
    const element = heroImage;
    
    const duration = 800; 
    const startLeft = -20; 
    const endLeft = 20; 
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        const currentLeft = startLeft + (endLeft - startLeft) * (progress / duration);
        element.style.left = `${currentLeft}vw`;
        element.style.transform= 'translateX(-50%)';
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.src = '/assets/images/wizzard/Idle.gif';
            element.style.left = '20vw';
            element.style.transform= 'translateX(-50%)';
        }
    }
    
    // Start the animation
    requestAnimationFrame(animate);
};

function attack(){

};

function fire(){

};

function recharge(){

};

function item(){

};

