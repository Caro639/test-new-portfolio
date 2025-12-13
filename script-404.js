// Jeu d'évitement d'astéroïdes (mini-jeu simple)
const canvas = document.getElementById("spaceGame");
const ctx = canvas.getContext("2d");
// Vaisseau et astéroïdes dessinés en JS
const ship = { x: 330, y: 380, w: 40, h: 60, speed: 18 };
let asteroids = [];
let lasers = [];
let score = 0;
let gameOver = false;
function drawShip() {
  // Corps du vaisseau
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ship.x + ship.w / 2, ship.y);
  ctx.lineTo(ship.x, ship.y + ship.h);
  ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
  ctx.closePath();
  ctx.fillStyle = "#ad45c6";
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
  // Hublot
  ctx.beginPath();
  ctx.arc(ship.x + ship.w / 2, ship.y + ship.h * 0.6, 8, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.globalAlpha = 1;
}
function drawAsteroids() {
  asteroids.forEach((a) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(a.x + a.size / 2, a.y + a.size / 2, a.size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#888";
    ctx.shadowColor = "#ad45c6";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
  });
}
function moveAsteroids() {
  asteroids.forEach((a) => {
    a.y += a.speed;
  });
  asteroids = asteroids.filter((a) => a.y < canvas.height);
}
function spawnAsteroid() {
  const size = 20 + Math.random() * 18;
  const x = Math.random() * (canvas.width - size);
  asteroids.push({ x, y: -size, size, speed: 2 + Math.random() * 1.5 });
}
function checkCollision() {
  for (let a of asteroids) {
    if (
      ship.x < a.x + a.size &&
      ship.x + ship.w > a.x &&
      ship.y < a.y + a.size &&
      ship.y + ship.h > a.y
    ) {
      return true;
    }
  }
  return false;
}
function drawLasers() {
  ctx.save();
  lasers.forEach((l) => {
    ctx.beginPath();
    ctx.rect(l.x, l.y, 4, 18);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#ad45c6";
    ctx.shadowBlur = 8;
    ctx.fill();
  });
  ctx.restore();
}
function moveLasers() {
  lasers.forEach((l) => (l.y -= l.speed));
  lasers = lasers.filter((l) => l.y > -20);
}
function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px Audiowide, Arial";
  ctx.fillText("Score : " + score, 10, 30);
}
function checkLaserAsteroidCollision() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    for (let j = lasers.length - 1; j >= 0; j--) {
      const a = asteroids[i];
      const l = lasers[j];
      // collision simple (laser = rect, astéroïde = cercle)
      const distX = Math.abs(l.x + 2 - (a.x + a.size / 2));
      const distY = Math.abs(l.y + 9 - (a.y + a.size / 2));
      if (distX < a.size / 2 + 2 && distY < a.size / 2 + 9) {
        asteroids.splice(i, 1);
        lasers.splice(j, 1);
        score += 10;
        break;
      }
    }
  }
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawAsteroids();
  drawLasers();
  drawScore();
  moveAsteroids();
  moveLasers();
  checkLaserAsteroidCollision();
  // Moins d'astéroïdes au début, fréquence qui augmente lentement
  let spawnRate = 0.012 + Math.min(score * 0.0002, 0.02); // max 0.032
  if (Math.random() < spawnRate) spawnAsteroid();
  if (checkCollision()) {
    gameOver = true;
    ctx.fillStyle = "#ad45c6";
    ctx.font = "bold 32px Audiowide, Arial";
    const text = "GAME OVER";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (canvas.width - textWidth) / 2, 250);
    ctx.font = "bold 20px Audiowide, Arial";
    const scoreText = "Score : " + score;
    const scoreWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, (canvas.width - scoreWidth) / 2, 290);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    const infoText = "Rafraîchis la page pour rejouer !";
    const infoWidth = ctx.measureText(infoText).width;
    ctx.fillText(infoText, (canvas.width - infoWidth) / 2, 340);
    return;
  }
  if (!gameOver) {
    score++;
    requestAnimationFrame(gameLoop);
  }
}
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.key === "ArrowLeft" && ship.x > 0) ship.x -= ship.speed;
  if (e.key === "ArrowRight" && ship.x < canvas.width - ship.w)
    ship.x += ship.speed;
  if (e.code === "Space") {
    // Tir laser
    lasers.push({
      x: ship.x + ship.w / 2 - 2,
      y: ship.y - 18,
      speed: 12,
    });
  }
});
// Contrôles tactiles pour mobile
// Déplacement continu sur mobile
let leftInterval, rightInterval;
const leftBtn = document.getElementById("btn-left");
const rightBtn = document.getElementById("btn-right");
const fireBtn = document.getElementById("btn-fire");

leftBtn.addEventListener("touchstart", function (e) {
  if (e.cancelable) e.preventDefault();
  if (leftInterval) clearInterval(leftInterval);
  leftInterval = setInterval(function () {
    if (!gameOver && ship.x > 0) ship.x -= ship.speed;
  }, 40);
});
leftBtn.addEventListener("touchend", function () {
  clearInterval(leftInterval);
});
rightBtn.addEventListener("touchstart", function (e) {
  if (e.cancelable) e.preventDefault();
  if (rightInterval) clearInterval(rightInterval);
  rightInterval = setInterval(function () {
    if (!gameOver && ship.x < canvas.width - ship.w) ship.x += ship.speed;
  }, 40);
});
rightBtn.addEventListener("touchend", function () {
  clearInterval(rightInterval);
});
fireBtn.addEventListener(
  "touchstart",
  function (e) {
    if (e.cancelable) e.preventDefault();
    if (!gameOver)
      lasers.push({
        x: ship.x + ship.w / 2 - 2,
        y: ship.y - 18,
        speed: 12,
      });
  },
  { passive: false }
);
// Lancer le jeu directement
gameLoop();
// Bouton rejouer
document.getElementById("btn-replay").addEventListener("click", function () {
  window.location.reload();
});
