


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
        body.style.backgroundImage = 'radial-gradient(circle at 85vw 35vh,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.50) 100%),url(assets/images/game_background.png)';
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
    var heroDiv = document.getElementById('hero'); // Keep this for positioning
    var heroImage = heroDiv.querySelector('img'); // Correctly target the <img> for src changes
    
    heroImage.src = 'assets/images/wizzard/Run.gif';
    
    // Adjust styling for the container
    heroDiv.style.left = '-100vw'; // Start off-screen to the left

    let start = null;
    const duration = 800;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const timeFraction = progress / duration;
        const easeOut = 1 - Math.pow(1 - timeFraction, 2);
        
        // Update to reflect final desired position with correct calculation
        const currentLeft = -100 + easeOut * (150); // Assuming 100vw + 50vw (halfway plus adjustment)
        heroDiv.style.left = `calc(${currentLeft}vw - 30%)`; // Adjust based on your requirement

        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            heroImage.src = 'assets/images/wizzard/Idle.gif';
            // After animation, adjust for final position
            heroDiv.style.left = `calc(50vw - 30%)`; // Set final position
            heroDiv.style.transform = 'translateX(-50%)'; // Keep transform if needed for further adjustments
        }
    }

    requestAnimationFrame(animate);
}

function enemyArives (){

}

function attack(){

};

function fire(){

};

function recharge(){

};

function item(){

};

