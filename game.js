class Game {
  constructor(canv){
    this.canvas = canv;
    this.ctx = this.canvas.getContext('2d');
    this.scenes = [];

    this.now = 0;
    this.last = 0;
    this.elapsed = 0;
    this,timeDelta = 0;
  }
  update() {
    this.last = this.now;
    this.now = performance.now();
    this.timeDelta = (this.now-this.last)/1000;
    this.elapsed += this.timeDelta;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.scenes.length > 0){
      this.scenes.last().update(this.timeDelta);
      this.scenes.last().render(this.ctx);
    }
  }
}