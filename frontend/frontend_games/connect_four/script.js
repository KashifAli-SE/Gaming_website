document.addEventListener("DOMContentLoaded", () => {
    const COLUMNS = 7;
    const ROWS = 6;
    let currentPlayer = 1;
    let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
    let gameOver = false;
    
    const gameBoard = document.getElementById("gameBoard");
    const status = document.getElementById("status");
    const restartBtn = document.getElementById("restartBtn");
    
    restartBtn.addEventListener("click", resetGame);
    
    function createBoard() {
        gameBoard.innerHTML = "";
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLUMNS; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", handleMove);
                cell.addEventListener("touchend", handleMove, { passive: true });
                gameBoard.appendChild(cell);
            }
        }
        updateStatus();
    }

    function handleMove(event) {
        if (gameOver) return;
        let col = getColumnFromEvent(event);
        if (col === undefined) return;
        
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === 0) {
                board[r][col] = currentPlayer;
                updateBoard();
                if (checkWin()) {
                    setGameStatus(`Player ${currentPlayer} wins! 🎉`, true, "win");
                    return;
                }
                if (checkDraw()) {
                    setGameStatus("It's a draw! 🤝", true, "draw");
                    return;
                }
                switchPlayer();
                return;
            }
        }
    }

    function getColumnFromEvent(event) {
        if (event.type === "touchend") {
            let touch = event.changedTouches[0];
            let element = document.elementFromPoint(touch.clientX, touch.clientY);
            return element?.dataset.col;
        }
        return event.target.dataset.col;
    }

    function setGameStatus(message, isGameOver, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        gameOver = isGameOver;
        restartBtn.style.display = "block";
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
    }

    function updateStatus() {
        status.textContent = `Player ${currentPlayer}'s turn`;
        status.className = `status player${currentPlayer}`;
    }

    function updateBoard() {
        document.querySelectorAll(".cell").forEach(cell => {
            const r = cell.dataset.row;
            const c = cell.dataset.col;
            cell.classList.remove("player1", "player2");
            if (board[r][c] === 1) cell.classList.add("player1");
            if (board[r][c] === 2) cell.classList.add("player2");
        });
    }

    function checkWin() {
        return board.some((row, r) =>
            row.some((_, c) =>
                board[r][c] !== 0 && (
                    checkDirection(r, c, 1, 0) ||
                    checkDirection(r, c, 0, 1) ||
                    checkDirection(r, c, 1, 1) ||
                    checkDirection(r, c, 1, -1)
                )
            )
        );
    }

    function checkDraw() {
        return board.flat().every(cell => cell !== 0);
    }

    function checkDirection(r, c, dr, dc) {
        const player = board[r][c];
        for (let i = 1; i < 4; i++) {
            let nr = r + dr * i;
            let nc = c + dc * i;
            if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLUMNS || board[nr][nc] !== player) {
                return false;
            }
        }
        return true;
    }

    function resetGame() {
        board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
        gameOver = false;
        currentPlayer = 1;
        createBoard();
        restartBtn.style.display = "none";
    }

    createBoard();
});
