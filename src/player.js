// src/player.js
    import { loadImage } from './utils.js';

    export class Player {
      constructor(x, y, canvasWidth, canvasHeight) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.radius = 15;
        this.health = 100;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.image = null;
        this.loadPlayerImage();
      }

      async loadPlayerImage() {
        this.image = await loadImage('/assets/player.png');
      }

      update(keys) {
        if (keys.up) this.y -= this.speed;
        if (keys.down) this.y += this.speed;
        if (keys.left) this.x -= this.speed;
        if (keys.right) this.x += this.speed;

        // Keep player within canvas bounds
        this.x = Math.max(this.radius, Math.min(this.x, this.canvasWidth - this.radius));
        this.y = Math.max(this.radius, Math.min(this.y, this.canvasHeight - this.radius));
      }

      draw(ctx) {
        if (this.image) {
          ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'blue';
          ctx.fill();
          ctx.closePath();
        }
      }

      takeDamage(damage) {
        this.health -= damage;
        if (this.health < 0) {
          this.health = 0;
        }
      }
    }
