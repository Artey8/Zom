// class Player {
//   constructor(ctx, x, y, angle) {
//     this.ctx = ctx;
//     this.angle = angle;
//     this.relPosition = { x, y };
//     this.absPosition = Utils.getAbsPosition(this.relPosition, this.angle);
//   }

//   init() {
//     this.paintPlayer();
//   }

//   tick(ctx) {
//     this.ctx = ctx;
//     this.paintPlayer();
//   }

//   paintPlayer() {
//     let horizontalCenter = this.relPosition.x + (25 / 2);
//     let verticalCenter = this.relPosition.y + (25 / 2);
//     // player
//     this.ctx.save();
//     this.ctx.translate(horizontalCenter, verticalCenter);
//     this.ctx.rotate((Math.PI / 180) * this.angle);
//     this.ctx.translate(0 - horizontalCenter, 0 - verticalCenter);
//     this.ctx.rotate(0);
//     this.ctx.fillStyle = 'rgb(235, 131, 52)';
//     this.ctx.fillRect(this.relPosition.x, this.relPosition.y, 25, 25);
//     // gun
//     this.ctx.fillStyle = 'rgb(0, 0, 0)';
//     this.ctx.fillRect(this.relPosition.x + 25, this.relPosition.y - 5, 5, 20);
//     this.ctx.restore();
//   }
// }

player = (ctx, x, y, rotation) => {
  horizontalCenter = x + (25 / 2);
  verticalCenter = y + (25 / 2);
  // player
  ctx.save();
  ctx.translate(horizontalCenter, verticalCenter);
  ctx.rotate((Math.PI / 180) * rotation);
  ctx.translate(0 - horizontalCenter, 0 - verticalCenter);
  ctx.rotate(0);
  ctx.fillStyle = 'rgb(235, 131, 52)';
  ctx.fillRect(x, y, 25, 25);
  // gun
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(x + 25, y - 5, 5, 20);
  ctx.restore();
}