// Select the element on the page where the game's status will be displayed
const status_display = document.querySelector(".game--status");

// Select the element on the page where the players scores will be displayed
const score_display = document.querySelector(".score--board");

// Set the initial game status to indicate that the game is active and that it is player X's turn
let game_active = true;
let current_player = "X";

// Set the intial player scores to 0
let x_score = 0;
let o_score = 0;

// Set the initial game state to an array of empty strings, representing an empty grid
let game_state = ["", "", "", "", "", "", "", "", ""];

// Define a function that returns a message stating that the current player has won the game
const winning_message = () => `Player ${current_player} has won!`;

// Define a function that returns a message stating that the game has ended in a draw
const draw_message = () => `Game ended in a draw!`;

// Define a function that returns a message stating whose turn it is
const current_player_turn = () => `It's ${current_player}'s turn`;

// Define a function that returns a message containing the players scores
const current_score_board = () => `[X's score:${x_score}]<br/>[O's score:${o_score}]`;

// Define an array of arrays representing the different ways that a player can win the game
const winning_conditions = [
  [0, 1, 2], // Horizontal row 1
  [3, 4, 5], // Horizontal row 2
  [6, 7, 8], // Horizontal row 3
  [0, 3, 6], // Vertical column 1
  [1, 4, 7], // Vertical column 2
  [2, 5, 8], // Vertical column 3
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

// Set the initial game status to indicate whose turn it is
status_display.innerHTML = current_player_turn();

// Set the intial score board status
score_display.innerHTML = current_score_board();

// Define a function that updates the game state and the cell's HTML to reflect the current player's move
function handle_cell_played(clicked_cell, clicked_cell_index) {
  game_state[clicked_cell_index] = current_player;
  clicked_cell.innerHTML = current_player;
}

// Define a function that changes the current player and updates the game status to reflect the new player's turn
function handle_player_change() {
  if (current_player === "X") {
    current_player = "O";
  } else {
    current_player = "X";
  }

  status_display.innerHTML = current_player_turn();
}

// Define a function that checks the game state to see if the current player has won or if the game is a draw, and updates the game status and the `game_active` variable accordingly
function handle_result_validation() {
  // Set a flag to track whether the current round has been won
  let round_won = false;

  // Iterate over the winning conditions to check if any of them have been met
  for (let i = 0; i <= 7; i++) {
    // Get the current winning condition (an array of indices representing a row, column, or diagonal)
    const win_condition = winning_conditions[i];
    // Get the current player's symbol for each cell in the current winning condition
    let a = game_state[win_condition[0]];
    let b = game_state[win_condition[1]];
    let c = game_state[win_condition[2]];

    // If any of the cells in the current winning condition are empty, skip to the next condition
    if (a === "" || b === "" || c === "") {
      continue;
    }
    // If the current player's symbol is the same in all cells of the current winning condition, set the `round_won` flag to true and break out of the loop
    if (a === b && b === c) {
      round_won = true;
      break;
    }
  }

  // If the current round has been won, update the game status and set the `game_active` variable to false
  if (round_won) {
    status_display.innerHTML = winning_message();
    update_scoreboard();
    game_active = false;
    return;
  }
  // If the game is a draw update the game status and display draw message
  let round_draw = !game_state.includes("");
  if (round_draw) {
    status_display.innerHTML = draw_message();
    game_active = false;
    return;
  }

  // Change the current player
  handle_player_change();
}
// Define a function that is called when a cell in the game grid is clicked
function handle_cell_click(clicked_cell_event) {
  // Get the cell that was clicked
  const clicked_cell = clicked_cell_event.target;
  // Get the index of the clicked cell from its `data-cell-index` attribute
  const clicked_cell_index = parseInt(
    clicked_cell.getAttribute("data-cell-index")
  );

  // If the clicked cell is already filled or the game is not active, return early
  if (game_state[clicked_cell_index] !== "" || !game_active) {
    return;
  }

  // Update the game state and the cell's HTML to reflect the current player's move
  handle_cell_played(clicked_cell, clicked_cell_index);
  // Check if the current player has won or if the game is a draw, and update the game status and the `game_active` variable accordingly
  handle_result_validation();
}

// Define a function that is called when the "Restart game" button is clicked
function handle_restart_game() {
  // Set the game status to indicate that the game is active and it is player X's turn
  game_active = true;

  // reset the current player, game state and update the game status
  current_player = "X";
  game_state = ["", "", "", "", "", "", "", "", ""];
  status_display.innerHTML = current_player_turn();
  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
}

// Define a function that is called when a player wins a game
function update_scoreboard(){
    // updats score counters depending on whos turn it is
    if(current_player === "X"){
        x_score++;
    }else{
        o_score++;
    }
    score_display.innerHTML = current_score_board();
}

// Add a click event listener to each cell in the game grid that calls the `handle_cell_click` function when the cell is clicked
document
  .querySelectorAll(".cell")
  .forEach((cell) => cell.addEventListener("click", handle_cell_click));
// Add a click event listener to the "Restart game" button that calls the `handle_restart_game` function when the button is clicked
document
  .querySelector(".game--restart")
  .addEventListener("click", handle_restart_game);
