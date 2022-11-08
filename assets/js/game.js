// Game state
const GAME_STATE = {
    PENDING: 'pending',
    PLAYING: 'playing',
    BLOCKING: 'blocking',
    FINISHED: 'finished'
}

function run() {
    // Set default as easy difficulty
    let PAIRS_COUNT = 6;
    let GAME_TIME = 30;
    showBoxes('easy');

    let selection = [];
    let gameState = GAME_STATE.PENDING;
    let timer = GAME_TIME; // seconds
    let matchCount = 0;
    let countdownInterval = null;
    let randomColorList = [];
    let difficultyLevel = 'easy';

    // Get important elements
    let colorItemList;
    const timerElement = document.querySelector('.game-timer');
    const playButton = document.querySelector('.game-button');
    const colorBackground = document.querySelector('.background-container');
    const instructionButton = document.querySelector('.instruction-button');
    const difficultyButton = document.querySelector('.difficulty-button');
    const difficultyOptionsButtons = document.querySelectorAll('.difficultyOption');
    const gameTitle = document.querySelector('.game-title');

    // Bind difficulty function to buttons
    difficultyOptionsButtons.forEach((item) => {
        item.addEventListener('click', () => changeDifficulty(item.textContent.toLowerCase()));
    });

    // Function to set/display number of boxes based on difficulty level
    function showBoxes(level) {
        let allBoxes = document.querySelectorAll('.box');
        allBoxes.forEach((item) => {
            item.parentElement.classList.add("hideBox");
        });
        let selectedBoxes = document.querySelectorAll(`.${level}`);
        selectedBoxes.forEach((item) => {
            item.parentElement.classList.remove("hideBox");
        });
    }

    // Function to initialize the game
    function init() {
        colorItemList = document.querySelectorAll('#colorList > li:not(.hideBox)');
        randomColorList = getRandomColorPairs(PAIRS_COUNT);

        // Binding events
        colorItemList.forEach((item, idx) => {
            item.classList.remove('active');

            const boxElement = item.querySelector('.box');
            if (boxElement) {
                boxElement.style.backgroundColor = randomColorList[idx];
            }

            item.addEventListener('click', () => handleBoxClick(item, idx));
        });


    }


    function reset() {
        // Reset game state
        selection = [];
        gameState = GAME_STATE.PENDING;
        timer = GAME_TIME;
        matchCount = 0;

        timerElement.textContent = `${GAME_TIME}s`;
        //colorBackground.style.backgroundColor = 'rgb(141, 32, 218)';

        // Hide buttons
        playButton.style.display = 'none';
        instructionButton.style.display = 'none';
        difficultyButton.style.display = 'none';
    }

    // Start countdown
    function startCountdown() {
        countdownInterval = setInterval(() => {
            // Set DOM
            timerElement.textContent = `${timer}s`;
            timer--;

            if (timer === -1) {
                gameState = GAME_STATE.FINISHED;
                clearInterval(countdownInterval);

                timerElement.textContent = 'Game Over!'
                switch (difficultyLevel) {
                    case "easy":
                        gameTitle.textContent = "Keep Trying";
                        break;
                    case "medium":
                        gameTitle.textContent = "At least you tried!";
                        break;
                    case "hard":
                        gameTitle.textContent = "Apparently not a genius!";
                        break;
                }

                playButton.style.display = 'block';
                instructionButton.style.display = 'block';
                difficultyButton.style.display = 'block';
            };
        }, 1000);
    }


    // Handle play button
    playButton.addEventListener('click', e => {
        reset();
        init();
        startCountdown();
    });


    function changeDifficulty(level) {
        switch (level) {
            case "easy":
                PAIRS_COUNT = 6;
                GAME_TIME = 30;
                gameTitle.textContent = 'Level: Easy!'
                showBoxes(level);
                difficultyLevel = level;
                break;
            case "medium":
                PAIRS_COUNT = 8;
                GAME_TIME = 50;
                gameTitle.textContent = 'Level: Medium!'
                showBoxes(level);
                difficultyLevel = level;
                break;
            case "hard":
                PAIRS_COUNT = 10;
                GAME_TIME = 80;
                gameTitle.textContent = 'Level: Hard'
                showBoxes(level);
                difficultyLevel = level;
                break;
            default:
                PAIRS_COUNT = 6;
                GAME_TIME = 60;
        }
        init();
    }


    function handleBoxClick(item, idx) {
        if (
            !item ||
            item.classList.contains('active') ||
            gameState === GAME_STATE.BLOCKING ||
            gameState === GAME_STATE.FINISHED ||
            timer < 0
        ) return;

        // Add item to selection
        selection.push(idx);
        item.classList.add('active');
        if (selection.length < 2) return;

        // Check matching when two colors selected
        const firstColor = randomColorList[selection[0]];
        const secondColor = randomColorList[selection[1]];
        const isMatch = firstColor === secondColor;

        // in case not match, clear selection and remove active class from selected items
        if (!isMatch) {
            gameState = GAME_STATE.BLOCKING;
            setTimeout(() => {
                colorItemList[selection[0]].classList.remove('active');
                colorItemList[selection[1]].classList.remove('active');

                selection = [];
                gameState = GAME_STATE.PLAYING;
            }, 500);
            return;
        }

        // in case of match, clear selection but keep active class
        matchCount++;
        selection = [];
        //colorBackground.style.backgroundColor = randomColorList[idx];

        // Check win state
        if (matchCount === PAIRS_COUNT) {
            // Stop timer
            clearInterval(countdownInterval);
            timerElement.textContent = "You win!";
            switch (difficultyLevel) {
                case "easy":
                    gameTitle.textContent = "That was to easy!";
                    break;
                case "medium":
                    gameTitle.textContent = "Good job!";
                    break;
                case "hard":
                    gameTitle.textContent = "You are a genius!";
                    break;
            }
            playButton.style.display = 'block';
            instructionButton.style.display = 'block';
            difficultyButton.style.display = 'block';
            gameState === GAME_STATE.FINISHED;
        }
    }
};
//Function that shuffles elements in random order(Inspired from Stackoverflow)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function getRandomColorPairs(count) {
    const hueList = ['red', 'yellow', 'green', 'blue', 'pink', 'goldenrod', 'purple', 'darkcyan', 'darksalmon', 'darkolivegreen', 'deeppink']
    const colorList = [];

    for (let i = 0; i < count; i++) {
        const color = hueList[i % hueList.length];

        colorList.push(color);
    }

    // double current color list
    const fullColorList = [...colorList, ...colorList];

    // Shuffle color list
    shuffle(fullColorList);

    return fullColorList;
}


run();