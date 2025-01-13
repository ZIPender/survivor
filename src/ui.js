// src/ui.js
    export class UI {
      constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
      }

      draw(ctx, wave, playerHealth) {
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText(`Wave: ${wave}`, 10, 30);
        ctx.fillText(`Health: ${playerHealth}`, 10, 60);
      }

      drawLevelUpScreen(ctx, powerUps, onSelect) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Level Up! Choose a Power-Up:', this.canvasWidth / 2, this.canvasHeight / 4);

        powerUps.forEach((powerUp, index) => {
          const y = this.canvasHeight / 2 + index * 50;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(this.canvasWidth / 4, y - 20, this.canvasWidth / 2, 40);
          ctx.fillStyle = 'black';
          ctx.fillText(powerUp.name, this.canvasWidth / 2, y + 10);
        });
      }
    }
