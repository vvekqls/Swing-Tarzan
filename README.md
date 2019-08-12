## Overview
Swing Spiderman is a simple and easy game to pick up quickly. The extent of the gameplay is pressing spacebar to shoot the webs an move forward. The player press spacebar while avoiding obstacles coming at them from the right side of the screen.

### Architectures and Technologies

This project is implemented with the following technologies:

- Vanilla JavaScript for overall structure and game logic,
- `HTML5 Canvas` for DOM manipulation and rendering,
- `CSS` for visualization

### Key Features
Computed  the character’s trajectory by calculating the radian of the swing using trigonometric functions. 
```javascript
Math.distance = function (p1, p2) {
  return Math.abs(Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)));
}
Math.rad2deg = function (rad) {
  return rad * 180 / Math.PI;
}
Math.deg2rad = function (deg) {
  return deg / 180 * Math.PI;
}
Math.angle = function (p1, p2) {
  let w = p2.x - p1.x;
  let h = p2.y - p1.y;
  return Math.atan2(-h, w) - Math.PI / 2;
}
Math.getPoint = function (pt, deg, len) {
  return { x: pt.x + (len * Math.cos(deg)), y: pt.y + (len * Math.sin(deg)) };
}
```
### Character's acceleration 
Calculated  the character’s acceleration by using the force and the gravity from the object.
```javascript
  update(timeDelta, key) {
    
    if (this.pivot === null) {
      
      this.currentAnimation = "web"; 
      this.force.y += this.gravity * timeDelta;
      this.x += this.force.x;
      this.y += this.force.y;
    } else {
      let ang = this.angle;
      let ang_vel = (-1 * this.gravity / this.pLen) * Math.sin(ang); //각가속도
      
      this.accel += ang_vel * timeDelta; 
      this.accel *= 0.999;

      ang += this.accel;
      if (Math.abs(Math.rad2deg(ang)) >= 90) {
        this.setPivot(null);
      } else {
        this.angle = ang;
//....
```
### Collision
Implemented character collision with object by finding the X and Y position of the object and sets the conditions to satisfy the statements. 
```javascript
isHit(character) {
    let firstPoint = { x: this.points[0].x, y: 540 };
    let lastPoint = firstPoint;
    let hit = false;
    this.points.forEach((pt) => {
      if (Math.distanceToLine(character, [lastPoint, pt]) < character.radius) {
        hit = true;
        return false;
      }
      lastPoint = pt;
    });
    if (hit) return true;
    lastPoint = firstPoint;
    let count = 0, cur = 1;
    while (lastPoint.x < character.x) {
      if (Math.isCross(character, [lastPoint, this.points[cur]])) count++;
      lastPoint = this.points[cur];
      cur++;
    }
    if (count > 0) console.log(count);
    if (count % 2 == 0) return false;
    return true;
  }
```

### The Future
* Implement a Items and Coins to help game intense. Player can use coins to buy item.
* Write functionality to provide different prices for items.
