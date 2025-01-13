// src/game.js
    import { Player } from './player.js';
    import { Monster } from './monster.js';
    import { UI } from './ui.js';
    import { random, distance } from './utils.js';

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1600;
    canvas.height = 1200;

    const player = new Player(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
    const ui = new UI(canvas.width, canvas.height);
    let monsters = [];
    let keys = { up: false, down: false, left: false, right: false };
    let wave = 1;
    let isLevelUp = false;
    let powerUps = [];
    let level = 1;
    const gridSize = 50;

    function drawGrid() {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function spawnMonster() {
      const side = Math.floor(random(0, 4));
      let x, y;
      if (side === 0) { // Top
        x = random(0, canvas.width);
        y = -20;
      } else if (side === 1) { // Right
        x = canvas.width + 20;
        y = random(0, canvas.height);
      } else if (side === 2) { // Bottom
        x = random(0, canvas.width);
        y = canvas.height + 20;
      } else { // Left
        x = -20;
        y = random(0, canvas.height);
      }

      const monsterType = random(0, 1) > 0.5 ? 'ghost' : 'bat';
      monsters.push(new Monster(x, y, monsterType, player, canvas.width, canvas.height));
    }

    function spawnBoss() {
      const side = Math.floor(random(0, 4));
      let x, y;
      if (side === 0) { // Top
        x = random(0, canvas.width);
        y = -20;
      } else if (side === 1) { // Right
        x = canvas.width + 20;
        y = random(0, canvas.height);
      } else if (side === 2) { // Bottom
        x = random(0, canvas.width);
        y = canvas.height + 20;
      } else { // Left
        x = -20;
        y = random(0, canvas.height);
      }
      monsters.push(new Monster(x, y, 'boss', player, canvas.width, canvas.height));
    }

    function checkCollisions() {
      for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        const dist = distance(player.x, player.y, monster.x, monster.y);
        if (dist < player.radius + monster.radius) {
          player.takeDamage(monster.damage);
          monsters.splice(i, 1);
          i--;
        }
      }
    }

    function handleLevelUp() {
      isLevelUp = true;
      powerUps = [
        { name: 'Increase Speed', effect: () => player.speed += 2 },
        { name: 'Increase Health', effect: () => player.health += 20 },
        { name: 'Increase Damage', effect: () => {
          monsters.forEach(monster => monster.damage += 5)
        } },
      ];
    }

    function selectPowerUp(index) {
      powerUps[index].effect();
      isLevelUp = false;
      level++;
    }

    function gameLoop() {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      if (isLevelUp) {
        ui.drawLevelUpScreen(ctx, powerUps, selectPowerUp);
      } else {
        player.update(keys);
        player.draw(ctx);

        monsters.forEach(monster => {
          monster.update();
          monster.draw(ctx);
        });

        checkCollisions();

        if (monsters.length === 0) {
          if (wave % 10 === 0) {
            spawnBoss();
          } else {
            for (let i = 0; i < wave; i++) {
              spawnMonster();
            }
          }
          wave++;
          if (wave % 5 === 0) {
            handleLevelUp();
          }
        }

        ui.draw(ctx, wave, player.health);

        if (player.health <= 0) {
          resetGame();
        }
      }

      requestAnimationFrame(gameLoop);
    }

    function resetGame() {
      monsters = [];
      wave = 1;
      player.health = 100;
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
      level = 1;
    }

    document.addEventListener('keydown', (e) => {
      if (isLevelUp) return;
      if (e.code === 'ArrowUp') keys.up = true;
      if (e.code === 'ArrowDown') keys.down = true;
      if (e.code === 'ArrowLeft') keys.left = true;
      if (e.code === 'ArrowRight') keys.right = true;
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowUp') keys.up = false;
      if (e.code === 'ArrowDown') keys.down = false;
      if (e.code === 'ArrowLeft') keys.left = false;
      if (e.code === 'ArrowRight') keys.right = false;
    });

    canvas.addEventListener('click', (e) => {
      if (isLevelUp) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        powerUps.forEach((powerUp, index) => {
          const powerUpY = canvas.height / 2 + index * 50;
          if (x > canvas.width / 4 && x < canvas.width * 3 / 4 && y > powerUpY - 20 && y < powerUpY + 20) {
            selectPowerUp(index);
          }
        });
      }
    });

    gameLoop();
