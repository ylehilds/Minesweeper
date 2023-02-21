var board = []
var rows = 8
var columns = 8

var minesCount = 5
var minesLocation = [] // "2-2", "3-4", "2-1"


var tilesClicked = 0 // goal to click all times except the ones containing mines
var flagEnabled = false

var gameOver = false


// window.onload = function() {
//   startGame()
// }

function start() {
  const minesAmount = parseInt(document.getElementById("mines-amount").value)
  if (!minesAmount || minesAmount < 0 || minesAmount > 63) {
    alert("Please make sure to enter the mines quantity as a number between 1 and 63!")
    return
  }
  minesCount = parseInt(minesAmount)
  startGame()
  document.getElementById("start-button").disabled = true
}

function restart() {
  window.location.reload()
}

function setMines() {
  // minesLocation.push("2-2")
  // minesLocation.push("2-3")
  // minesLocation.push("5-6")
  // minesLocation.push("3-4")
  // minesLocation.push("1-1")

  let minesLeft = minesCount
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows)
    let c = Math.floor(Math.random() * columns)
    let id = r.toString() + "-" + c.toString()

    if (!minesLocation.includes(id)) {
      minesLocation.push(id)
      minesLeft -= 1
    }
  }
}

function startGame() {
  document.getElementById("mines-count").innerText = minesCount
  document.getElementById("flag-button").addEventListener("click", setFlag)
  setMines()
// populate our board
  for (let r = 0; r < rows; r++) {
    let row = []
    for (let c = 0; c < columns; c++) {
      // <div id="0-0"></div>
      let tile = document.createElement("div")
      tile.addEventListener("click", clickTile)
      tile.id = r.toString() + "-" + c.toString()
      document.getElementById("board").append(tile)
      row.push(tile)
    }
    board.push(row)
  }
  console.log(board)
}

function setFlag() {
  if (flagEnabled) {
    flagEnabled = false
    document.getElementById("flag-button").style.backgroundColor = "lightgray"
  } else {
    flagEnabled = true
    document.getElementById("flag-button").style.backgroundColor = "darkgray"
  }
}

function clickTile() {
  if (gameOver || this.classList.contains("tile-clicked")) {
    return
  }
  let tile = this
  if (flagEnabled) {
    if (tile.innerText === "") {
      tile.innerText = "🚩"
    } else if (tile.innerText === "🚩") {
      tile.innerText = ""
    }
    return
  }
  if(minesLocation.includes(tile.id)) {
    // alert("GAME OVER")
    gameOver = true
    revealMines()
    return
  }

  let coords = tile.id.split("-") // "0-0" -> ["0", "0"]
  let r = parseInt(coords[0])
  let c = parseInt(coords[1])
  checkMine(r, c)
}

function revealMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = board[r][c]
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣"
        tile.style.backgroundColor = "red"
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return
  }
  if (board[r][c].classList.contains("tile-clicked")) {
    return
  }

  board[r][c].classList.add("tile-clicked")
  tilesClicked += 1

  let minesFound = 0

  // top 3
  minesFound += checkTile(r-1, c-1) // top left
  minesFound += checkTile(r-1, c) // top
  minesFound += checkTile(r-1, c+1) // top right

  // left and right
  minesFound += checkTile(r, c-1) // left
  minesFound += checkTile(r, c+1) // right

  // bottom 3
  minesFound += checkTile(r+1, c-1) // bottom left
  minesFound += checkTile(r+1, c) // bottom
  minesFound += checkTile(r+1, c+1) // bottom right

  if (minesFound > 0) {
    board[r][c].innerText = minesFound
    board[r][c].classList.add("x" + minesFound.toString())
  } else {
    // top 3
    checkMine(r-1, c-1) // top left
    checkMine(r-1, c) // top
    checkMine(r-1, c+1) // top right

    // left and right
    checkMine(r, c-1) // left
    checkMine(r, c+1) // right

    // bottom 3
    checkMine(r+1, c-1) // bottom left
    checkMine(r+1, c) // bottom
    checkMine(r+1, c+1) // bottom right

  }

  if (tilesClicked === rows * columns - minesCount) {
    document.getElementById("mines-count").innerText = "Cleared"
    gameOver = true
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= columns) {
    return 0
  }
  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1
  }
  return 0
}

window.onload = (event) => {
// Get the input field
  var minesAmountInput = document.getElementById("mines-amount");

// Execute a function when the user presses a key on the keyboard
  minesAmountInput.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("start-button").click();
    }
  });
}