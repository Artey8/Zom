class Utils {
  static getAbsPosition(relPosition, angle, rotationPoint) {
    const radian = (Math.PI / 180) * angle;
    let { x, y } = relPosition;
    x = x - rotationPoint.x;
    y = y - rotationPoint.y;
    let newX = x * Math.cos(radian) - y * Math.sin(radian);
    let newY = y * Math.cos(radian) - x * Math.sin(radian);
    newX = newX + rotationPoint.x;
    newY = newY + rotationPoint.y;
    return { x: newX, y: newY };
  }
  static checkForConflicts(bullets, destructables) {
    const collisions = [];
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      for (let k = 0; k < destructables.length; k++) {
        let destructable = destructables[k];
        let bx = bullet.absPosition.x;
        let by = bullet.absPosition.y;
        let dx = destructable.position.x;
        let dy = destructable.position.y;
        if ((bx >= dx && bx <= dx + 30) && (by >= dy && by <= dy + 30)) {
          collisions.push(destructables[k]);
        }
      }
    }
    if (collisions.length > 0) {
      return collisions;
    }
  }
}