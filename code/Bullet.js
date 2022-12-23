class Bullet {
  constructor(ctx, x, y, angle) {
    this.ctx = ctx;
    this.angle = angle;
    this.initial = { x, y };
    this.relPosition = { x, y };
    this.absPosition = Utils.getAbsPosition(this.relPosition, this.angle, this.initial);
    this.movement = {
      x: 0,
      y: -30
    };
  }

  init() {
    this.paintBullet();
  }

  move() {
    this.relPosition.x = this.relPosition.x + this.movement.x;
    this.relPosition.y = this.relPosition.y + this.movement.y;
    this.absPosition = Utils.getAbsPosition(this.relPosition, this.angle, this.initial);
    this.paintBullet();
  }

  tick(ctx) {
    this.ctx = ctx;
    this.move();
  }

  paintBullet() {
    const { x, y } = this.relPosition;
    this.ctx.save();
    horizontalCenter = this.initial.x + (3 / 2);
    verticalCenter = this.initial.y + (3 / 2);
    this.ctx.translate(horizontalCenter, verticalCenter);
    this.ctx.rotate((Math.PI / 180) * this.angle);
    this.ctx.translate(0 - horizontalCenter, 0 - verticalCenter);
    this.ctx.fillStyle = 'rgb(255, 234, 0)';
    this.ctx.fillRect(x, y, 5, 5);
    this.ctx.restore();
  }
}