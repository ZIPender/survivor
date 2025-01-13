// src/monster.js
    import { random, distance, loadImage } from './utils.js';

    export class Monster {
      constructor(x, y, type, player, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.speed = random(1, 2);
        this.radius = type === 'boss' ? 30 : 15;
        this.health = type === 'boss' ? 100 : 20;
        this.damage = type === 'boss' ? 20 : 10;
        this.player = player;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = null;
        this.loadMonsterImage();
      }

      async loadMonsterImage() {
        let imagePath = '';
        if (this.type === 'ghost') {
          imagePath = '/assets/ghost.png';
        } else if (this.type === 'bat') {
          imagePath = '/assets/bat.png';
        } else if (this.type === 'boss') {
          imagePath = '/assets/boss.png';
        }
        this.image = await loadImage(imagePath);
      }

      update() {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
          this.x += (dx / dist) * this.speed;
          this.y += (dy / dist) * this.speed;
        }
      }

      draw(ctx) {
        if (this.image) {
          ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.type === 'boss' ? 'red' : (this.type === 'ghost' ? 'purple' : 'brown');
          ctx.fill();
          ctx.closePath();
        }
      }

      takeDamage(damage) {
        this.health -= damage;
      }
    }
