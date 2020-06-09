const start = document.getElementById("start");
const game = document.getElementById("game");
const alerts = document.getElementById("alerts");

const rows = 8;
const columns = 8;

let score = 0;
let moves = 0;
let level = "";

let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const ships = [2, 3, 3, 4, 5];
const levels = ["Easy", "Medium", "Hard"];

const metrics = document.getElementById("metrics");
const showLevel = document.createElement("h3");
const showScore = document.createElement("h3");
const showMoves = document.createElement("h3");
metrics.appendChild(showLevel);
metrics.appendChild(showScore);
metrics.appendChild(showMoves);

start.addEventListener("click", chooseDifficulty, false);

function chooseDifficulty() {
    const popup = document.createElement("div");
    popup.setAttribute("id", "levelSelect");
    popup.innerHTML = "Choose Level of Difficulty: ";
    alerts.appendChild(popup);

    const easy = document.createElement("button");
    easy.innerHTML = "Easy";
    easy.addEventListener("click", function () {
        placeRandomShips(0, "Easy");
        popup.style.display = "none";

    }, false);
    popup.appendChild(easy);

    const medium = document.createElement("button");
    medium.innerHTML = "Medium";
    medium.addEventListener("click", function () {
        placeRandomShips(1, "Medium");
        popup.style.display = "none";

    }, false);
    popup.appendChild(medium);

    const hard = document.createElement("button");
    hard.innerHTML = "Hard";
    hard.addEventListener("click", function () {
        placeRandomShips(2, "Hard");
        popup.style.display = "none";

    }, false);
    popup.appendChild(hard);
}

// create board
window.onload = function() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            var square = document.createElement("canvas");
            game.appendChild(square);
            var c = square.getContext("2d");

            square.id = "s" + i + j;
            square.className = "square";

            square.style.top = i * 50 + 'px';
            square.style.left = j * 50 + 'px';

            c.fillStyle = "blue";
            c.fillRect(2, 2, 299, 299);

            c.fillStyle = "black";
            c.rect(1, 1, 300, 300);

            c.stroke();
        }
    }
};

function placeRandomShips(numShips, chosenLevel) {
    // reset minMoves if level changed
    const cookies = document.cookie.split(";");
    const levelCookie = cookies[1].split("=")[1];

    if (chosenLevel !== levelCookie) {
        movesScore.innerHTML = "Minimum moves made: ";
    }

    // show metrics
    level = chosenLevel;
    score = 0;
    moves = 0;

    showLevel.innerHTML = "Level: " + level;
    showScore.innerHTML = "Score: " + score;
    showMoves.innerHTML = "Number of Moves: " + moves;

    // reset board
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            board[i][j] = 0;
        }
    }

    const canvases = document.getElementsByClassName("square");

    for (let i = 0; i < canvases.length; i++) {
        var c = canvases[i].getContext("2d");

        c.fillStyle = "blue";
        c.fillRect(2, 2, 299, 299);

        c.stroke();
    }

    // allow tile selection
    for (let i = 0; i < canvases.length; i++) {
        canvases[i].addEventListener("click", selectTile, false);
    }

    // place new computer ships
    for (let i = 0; i < ships.length - numShips; i++) {
        var shipFrontX = Math.floor(Math.random() * rows);
        var shipFrontY = Math.floor(Math.random() * columns);

        // left=0, right=1, up=2, down=3
        var dir = Math.floor(Math.random() * 4);

        if (board[shipFrontX][shipFrontY] === 0) {
            if (isValidPlacement(shipFrontX, shipFrontY, dir, ships[i])) {
                board[shipFrontX][shipFrontY] = 1;

                for (let j = 1; j < ships[i]; j++) {
                    if (dir === 0) {
                        board[shipFrontX - j][shipFrontY] = 1;
                    }
                    if (dir === 1) {
                        board[shipFrontX + j][shipFrontY] = 1;
                    }
                    if (dir === 2) {
                        board[shipFrontX][shipFrontY - j] = 1;
                    }
                    if (dir === 3) {
                        board[shipFrontX][shipFrontY + j] = 1;
                    }
                }
            }
            else {
                i--;
            }
        }
        else {
            i--;
        }
    }
}

const movesScore = document.getElementById("movesScore");
const showMoveScore = document.createElement("h3");
var minMoveNum = 100;

function selectTile(e) {
    // set move limit
    if (moves === maxMoves()) {
        const maxMove = document.createElement("div");
        maxMove.setAttribute("id", "move");
        maxMove.innerHTML = "You ran out of moves! Game Over.";

        const button = document.createElement("button");
        button.addEventListener("click", function () {
            placeRandomShips(levels.indexOf(level, 0), level);
            maxMove.style.display = "none";
        }, false);
        button.innerHTML = "Play Again";

        maxMove.appendChild(button);
        alerts.appendChild(maxMove);

        // get minimum move score
        if (minMoves()) {
            minMoveNum = moves;
            movesScore.innerHTML = "Minimum moves made: " + minMoveNum;
        }
        else {
            movesScore.innerHTML = "Minimum moves made: " + minMoveNum;
        }
    }

    const row = e.target.id.substring(1, 2);
    var col = e.target.id.substring(2, 3);

    var canvas = document.getElementById(e.target.id);
    var c = canvas.getContext("2d");

    // miss
    if (board[row][col] === 0) {
        const splash = document.getElementById("splash");
        c.drawImage(splash, 1, 1, 299, 159);
        setTimeout(clearImage, 1000, e, "cornflowerblue");

        board[row][col] = 3;
        moves++;

        showMoves.innerHTML = "Number of Moves: " + moves;
    }
    // hit
    else if (board[row][col] === 1) {
        const explode = document.getElementById("explode");
        c.drawImage(explode, 1, 1, 299, 159);
        setTimeout(clearImage, 1000, e, "red");

        board[row][col] = 2;
        moves++;
        score++;

        showScore.innerHTML = "Score: " + score;
        showMoves.innerHTML = "Number of Moves: " + moves;

        // win game
        if (score === maxScore()) {
            document.cookie = "moves="+moves;

            const win = document.createElement("div");
            win.setAttribute("id", "win");
            win.innerHTML = "You won! ";

            const button = document.createElement("button");
            button.addEventListener("click", function () {
                placeRandomShips(levels.indexOf(level, 0), level);
                win.style.display = "none";
            }, false);
            button.innerHTML = "Play Again";

            win.appendChild(button);
            alerts.appendChild(win);

            // get minimum move score
            if (minMoves()) {
                minMoveNum = moves;
                movesScore.innerHTML = "Minimum moves made: " + minMoveNum;
            }
            else {
                movesScore.innerHTML = "Minimum moves made: " + minMoveNum;
            }
        }
    }
    // already fired
    else if (board[row][col] > 1) {
        const popup = document.createElement("div");
        popup.setAttribute("id", "status");
        popup.innerHTML = "You already fired at this! Try again. ";
        
        setTimeout(function () {
            popup.style.display = "none";
        }, 1500);
        
        alerts.appendChild(popup);
    }

    document.cookie = "level="+level;
    document.cookie = "score="+score;
    document.cookie = "moves="+moves;

    movesScore.appendChild(showMoveScore);
}

function isValidPlacement(x, y, dir, shipLength) {
    if (dir === 0) {
        if (x - shipLength < 0) {
            return false;
        }
        else {
            for (let i = 1; i < shipLength; i++) {
                if (board[x - i][y] === 1) {
                    return false;
                }
            }
        }
    }
    if (dir === 1) {
        if (x + shipLength > columns) {
            return false;
        }
        else {
            for (let i = 1; i < shipLength; i++) {
                if (board[x + i][y] === 1) {
                    return false;
                }
            }
        }
    }
    if (dir === 2) {
        if (y - shipLength < 0) {
            return false;
        }
        else {
            for (let i = 1; i < shipLength; i++) {
                if (board[x][y - i] === 1) {
                    return false;
                }
            }
        }
    }
    if (dir === 3) {
        if (y + shipLength > rows) {
            return false;
        }
        else {
            for (let i = 1; i < shipLength; i++) {
                if (board[x][y + i] === 1) {
                    return false;
                }
            }
        }
    }

    return true;
}

function maxScore() {
    if (level === "Easy") {
        return 17;
    }

    if (level === "Medium") {
        return 12;
    }

    if (level === "Hard") {
        return 8;
    }
}

function maxMoves() {
    if (level === "Easy") {
        return 60;
    }

    if (level === "Medium") {
        return 50;
    }

    if (level === "Hard") {
        return 40;
    }
}

function clearImage(e, color) {
    var canvas = document.getElementById(e.target.id);
    var c = canvas.getContext("2d");

    c.clearRect(2, 2, 299, 299);

    c.fillStyle = color;
    c.fillRect(2, 2, 299, 299);
    c.stroke();
}

document.getElementById("rules").addEventListener("click", function () {
    const rules = document.createElement("div");
    rules.setAttribute("id", "howTo");

    const ruleList = [
        "1. Click the Start New Game button and select your desired difficulty.",
        "2. Fire a torpedo by selecting a tile.",
        " The tile will turn white if you miss and red if you hit part of a ship.",
        " The ships can take up between two and five tiles.",
        "3. Try to make as few moves as possible! You have: ",
        " 60 moves on Easy.",
        " 50 moves on Easy.",
        " 40 moves on Easy.",
        "4. The Play Again button resets the board and keeps the same difficulty.",
        " Your minimum move score resets when you change the difficulty.",
        "5. To reset the board and choose a different difficulty, click the Start New Game button.",
        "6. The number of ships differs by difficulty: ",
        " Easy: Five ships are placed. The winning score is 17 points.",
        " Medium: Four ships are placed. The winning score is 12 points.",
        " Hard: Three ships are placed. The winning score is 8 points."
    ];

    var head = document.createElement("h1");
    head.innerHTML = "Rules";
    rules.appendChild(head);

    for (let i = 0; i < ruleList.length; i++) {
        var ul = document.createElement("ul");
        var p = document.createElement("p");

        if (ruleList[i].startsWith(" ", 0)) {
            var l = document.createElement("li");
            l.innerHTML = ruleList[i];
            ul.appendChild(l);
        }
        else {
            p.innerHTML = ruleList[i];
        }

        rules.appendChild(p);
        rules.appendChild(ul);
    }

    const button = document.createElement("button");
    button.addEventListener("click", function () {
        rules.style.display = "none";
    }, false);
    button.innerHTML = "OK";
    rules.appendChild(button);
    alerts.appendChild(rules);
}, false);

function minMoves() {
    const cookies = document.cookie.split(";");

    if (cookies.length === 0) {
        return moves < maxMoves();
    }

    const moveCookie = parseInt(cookies[3].split("=")[1]);
    const levelCookie = cookies[1].split("=")[1];

    if (moveCookie < minMoveNum) {
        minMoveNum = moveCookie;
    }

    if (level !== levelCookie) {
        minMoveNum = 100;
    }

    return  moves < minMoveNum;
}