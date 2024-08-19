let game = false;

const button = document.getElementById("restart");
const containergame = document.getElementById("game");
const dot = document.querySelector(".dot");
const score = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

const toggleCheckbox = document.getElementById('toggleCheckbox');
const dropdownMenu = document.getElementById('dropdownMenu');
let optionA = document.getElementById("optionA");
let optionB = document.getElementById("optionB");
let optionC = document.getElementById("optionC");
let difficulty;

let targets = [];
let numtargets = 3;
let counter = 0;
let click = 0;
let numTargetMoved = 0;
const GamelenghtMs = 10000;
const IntervalMsRandPos = 2000;
let precision = 0;
let interval;
let countdownInterval;
let gameTimeout;

toggleCheckbox.addEventListener('change', function () {
    dropdownMenu.style.display = toggleCheckbox.checked ? 'block' : 'none';
});

function setupDifficultyListeners() {
    if (optionA && optionB && optionC) {
        optionA.addEventListener('change', function () {
            difficulty = 1;
            SetDifficulty(difficulty);
        });

        optionB.addEventListener('change', function () {
            difficulty = 2;
            SetDifficulty(difficulty);
        });

        optionC.addEventListener('change', function () {
            difficulty = 3;
            SetDifficulty(difficulty);
        });
    }
}

if (window.location.pathname.includes('index.html')) {
    difficulty = getDifficulty();
    setupDifficultyListeners();

    function startGame() {
        resetGame();
        GenerateTargets();
        moveTargets();
        startCountdown();

        interval = setInterval(() => {
            moveTargets();
            updateScore();
        }, IntervalMsRandPos);

        gameTimeout = setTimeout(() => {
            endGame();
        }, GamelenghtMs);
    }

    button.addEventListener("click", () => {
        if (!game) {
            SetDifficulty(difficulty);
            game = true;
            startGame();
        } else {
            resetGame();
            startGame();
        }
    });

    containergame.addEventListener("click", function(event) {
        if (event.target === containergame) {
            const Dotx = event.clientX - containergame.getBoundingClientRect().left;
            const Doty = event.clientY - containergame.getBoundingClientRect().top;

            dot.style.left = Dotx + 'px';
            dot.style.top = Doty + 'px';
            dot.style.display = 'block';

            setTimeout(function() {
                dot.style.display = 'none';
            }, 5000);
        }
        click++;
        updateScore();
    });

    function RandomPosition(element) {
        const numrandomX = Math.floor(Math.random() * (containergame.clientWidth - 50));
        const numrandomY = Math.floor(Math.random() * (containergame.clientHeight - 50));
        element.style.left = numrandomX + "px";
        element.style.top = numrandomY + "px";
    }

    function GenerateTargets() {
        Remove();
        for (let i = 0; i < numtargets; i++) {
            createTarget();
        }
    }

    function createTarget() {
        let target = document.createElement("div");
        target.className = "target absolute w-12 h-12 bg-red-500 rounded-full cursor-pointer transition-transform duration-300 ease-out transform";
        containergame.appendChild(target);
        targets.push(target);
        RandomPosition(target);
        target.style.display = 'block';
        addEventListenerToTarget(target);
    }

    function moveTargets() {
        // Ensure this function only runs if the game is active
        if (game) {
            targets.forEach(target => {
                if (target.classList.contains('hit')) {
                    target.classList.remove('hit');
                    target.style.transform = "scale(1)";
                }
                RandomPosition(target);
                target.style.display = 'block';
            });
            numTargetMoved += targets.length;
        }
    }

    function addEventListenerToTarget(target) {
        target.addEventListener("click", (event) => {
            if (game) {  // Ensure the click is registered only during an active game
                event.stopPropagation();
                counter++;
                click++;
                target.classList.add('hit');
                target.style.transform = "scale(0)";
                target.style.display = 'none';
                updateScore();
            }
        });
    }

    function updateScore() {
        const totalPossibleHits = numtargets * 5; // Total possible hits considering each target reappears 5 times
        precision = totalPossibleHits > 0 ? (counter / totalPossibleHits) * 100 : 0;
        precision = Math.min(precision, 100);
        score.textContent = `Score: ${counter} / ${totalPossibleHits} - Precision: ${precision.toFixed(2)}%`;
    }

    function displayFinalScore() {
        const totalPossibleHits = numtargets * 5; // Total possible hits considering each target reappears 5 times
        score.textContent = `Final Score: ${counter} out of ${totalPossibleHits} - Precision: ${precision.toFixed(2)}%`;
    }

    function Remove() {
        targets.forEach(target => target.remove());
        targets = [];
    }

    function resetGame() {
        clearInterval(interval);
        clearTimeout(gameTimeout);
        clearInterval(countdownInterval);
        counter = 0;
        click = 0;
        numTargetMoved = 0;
        Remove();
        updateScore();
        timerDisplay.textContent = `Time Left: ${GamelenghtMs / 1000}s`;
    }

    function SetDifficulty(difficulty) {
        switch(difficulty) {
            case 1:
                numtargets = 3;
                break;
            case 2:
                numtargets = 4;
                break;
            case 3:
                numtargets = 5;
                break;
        }
        localStorage.setItem('difficulty', difficulty);
    }

    function getDifficulty() {
        const difficulty = parseInt(localStorage.getItem('difficulty'));
        return isNaN(difficulty) ? 1 : difficulty;
    }

    function startCountdown() {
        let timeLeft = GamelenghtMs / 1000;
        countdownInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(interval);
        clearTimeout(gameTimeout);
        clearInterval(countdownInterval);
        game = false; // Set the game to inactive
        displayFinalScore();
    }
}
