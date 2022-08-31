const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
const enemies = [];
let numberOfResources = 300;
let frame = 0;

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
};
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener("mouseleave", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

//game board
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }
  draw() {
    if (mouse.x && mouse.y && collision(this, mouse)) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
}

function createGrid() {
  for (let y = cellSize; y < canvas.height; y += cellSize) {
    // righe (saltando la prima barra di controllo)
    for (let x = 0; x < canvas.width; x += cellSize) {
      // loop delle colonne
      gameGrid.push(new Cell(x, y));
    }
  }
}

createGrid();

function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}

// projectiles

//defenders
class Defender {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
    this.shooting = false;
    this.health = 100;
    this.projectiles = [];
    this.timer = 0;
  }
  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "gold";
    ctx.font = "20px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
  }
}
canvas.addEventListener("click", function () {
  // operatore % ci restituisce il resto di una divisione. Se la x corrente del mouse è 250 - 100 il modulus è 50
  const gridPositionX = mouse.x - (mouse.x % cellSize); // the closest horizontal grid to the left
  const gridPositionY = mouse.y - (mouse.y % cellSize);
  if (gridPositionY < cellSize) return; // se si cliccda sulla barra di controllo non succede nulla

  defenders.forEach((def) => {
    // if (def.x === gridPositionX && def.y === gridPositionY) return;
    console.log(def.x === gridPositionX && def.y === gridPositionY);
  });

  for (let i = 0; i < defenders.length; i++) {
    if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY)
      return;
  }

  let defenderCost = 100;
  if (numberOfResources >= defenderCost) {
    defenders.push(new Defender(gridPositionX, gridPositionY));
    numberOfResources -= defenderCost;
  }
});

function handleDefenders() {
  for (let i = 0; i < defenders.length; i++) {
    defenders[i].draw();
  }
}

//enemies
class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width;
    this.y = verticalPosition;
    this.width = cellSize;
    this.height = cellSize;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
  }
  update() {
    this.x -= this.movement;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
  }
}

function handleEnemies() {
  for (i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();
  }
  if (frame % 100 === 0) {
    let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize;
    enemies.push(new Enemy(verticalPosition));
  }
}

// resources

// utilities

function handleGameStatus() {
  ctx.fillStyle = "gold";
  ctx.font = "20px Arial";
  ctx.fillText("Resources: " + numberOfResources, 20, 55);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleDefenders();
  handleGameStatus();
  frame++;
  requestAnimationFrame(animate);
}
animate();

function collision(first, second) {
  if (
    !(
      first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y
    )
  ) {
    return true;
  }
}
