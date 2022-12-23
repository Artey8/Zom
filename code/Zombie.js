class Zombie {
  constructor(ctx, damagePlayer, speed, health) {
    this.speed = speed;
    this.damagePlayer = damagePlayer;
    this.ctx = ctx;
    this.health = health;
    this.startingHealth = health;
    this.relPosition = { x: this.getRandomX(), y: -100 }
    this.angle = 0;
    this.canBite = true;
  }

  getRandomX() {
    let x = Math.random() * 1000;
    while (x < 0 && x > 1000) {
      x = Math.random() * 1000;
    }
    return x
  }

  move(playerPosition) {
    let px = playerPosition.x;
    let py = playerPosition.y;
    if (py < this.relPosition.y) {
      this.relPosition.y -= this.speed;
      if (px < this.relPosition.x) {
        this.relPosition.x -= this.speed;
      } else if (px > this.relPosition.x) {
        this.relPosition.x += this.speed;
      }
    } else if (py > this.relPosition.y) {
      this.relPosition.y += this.speed;
      if (px < this.relPosition.x) {
        this.relPosition.x -= this.speed;
      } else if (px > this.relPosition.x) {
        this.relPosition.x += this.speed;
      }
    } else if (px < this.relPosition.x) {
      this.relPosition.x -= this.speed;
      if (py < this.relPosition.y) {
        this.relPosition.y -= this.speed;
      } else if (py > this.relPosition.y) {
        this.relPosition.y += this.speed;
      }
    } else if (px > this.relPosition.x) {
      this.relPosition.x += this.speed;
      if (py < this.relPosition.y) {
        this.relPosition.y -= this.speed;
      } else if (py > this.relPosition.y) {
        this.relPosition.y += this.speed;
      }
    }

    if ((this.relPosition.x >= px && this.relPosition.x <= px + 30) && (this.relPosition.y >= py && this.relPosition.y <= py + 30)) {
      if (this.canBite) {this.bite();}
    }
  }

  bite() {
    this.canBite = false;
    this.damagePlayer();
    setTimeout(() => {
      this.canBite = true;
    }, 1000)
  }

  tick(ctx, playerPosition) {
    this.ctx = ctx;
    this.move(playerPosition);
    this.paint();
  }

  paint() {
    let { x, y } = this.relPosition;
    this.position = Utils.getAbsPosition({ x, y }, 0, { x, y });
    this.ctx.fillStyle = 'rgb(100, 255, 100)';
    this.ctx.fillRect(x, y, 30, 30);
    this.ctx.fillStyle = 'rgb(255, 0, 0)';
    this.ctx.fillRect(x, y, 30, 5);
    this.ctx.fillStyle = 'rgb(0, 255, 0)';
    this.ctx.fillRect(x, y, this.health * (30 / this.startingHealth), 5);
  }
}