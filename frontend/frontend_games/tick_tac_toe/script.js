document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll('.cell');
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
  
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6]
    ];
  
    function handleCellClick(e) {
      if (!gameActive) return;
      const index = e.target.dataset.index;
      if (board[index] === '') {
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.style.color = currentPlayer === 'X' ? '#0ff' : '#ff0';
  
        if (checkWin()) {
          displayMessage(`${currentPlayer} wins!`);
          gameActive = false;
        } else if (!board.includes('')) {
          displayMessage('Draw!');
          gameActive = false;
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
      }
    }
  
    function checkWin() {
      return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return board[a] && board[a] === board[b] && board[a] === board[c];
      });
    }
  
    function resetGame() {
      board.fill('');
      cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = 'white';
      });
      document.getElementById('message').textContent = '';
      gameActive = true;
    }
  
    function displayMessage(msg) {
      document.getElementById('message').textContent = msg;
    }
  
    async function donatePi() {
      try {
        if (typeof Pi === 'undefined') {
          alert("Pi Browser is required for transactions.");
          return;
        }
  
        Pi.init({ version: "2.0" });
  
        const payment = await Pi.createPayment({
          amount: 0.1, // Donation amount in Pi
          memo: "Tic-Tac-Toe Donation",
          metadata: { game: "Tic-Tac-Toe" },
          to_address: "GCE2WOBBB53KEFTEBVMBSWNSF7AJYCFH3EVIFVJOUDLEGQBXSERG6NCI" // Pi wallet address
        });
  
        if (payment) {
          displayMessage("🎉 Donation Successful! Thank you!");
        }
      } catch (error) {
        displayMessage("⚠️ Donation Failed: " + error.message);
      }
    }
  
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  
    window.resetGame = resetGame;
    window.donatePi = donatePi;
  });
  