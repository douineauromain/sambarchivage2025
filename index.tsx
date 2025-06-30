/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// On importe UNIQUEMENT le Playground.
import {Playground} from './playground';

const EMPTY_CODE = `function setup() {
  createCanvas(windowWidth, windowHeight);
}
function draw() {
  background(175);
}`;

const STARTUP_CODE = `
// --- Game Configuration ---
let player;
let collectibles = [];
let obstacles = [];
let powerups = [];
let score = 0;
let gameState = 'start'; // 'start', 'playing', 'gameOver'

let startTime;
const GAME_DURATION = 30; // Game duration in seconds
let gameOverReason = '';

// --- Player Object ---
class Player {
  constructor() {
    this.x = width / 2;
    this.w = 80;
    this.h = 60;
    this.shieldActive = false;
    this.multiplierActive = false;
    this.powerupTimer = 0;
  }

  update() {
    this.x = lerp(this.x, mouseX, 0.1);
    this.x = constrain(this.x, this.w / 2, width - this.w / 2);

    if (this.shieldActive || this.multiplierActive) {
      this.powerupTimer--;
      if (this.powerupTimer <= 0) {
        this.shieldActive = false;
        this.multiplierActive = false;
      }
    }
  }

  display() {
    let y = height - 80;
    if (this.shieldActive) this.drawAura(y, (frameCount * 2) % 360, 30);
    if (this.multiplierActive) this.drawAura(y, 50, 50);

    fill(30, 80, 80);
    stroke(30, 80, 50);
    strokeWeight(3);
    rectMode(CENTER);
    rect(this.x, y, this.w, this.h, 5);

    this.drawFeather(this.x - 35, y - 20, -QUARTER_PI, 210);
    this.drawFeather(this.x + 35, y - 20, QUARTER_PI, 60);
  }

  drawAura(y, hue, alpha) {
    let auraSize = this.w + 40 + sin(frameCount * 0.2) * 10;
    fill(hue, 80, 100, alpha);
    noStroke();
    ellipse(this.x, y, auraSize, auraSize);
  }

  drawFeather(x, y, angle, hue) {
    push();
    translate(x, y);
    rotate(angle);
    noStroke();
    fill(hue, 90, 90);
    arc(0, 0, 70, 20, PI, TWO_PI);
    stroke(hue, 90, 60);
    strokeWeight(2);
    line(0, -5, 0, -35);
    pop();
  }

  activatePowerup(type) {
    this.powerupTimer = 300; // 5 seconds
    this.shieldActive = (type === 'shield');
    this.multiplierActive = (type === 'multiplier');
  }
}

// --- Item Class ---
class Item {
  constructor(x, y, emoji, type, points, fatal = false) {
    this.x = x;
    this.y = y;
    this.emoji = emoji;
    this.type = type;
    this.points = points;
    this.fatal = fatal; // Is this item a game-over trigger?
    this.size = 50;
    this.speed = random(2, 5);
  }

  update() { this.y += this.speed; }
  display() { textSize(this.size); textAlign(CENTER, CENTER); text(this.emoji, this.x, this.y); }
  isOffscreen() { return this.y > height + this.size; }
  hits(player) {
    let playerY = height - 80;
    return dist(this.x, this.y, player.x, playerY) < this.size / 2 + player.w / 2;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  player = new Player();
  textAlign(CENTER, CENTER);
}

function draw() {
  drawSambaBackground();
  if (gameState === 'start') displayStartScreen();
  else if (gameState === 'playing') runGame();
  else if (gameState === 'gameOver') displayGameOverScreen();
}

function runGame() {
  // --- Timer Check ---
  let elapsedTime = (frameCount - startTime) / 60;
  if (elapsedTime >= GAME_DURATION) {
    gameState = 'gameOver';
    gameOverReason = 'time';
    return;
  }

  player.update();
  player.display();

  // --- Item Spawning ---
  if (frameCount % 40 === 0) collectibles.push(new Item(random(width), -50, '📄', 'collectible', 10));
  if (frameCount % 120 === 0) collectibles.push(new Item(random(width), -50, '💻', 'collectible', 25));
  if (frameCount % 250 === 0) collectibles.push(new Item(random(width), -50, '📦', 'collectible', 50));
  if (frameCount % 150 === 0) obstacles.push(new Item(random(width), -50, '🍮', 'obstacle', -40));
  if (frameCount % 400 === 0) powerups.push(new Item(random(width), -50, '🪶', 'powerup', 'shield'));
  if (frameCount % 550 === 0) powerups.push(new Item(random(width), -50, '❤️', 'powerup', 'multiplier'));
  // The fatal "SVP Info" item - rare but dangerous!
  if (frameCount % 601 === 0) obstacles.push(new Item(random(width), -50, '🚨', 'obstacle', 0, true));

  handleItems(collectibles);
  handleItems(obstacles);
  handleItems(powerups);

  displayScore(elapsedTime);
}

function handleItems(itemArray) {
  for (let i = itemArray.length - 1; i >= 0; i--) {
    let item = itemArray[i];
    item.update();
    item.display();

    if (item.hits(player)) {
      if (item.type === 'obstacle' && item.fatal) {
        gameState = 'gameOver';
        gameOverReason = 'fatal';
        return; // Exit immediately
      }

      if (item.type === 'collectible') {
        let pointsToAdd = player.multiplierActive ? item.points * 2 : item.points;
        score += pointsToAdd;
      } else if (item.type === 'obstacle') {
        if (player.shieldActive) player.shieldActive = false;
        else {
          score += item.points;
          if (score < 0) score = 0;
        }
      } else if (item.type === 'powerup') {
        player.activatePowerup(item.points);
      }
      itemArray.splice(i, 1);
    } else if (item.isOffscreen()) {
      itemArray.splice(i, 1);
    }
  }
}

function drawSambaBackground() {
  let hue = (frameCount * 0.5) % 360;
  background(hue, 90, 90);
  stroke(hue, 50, 100, 20);
  strokeWeight(10);
  for(let i = 0; i < 5; i++) {
    let lineY = (frameCount * 5 + i * height/4) % height;
    line(0, lineY, width, lineY);
  }
}

function displayScore(elapsedTime) {
  fill(0, 0, 100);
  noStroke();
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score : " + score, 20, 20);

  textAlign(RIGHT, TOP);
  let timeLeft = ceil(GAME_DURATION - elapsedTime);
  text("Temps : " + timeLeft, width - 20, 20);

  textAlign(LEFT, TOP);
  if(player.shieldActive) { fill(200, 80, 100); text("BOUCLIER PAILLETTES !", 20, 60); }
  if(player.multiplierActive) { fill(50, 100, 100); text("SCORE x2 ! MERCI LE HUB !", 20, 60); }
}

function displayStartScreen() {
  fill(0, 0, 0, 50);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(0, 0, 100);
  noStroke();
  textAlign(CENTER, CENTER);

  textSize(min(width/10, 64));
  text("SAMBA DE GALEC", width / 2, height / 2 - 180);
  textSize(min(width/25, 32));
  text("Archivez, Dansez, Défilez !", width / 2, height / 2 - 120);

  textSize(min(width/40, 20));
  text("Collectez Papiers 📄, Fichiers 💻 et Cartons 📦.", width / 2, height / 2 - 50);
  text("Attrapez Plumes 🪶 et Likes ❤️ pour des bonus.", width / 2, height / 2 - 20);
  fill(300, 90, 100);
  text("La partie dure 30 secondes. ÉVITEZ l'alerte SVP Info 🚨 !", width / 2, height / 2 + 20);

  fill(0, 0, 100);
  textSize(min(width/30, 28));
  text("Cliquez pour commencer !", width / 2, height / 2 + 100);

  // --- AJOUT DES CRÉDITS ---
  fill(0, 0, 100, 50); // Blanc, 50% transparent
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text("Jeu créé par Romain Douineau de l'équipe maCave à l'aide de Gemini 🦾🧔🏽", width - 10, height - 10);
}

function displayGameOverScreen() {
  fill(0, 0, 0, 50);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(0, 0, 100);
  noStroke();
  textAlign(CENTER, CENTER);

  let reasonText = '';
  if (gameOverReason === 'time') {
    reasonText = "Temps écoulé !";
  } else if (gameOverReason === 'fatal') {
    reasonText = "Oh non ! SVP Info a tout confisqué !";
  }

  textSize(min(width/15, 64));
  text(reasonText, width / 2, height / 2 - 100);

  textSize(min(width/25, 32));
  text("Votre score final : " + score, width / 2, height / 2);

  textSize(min(width/30, 28));
  text("Cliquez pour rejouer", width / 2, height / 2 + 80);
  
  // --- AJOUT DES CRÉDITS ---
  fill(0, 0, 100, 50); // Blanc, 50% transparent
  textSize(14);
  textAlign(RIGHT, BOTTOM);
  text("Jeu créé par Romain Douineau de l'équipe maCave à l'aide de Gemini 🦾🧔🏽", width - 10, height - 10);
}

function mousePressed() {
  if (gameState === 'start' || gameState === 'gameOver') {
    score = 0;
    collectibles = [];
    obstacles = [];
    powerups = [];
    player = new Player();
    startTime = frameCount;
    gameState = 'playing';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
`;

// Le code de démarrage est maintenant très simple.
document.addEventListener('DOMContentLoaded', async (event) => {
  const rootElement = document.querySelector('#root')! as HTMLElement;

  const playground = new Playground();
  rootElement.appendChild(playground);

  // On dit simplement au playground quel code p5.js il doit exécuter.
  playground.setDefaultCode(EMPTY_CODE);
  playground.setCode(STARTUP_CODE);
});
