document.addEventListener('DOMContentLoaded', function() {
    var infoButton = document.getElementById('info_button');
    var modal = document.getElementById('info_modal');
    var closeButton = document.getElementsByClassName('close')[0];
    var startButton = document.getElementById('start_button');
    var startArea = document.getElementById('start_area');
    var nameArea = document.getElementById('name');
    var body = document.body;
    var heroNameInput = document.getElementById('id');

    infoButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    startButton.addEventListener('click', function() {
        startArea.style.display = 'none';
        nameArea.style.display = 'block';
        body.style.backgroundImage='radial-gradient(circle at 75vw 35vh,rgba(0, 0, 0, 1) 0%,rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0.50) 100%),url(/assets/images/game_background.png)';
    });

    heroNameInput.addEventListener('blur', function() {
        var inputValue = heroNameInput.value;
        if(inputValue) {
            heroNameInput.value = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
        }
    });
});