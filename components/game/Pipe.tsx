import { gameConfig } from '../../lib/game';
import type { Bird } from './Bird';

export class Pipe {
  x: number;
  gapY: number;
  width: number;
  gapHeight: number;
  speed: number;
  passed: boolean;
  color: string;

  constructor() {
    this.x = gameConfig.width;
    this.width = 60;
    this.gapHeight = 150;
    this.gapY = Math.random() * (gameConfig.height - this.gapHeight - 100) + 50;
    this.speed = 3;
    this.passed = false;
    this.color = '#4CAF50';
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw top pipe
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, 0, this.width, this.gapY);

    // Draw bottom pipe
    ctx.fillRect(
      this.x,
      this.gapY + this.gapHeight,
      this.width,
      gameConfig.height - (this.gapY + this.gapHeight)
    );

    // Add gradient effect
    const gradient = ctx.createLinearGradient(
      this.x,
      0,
      this.x + this.width,
      0
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, 0, this.width, gameConfig.height);
  }

  checkCollision(bird: Bird): boolean {
    const birdRight = bird.x + bird.radius;
    const birdLeft = bird.x - bird.radius;
    const birdTop = bird.y - bird.radius;
    const birdBottom = bird.y + bird.radius;

    return (
      birdRight > this.x &&
      birdLeft < this.x + this.width &&
      (birdTop < this.gapY || birdBottom > this.gapY + this.gapHeight)
    );
  }
}
