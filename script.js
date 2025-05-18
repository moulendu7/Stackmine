const boardSize = 5 * 5;
let bombIndexes = new Set();
let revealedIndexes = new Set();
let gameOver = false;
let balance = 1000;
let bet = 0;
let bombCount = 0;

function updateBalanceDisplay() {
    document.getElementById("balance").textContent = balance.toFixed(2);
}

function startGame() {
    const betInput = parseFloat(document.getElementById("bet").value);
    const bombInput = parseInt(document.getElementById("bombCount").value);

    if (isNaN(betInput) || betInput <= 0 || betInput > balance) {
        alert("Invalid bet amount.");
        return;
    }

    if (isNaN(bombInput) || bombInput < 1 || bombInput > 10) {
        alert("Bomb count must be between 1 and 10.");
        return;
    }
    bet = betInput;
    bombCount = bombInput;
    balance -= bet;
    localStorage.setItem('balance', balance);
    updateBalanceDisplay();
    revealedIndexes.clear();
    bombIndexes.clear();
    gameOver = false;
    document.getElementById("message").textContent = '';
    while (bombIndexes.size < bombCount) {
        bombIndexes.add(Math.floor(Math.random() * boardSize));
    }
    const board = document.getElementById("gameBoard");
    board.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.dataset.index = i;
        tile.onclick = () => revealTile(i, tile);
        board.appendChild(tile);
    }
}

function revealTile(index, tile) {
    if (gameOver || revealedIndexes.has(index)) return;
    revealedIndexes.add(index);
    if (bombIndexes.has(index)) {
        tile.classList.add("bomb", "revealed");
        tile.textContent = "💣";
        document.getElementById("message").textContent = "💥Boom! You lost the bet.";
        document.getElementById("gameOverSound").play();
        gameOver = true;
        revealAll();
        return;
    }
    tile.classList.add("gem", "revealed");
    tile.textContent = "💎";
    const safeTiles = boardSize - bombCount;
    document.getElementById("message").textContent =
        `Gems found: ${revealedIndexes.size}`;

    if (revealedIndexes.size === safeTiles) {
        const winnings = bet + (bet / safeTiles) * revealedIndexes.size;
        balance += winnings;
        localStorage.setItem('balance', balance);
        updateBalanceDisplay();
        document.getElementById("message").textContent =
            `🎉 You cleared all gems! Won ₹${winnings.toFixed(2)}!`;
        document.getElementById("gameOverSound").play();
        gameOver = true;
        revealAll();
    }
}

function revealAll() {
    document.querySelectorAll(".tile").forEach(tile => {
        const idx = parseInt(tile.dataset.index);
        if (bombIndexes.has(idx)) {
            tile.classList.add("bomb", "revealed");
            tile.textContent = "💣";
        } else if (!revealedIndexes.has(idx)) {
            tile.classList.add("revealed");
        }
    });
}

function loadBalance() {
    const storedBalance = localStorage.getItem('balance');
    if (storedBalance !== null) {
        balance = parseFloat(storedBalance);
    } else {
        balance = 1000;
    }
    updateBalanceDisplay();
}

loadBalance();
document.getElementById('resetButton').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset your balance to ₹1000?")) {
        balance = 1000;
        localStorage.setItem('balance', balance);
        updateBalanceDisplay();
        document.getElementById("message").textContent = "Balance reset to ₹1000.";
    }
});
