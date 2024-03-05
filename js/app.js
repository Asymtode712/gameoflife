const WIDTH = 60;
const HEIGHT = 30;

let ALIVE_COLOR = "#00246B";
let DEAD_COLOR = "#CADCFC";

const ALIVE = 1;
const DEAD = 0;

const gridContainer = document.getElementById("main-grid");

// 2D array to hold cell states
let cells = new Array(HEIGHT);
for (let i = 0; i < HEIGHT; i++) {
  cells[i] = new Array(WIDTH);
}

let animationSpeed = 400;
let isAnimating = false;
let isStarted = false;
let areEventListenersAdded = true;
let isWarpEnabled = true;
let isGridVisible = true;

const themeslist = {
  blue: {
    "--primary-color": "#0f045a",
    "--theme-color1": "#7582b2",
    "--theme-color2": "#036c96",
    "--theme-color3": "#ebf2ff",
    "--shadow-color1": "#352a7e",
    "--shadow-color2": "#101536",
    "--border-color1": "#080126",
    "--background-col": "#c6cede",
    "ALIVE_COLOR": "#00246B",
    "DEAD_COLOR": "#CADCFC",
  },
  green: {
    "--primary-color": "#0a5e05",
    "--theme-color1": "#63b163",
    "--theme-color2": "#04883e",
    "--theme-color3": "#e1f0e1",
    "--shadow-color1": "#306830",
    "--shadow-color2": "#0d2b0d",
    "--border-color1": "#032e03",
    "--background-col": "#c3e2c3",
    "ALIVE_COLOR": "#006b07", 
    "DEAD_COLOR": "#cafccf", 
  },
  red: {
    "--primary-color": "#a60909",
    "--theme-color1": "#f27474",
    "--theme-color2": "#920404",
    "--theme-color3": "#ffe6e6",
    "--shadow-color1": "#660303",
    "--shadow-color2": "#1e0101",
    "--border-color1": "#200000",
    "--background-col": "#edc9c9",
    "ALIVE_COLOR": "#6b0000", 
    "DEAD_COLOR": "#fccaca", 
  },
};

document.addEventListener("DOMContentLoaded", function () {
  // Generate the grid
  for (let i = 0; i < HEIGHT; i++) {
    // Push an empty array for each row
    for (let j = 0; j < WIDTH; j++) {
      cells[i][j] = DEAD; // Initialize cell state
      // Create a new cell element
      const cell = document.createElement("div");
      cell.classList.add("cell");
      // Append the cell to the grid container
      gridContainer.appendChild(cell);
    }
  }

  gridContainer.style.gridTemplateRows = `repeat(${HEIGHT}, calc((100%) / ${HEIGHT}))`;
  gridContainer.style.gridTemplateColumns = `repeat(${WIDTH}, calc((100%) / ${WIDTH}))`;
  // set grid container size according to ratio
  gridContainer.style.minHeight = "30vw";
  gridContainer.style.minWidth = "60vw";
  handleDropdowns();
  addEventListenersToCells();
  drawCells();
});

// Map to store event listener functions for each cell
const cellEventListeners = new Map();

function addEventListenersToCells() {
  const cellElements = document.querySelectorAll(".cell");
  cellElements.forEach(function (cell, index) {
    const listener = function () {
      handleClick(index);
    };
    cellEventListeners.set(cell, listener);
    cell.addEventListener("click", listener);
  });
}

function removeEventListenersFromCells() {
  const cellElements = document.querySelectorAll(".cell");
  cellElements.forEach(function (cell) {
    const listener = cellEventListeners.get(cell);
    if (listener) {
      cell.removeEventListener("click", listener);
      cellEventListeners.delete(cell);
    }
  });
}

function handleClick(i) {
  const row = Math.floor(i / WIDTH);
  const col = i % WIDTH;
  // Toggle cell state
  cells[row][col] = cells[row][col] === ALIVE ? DEAD : ALIVE;
  // Redraw cells
  drawCells();
}

function selectTheme(themeName) {
  const theme = themeslist[themeName];
  if (theme) {
    const root = document.documentElement;
    for (const key in theme) {
      root.style.setProperty(key, theme[key]);
    }
    ALIVE_COLOR = theme["ALIVE_COLOR"];
    DEAD_COLOR = theme["DEAD_COLOR"];
  }
  drawCells();
}

function increaseSpeed() {
  // increase the speed of the animation
  if (animationSpeed > 1) {
    animationSpeed /= 1.1;
  }
}

function decreaseSpeed() {
  // decrease the speed of the animation
  animationSpeed *= 1.1;
}

// draw the cells according to the state
// using style of "cell" class to change the color of the cell, iterate over it
function drawCells() {
  const cellElements = gridContainer.querySelectorAll(".cell");
  cells.forEach((row, i) => {
    row.forEach((cell, j) => {
      cellElements[i * WIDTH + j].style.backgroundColor =
        cell === ALIVE ? ALIVE_COLOR : DEAD_COLOR;
    });
  });
}

function isEmpty() {
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      if (cells[i][j] === ALIVE) {
        return false;
      }
    }
  }
  return true;
}

function startAnimation() {
  // check if the grid is empty,
  // if not then start the animation and start the game
  if (areEventListenersAdded) {
    removeEventListenersFromCells();
    areEventListenersAdded = false;
  }
  const playPauseIcon = document.getElementById("play-pause-icon");
  if (isEmpty()) {
    playPauseIcon.src = "./images/Play-Button.svg";
    if (!areEventListenersAdded) {
      addEventListenersToCells();
      areEventListenersAdded = true;
    }
    isAnimating = false;
    isStarted = false;
  } else {
    // if game is not started, set it to true
    // if pause is clicked, pause the game
    isAnimating = !isAnimating;
    // check if the game is started
    // if not, set it to true
    if (isStarted == false) {
      isStarted = true;
    }
    // change the icon according to the state
    playPauseIcon.src = isAnimating
      ? "./images/Pause-Button.svg"
      : "./images/Play-Button.svg";
  }
  if (isAnimating) {
    animate();
  }
}

//randomGrid()
function randomGrid() {
  // if the game is not started and not animating
  // then allow user to set the cells to random state
  if (!isStarted && !isAnimating) {
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        cells[i][j] = Math.random() < 0.2 ? ALIVE : DEAD;
      }
    }
    drawCells();
  }
}

function clearGrid() {
  // if the game is paused
  // then allow user to clear the grid
  if (!isAnimating) {
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        cells[i][j] = DEAD;
      }
    }
    drawCells();
  }
  isStarted = false;
  if (!areEventListenersAdded) {
    addEventListenersToCells();
    areEventListenersAdded = true;
  }
}

function toggleWarp() {
  isWarpEnabled = !isWarpEnabled;
}

function toggleGrid() {
  isGridVisible = !isGridVisible;
  var root = document.documentElement;
  // Get the computed styles of the root element
  var style = getComputedStyle(root);
  // get border-color1 from the root
  let borderColor = style.getPropertyValue("--border-color1");
  let borderVal = isGridVisible ? `solid 0.001rem ${borderColor}` : "none";
  const cellElements = gridContainer.querySelectorAll(".cell");
  cellElements.forEach((cell) => {
    cell.style.border = borderVal;
  });
}

function warpOnEdges(cells) {
  const nextGeneration = [];

  for (let i = 0; i < HEIGHT; i++) {
    nextGeneration.push([]);
    for (let j = 0; j < WIDTH; j++) {
      const left = (j - 1 + WIDTH) % WIDTH;
      const right = (j + 1) % WIDTH;
      const above = (i - 1 + HEIGHT) % HEIGHT;
      const below = (i + 1) % HEIGHT;

      let numNeighbors = 0;
      // Check all 8 neighbors
      if (cells[above][left] === ALIVE) numNeighbors++;
      if (cells[above][j] === ALIVE) numNeighbors++;
      if (cells[above][right] === ALIVE) numNeighbors++;
      if (cells[i][left] === ALIVE) numNeighbors++;
      if (cells[i][right] === ALIVE) numNeighbors++;
      if (cells[below][left] === ALIVE) numNeighbors++;
      if (cells[below][j] === ALIVE) numNeighbors++;
      if (cells[below][right] === ALIVE) numNeighbors++;

      if (cells[i][j] === ALIVE && (numNeighbors === 2 || numNeighbors === 3)) {
        nextGeneration[i][j] = ALIVE;
      } else if (cells[i][j] === DEAD && numNeighbors === 3) {
        nextGeneration[i][j] = ALIVE;
      } else {
        nextGeneration[i][j] = DEAD;
      }
    }
  }

  return nextGeneration;
}

function noWarpOnEdges(cells) {
  const nextGeneration = [];
  for (let i = 0; i < HEIGHT; i++) {
    nextGeneration.push([]);
    for (let j = 0; j < WIDTH; j++) {
      const left = j - 1;
      const right = j + 1;
      const above = i - 1;
      const below = i + 1;

      let numNeighbors = 0;
      // Check all 8 neighbors
      if (j > 0 && cells[i][left] === ALIVE) numNeighbors++;
      if (j < WIDTH - 1 && cells[i][right] === ALIVE) numNeighbors++;
      if (i > 0 && cells[above][j] === ALIVE) numNeighbors++;
      if (i < HEIGHT - 1 && cells[below][j] === ALIVE) numNeighbors++;
      if (i > 0 && j > 0 && cells[above][left] === ALIVE) numNeighbors++;
      if (i > 0 && j < WIDTH - 1 && cells[above][right] === ALIVE)
        numNeighbors++;
      if (i < HEIGHT - 1 && j > 0 && cells[below][left] === ALIVE)
        numNeighbors++;
      if (i < HEIGHT - 1 && j < WIDTH - 1 && cells[below][right] === ALIVE)
        numNeighbors++;

      if (cells[i][j] === ALIVE && (numNeighbors === 2 || numNeighbors === 3)) {
        nextGeneration[i][j] = ALIVE;
      } else if (cells[i][j] === DEAD && numNeighbors === 3) {
        nextGeneration[i][j] = ALIVE;
      } else {
        nextGeneration[i][j] = DEAD;
      }
    }
  }

  return nextGeneration;
}

function animate() {
  // Update cells with the new generation
  if (isWarpEnabled) {
    cells = warpOnEdges(cells);
  } else {
    cells = noWarpOnEdges(cells);
  }
  setTimeout(() => {
    drawCells(); // Draw cells after a delay
    if (isAnimating) {
      requestAnimationFrame(animate); // Keep animating
    }
  }, animationSpeed);
}

//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
function handleDropdowns() {
  var themesDropdown = document.getElementsByClassName("color-themes");
  var presetsDropdown = document.getElementsByClassName("presets");
  for (let i = 0; i < themesDropdown.length; i++) {
    themesDropdown[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    });
  }
  for (let i = 0; i < presetsDropdown.length; i++) {
    presetsDropdown[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    });
  }
}

// anime({
//   targets: "div.heading",
//   translateY: [
//     { value: 200, duration: 500 },
//     { value: 0, duration: 800 },
//   ],
//   delay: function (el, i, l) {
//     return i * 1000;
//   },
//   loop: true,
// });
