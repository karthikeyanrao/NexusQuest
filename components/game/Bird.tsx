
const gameConfig = {
  width: 800,
  height: 600,
  gravity: 0.5,
  flapStrength: 8,
  pipeSpawnInterval: 2000, // milliseconds
};

const calculateScore = (distance: number): number => {
  return Math.floor(distance / 100);
};

export const difficultyLevels = {
  easy: {
    pipeSpeed: 2,
    pipeGap: 200,
  },
  medium: {
    pipeSpeed: 3,
    pipeGap: 150,
  },
  hard: {
    pipeSpeed: 4,
    pipeGap: 120,
  },
};

export class Bird {
  x: number;
  y: number;
  velocity: number;
  radius: number;
  color: string;

  private targetY: number;

  constructor() {
    this.x = gameConfig.width * 0.2;
    this.y = gameConfig.height / 2;
    this.targetY = this.y;
    this.velocity = 0;
    this.radius = 15;
    this.color = '#ff4d4d';

    // Add event listener once in constructor
    window.addEventListener('handMove', ((e: CustomEvent) => {
      this.targetY = e.detail.y;
    }) as EventListener);
  }

  update() {
    // Smooth movement towards target position
    const diff = this.targetY - this.y;
    this.velocity = diff * 0.15; // Increased responsiveness
    
    // Apply velocity with damping
    this.y += this.velocity * 0.8;

    // Clamp position within canvas
    this.y = Math.max(this.radius, Math.min(gameConfig.height - this.radius, this.y));
  }

  flap() {
    this.velocity = -gameConfig.flapStrength;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // Add glow effect
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#ff8080';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  }
}
