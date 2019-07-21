const SpriteDefs = {
  "character": [
    { x: 0, y: 0, w: 40, h: 40, origin: { x: 20, y: 20 } },
    { x: 40, y: 0, w: 40, h: 40, origin: { x: 20, y: 20 } },
    { x: 0, y: 40, w: 40, h: 39, origin: { x: 30, y: 20 } },
    { x: 40, y: 40, w: 40, h: 39, origin: { x: 30, y: 20 } },
    { x: 80, y: 40, w: 40, h: 39, origin: { x: 30, y: 20 } },
    { x: 0, y: 80, w: 40, h: 41, origin: { x: 30, y: 20 } },
    { x: 40, y: 80, w: 40, h: 41, origin: { x: 30, y: 20 } },
    { x: 80, y: 80, w: 40, h: 41, origin: { x: 30, y: 20 } },
    { x: 0, y: 122, w: 40, h: 41, origin: { x: 30, y: 20 } },
    { x: 40, y: 122, w: 40, h: 40, origin: { x: 30, y: 20 } },
    { x: 80, y: 122, w: 40, h: 40, origin: { x: 30, y: 20 } },
    { x: 0, y: 186, w: 40, h: 59, origin: { x: 20, y: 39 } },
    { x: 40, y: 186, w: 40, h: 59, origin: { x: 20, y: 39 } },
    { x: 80, y: 186, w: 40, h: 59, origin: { x: 20, y: 39 } },
    { x: 340, y: 0, w: 18, h: 12, origin: { x: 9, y: 6 } },
    { x: 200, y: 260, w: 50, h: 50, origin: { x: 25, y: 25 } },
    { x: 250, y: 260, w: 50, h: 50, origin: { x: 25, y: 25 } },
    { x: 300, y: 260, w: 50, h: 50, origin: { x: 25, y: 25 } },
    { x: 350, y: 260, w: 50, h: 50, origin: { x: 25, y: 25 } }
  ]
};
const AnimationDefs = {
  "character": {
    "spin": [{ frame: 0, duration: 0.05 }, { frame: 1, duration: 0.05 }],
    "forward": [{ frame: 2, duration: 0.08 }, { frame: 3, duration: 0.08 }, { frame: 4, duration: 0.08 }, { frame: 3, duration: 0.08 }],
    "nutral": [{ frame: 5, duration: 0.05 }, { frame: 6, duration: 0.05 }, { frame: 7, duration: 0.05 }, { frame: 6, duration: 0.05 }],
    "backward": [{ frame: 8, duration: 0.05 }, { frame: 9, duration: 0.05 }, { frame: 10, duration: 0.05 }, { frame: 9, duration: 0.05 }],
    "fall": [{ frame: 11, duration: 0.05 }, { frame: 12, duration: 0.05 }, { frame: 13, duration: 0.05 }, { frame: 12, duration: 0.05 }],
    "sword": [{ frame: 14, duration: 1 }],
    "magnet_field": [{ frame: 15, duration: 0.05 }, { frame: 16, duration: 0.05 }, { frame: 17, duration: 0.05 }, { frame: 18, duration: 0.05 }]
  }
};

Array.prototype.last = function () {
  return (this.length > 0) ? this[this.length - 1] : null;
}
Math.distance = function (p1, p2) {
  // 두 점 간의 거리를 구하는 함수
  // 왜 아래처럼 되는지 궁금하면 피타고라스의 정리를 보도록 하자!
  return Math.abs(Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)));
}
Math.rad2deg = function (rad) {
  // 라디안 각도를 360분법 각도로 변환
  return rad * 180 / Math.PI;
}
Math.deg2rad = function (deg) {
  // 360분법 각도를 라디안으로 변환
  return deg / 180 * Math.PI;
}
Math.angle = function (p1, p2) {
  // 두 지점의 각도를 구하자
  let w = p2.x - p1.x;
  let h = p2.y - p1.y;
  return Math.atan2(-h, w) - Math.PI / 2;
}
Math.getPoint = function (pt, deg, len) {
  // 한 점에서 특정 각도로 특정 거리 떨어진 점의 좌표를 구한다
  return { x: pt.x + (len * Math.cos(deg)), y: pt.y + (len * Math.sin(deg)) };
}

class Sprite {
  constructor(image, sx, sy, sw, sh, ox, oy) {
    this.img = image; // 원본 이미지
    this.sx = sx; // 이미지 내에서 스프라이트의 x 좌표
    this.sy = sy; // 이미지 내에서 스프라이트의 y 좌표
    this.sw = sw; // 스프라이트의 가로 크기
    this.sh = sh; // 스프라이트의 세로 크기
    this.ox = ox || 0; // 스프라이트의 중심점 x
    this.oy = oy || 0; // 스프라이트의 중심점 y
  }
  draw(ctx, x, y, opt) {
    // ctx : 캔버스 컨텍스트
    // x, y : 찍고자 하는 화면 좌표
    // opt : 기타 옵션들 (크기 조절, 회전 등)
    ctx.save();
    // 크기 조절에 별다른 값이 지정되어있지 않으면 크기를 조절하지 않는다.
    let scale = (opt && opt.scale) || 1;
    ctx.translate(x, y); //화면 기준점을 표시 좌표로 이동해서
    if (opt && opt.rotate) { ctx.rotate(-opt.rotate); } // 회전 각도가 있다면 회전해주고
    // 원본 이미지에서 스프라이트만큼 잘라내서
    // 크기 조절에 맞춰서 찍어준다.
    ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh,
      -this.ox * scale, -this.oy * scale, this.sw * scale, this.sh * scale);

    ctx.restore();
  }
}

class SpriteSheet {
  constructor(image, def) {
    // image는 스프라이트들이 들어있는 이미지
    // def 는 스프라이트의 정의가 모여있는 배열
    this.img = image;
    this.sprites = [];

    def.forEach((d) => {
      // 정의에 맞춰서 스프라이트를 생성하고
      let spr = new Sprite(this.img, d.x, d.y, d.w, d.h, d.origin.x, d.origin.y);
      this.sprites.push(spr); // 생성된 놈을 배열에 넣어둔다.
    });
  }

  get(idx) {
    return this.sprites[idx]; // 그냥 배열에서 해당 번호의 스프라이트를 반환하면 끝.
  }
}

class Animation {
  constructor(_sheet, defs, opt) {
    this.elapsed = 0; //경과 시간
    this.curFrame = 0;
    this.sprites = _sheet;
    this.frames = defs;
    this.done = false;
    this.duration = defs.reduce((p, v) => { return p + v.duration; }, 0); // 각 프레임의 시간의 합
    this.loop = (opt && opt.hasOwnProperty('loop')) ? opt.loop : true;
  }

  clone() {
    // 같은 애니메이션이 동시에 여러개 화면에 표시되어야 하는 경우에는
    // 애니메이션 객체를 복제해서 써야 한다.
    // 이를 위한 유틸 메소드
    return new Animation(this.sprites, this.frames);
  }

  reset() {
    // 애니메이션을 처음으로 되돌리는 메소드.
    // 언젠가는 쓸모가 있을것!
    this.elapsed = 0;
    this.curFrame = 0;
  }

  get current() {
    // 현재 화면에 표시되는 프레임의 스프라이트를 반환하는 함수.
    return this.sprites.get(this.curFrame);
  }

  update(timeDelta) {
    // 경과 시간에 따라 애니메이션을 업데이트한다.
    if (this.done) return;
    this.elapsed += timeDelta;
    if (!this.loop && this.elapsed > this.duration) {
      // 반복되지 않는 애니메이션인데 끝까지 재생된 경우
      // 재생을 멈추고 마지막 프레임으로 고정
      this.done = true;
      this.curFrame = this.frames.length - 1;
    } else {
      let idx = 0, sum = 0;
      while (true) {
        sum += this.frames[idx].duration; // 각 프레임의 경과시간을 더해서
        if (sum >= this.elapsed) break; // 현재 경과 시간보다 크거나 같으면 이 프레임으로 결정
        idx += 1;							 // 아니면 다음 프레임으로..
        idx %= this.frames.length;		 // 다음 프레임이 없으면 처음으로 돌아가자
      }
      this.curFrame = idx;
    }
  }

  draw(ctx, x, y, opt) {
    // 스프라이트를 그리는 거랑 동일한 형태인 이유는 바로
    this.sprites.get(this.frames[this.curFrame].frame).draw(ctx, x, y, opt);
    // 스프라이트를 그리는거니까 그렇다! 헤헿
  }
}

class Game {
  // 생성자
  constructor(_canv) {
    this.canvas = _canv;
    this.ctx = this.canvas.getContext('2d'); // 2d 컨텍스트를 저장한다
    this.scenes = []; // 장면들을 관리하는 스택

    // 시간 관리용 멤버 변수들
    this.now = 0;
    this.last = 0;
    this.elapsed = 0;
    this.timeDelta = 0;

    //키보드 입력용 변수
    this.key = null;
    // this가 뭘 가리키는건지 애매해지지 않도록 바인드해서 넘겨주는 센스
    document.addEventListener("keydown", this.keyHandler.bind(this), false);
  }

  keyHandler(e) {
    if (!e.repeat) this.key = e.keyCode;
    if (e.keyCode === 32) {
      e.preventDefault();
      return false;
    }
  }

  // 게임 루프용 메소드
  // 이 메소드가 매 프레임(1/60초)마다 실행된다.
  update() {
    this.last = this.now;
    this.now = performance.now(); // 현재 시간
    this.timeDelta = (this.now - this.last) / 1000; // 지난 프레임과의 경과시간을 초 단위로 환산
    this.elapsed += this.timeDelta; // 게임이 시작된 후 경과된 전체 시간

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // 화면을 매 프레임 지워준다.
    if (this.scenes.length > 0) {
      // 처리해야 할 장면이 있을 경우에만
      this.scenes.last().update(this.timeDelta, this.key); // 활성화된 장면을 갱신
      this.scenes.last().render(this.ctx); // 활성화된 장면을 그려줌
    }
    this.key = null;
    requestAnimationFrame(this.update.bind(this)); // 1/60초 후에 다시 실행
  }

  // 장면을 새로 전환할 때는 스택에 새로운 장면을 넣어주면 된다
  push(_scene) {
    if (this.scenes.length > 0) {
      // 혹시 실행되고 있는 장면이 있을 경우 해당 장면에 정지 신호를 보내주고
      this.scenes.last().pause();
    }
    _scene.init(); // 새로 추가될 장면의 초기화 코드를 호출해준 뒤
    this.scenes.push(_scene); // 스택에 새 장면을 넣어준다.
  }

  // 장면의 실행이 끝나고 이전 장면으로 돌아갈 때는 스택에서 마지막 장면을 뽑아주면 된다.
  pop() {
    if (this.scenes.length === 0) return null; // 뽑을 장면이 없으면 암 것도 안하면 된다.
    var sc = this.scenes.pop();
    sc.destroy(); // 각 장면이 끝날때 처리해줄 내용이 있을 수 있으니 호출해주자.
    if (this.scenes.length > 0) {
      // 아직 장면 스택에 장면이 남아있다면 마지막 장면이 다시 활성화되어야 한다.
      // 활성화 신호를 보내주자.
      this.scenes.last().resume();
    }
    // 그리고 어디다 쓰고 싶을 수도 있으니까 뽑아낸 장면을 반환한다.
    return sc;
  }
}

class Scene {
  constructor() {
    this.children = []; // 자식 객체들을 보관할 컨테이너
    this.elapsed = 0; // 이 게임 장면에서 경과한 시간
  }

  init() {
    // 일반적으로는 할 일이 없으니 냅두자
  }

  update(timeDelta) {
    // 매 프레임 상태 업데이트를 처리하는 메소드
    this.elapsed += timeDelta;
    this.children.forEach((child) => { child.update(timeDelta); }); // 자녀 객체들의 업데이트를 호출
  }

  render(ctx) {
    // 화면에 장면을 그리는 메소드. ctx 는 캔버스의 2d 컨텍스트 객체가 된다.
    // 공통으로 하는 일은 그냥 단순히 전체 자식객체를 그려주는 정도면 된다.
    this.children.forEach((child) => { child.render(ctx); });
  }

  pause() {
    // 여기도 비워둠
  }

  resume() {
    // 마찬가지로 비워둠
  }
}

class GameScene extends Scene {
  constructor() {
    super();
    this.character = new Character();
    this.character.init();
    this.children.push(this.character);
  }

  init() {
    this.cameraX = 200;
  }

  update(timeDelta, key) {
    super.update(timeDelta);
    this.cameraX = Math.max(this.cameraX, this.character.x);
    if (key === 32) {
      var tx = Math.cos(Math.PI / 4) * this.character.y + this.character.x;
      this.character.setPivot({ x: tx, y: 0 });
    }

  }

  render(ctx) {
    ctx.save();
    ctx.translate(-this.cameraX + 200, 0);
    super.render(ctx);
    ctx.restore();

  }
}
class GameObject {
  constructr() { }
  init() { }
  update(timeDelta) { }
  render(ctx) { }
}
class Character extends GameObject {
  constructor() {
    // 생성자에서는 캐릭터에 사용될 이미지를 만들고 애니메이션들을 생성해야 한다.
    // 이 내용은 아래의 '캐릭터 애니메이션' 부분에서 다룰테니 기둘!
    super();
    this.img = new Image();
    this.img.src = "http://web.lazygyu.net/test/whip/images/eclipse_sprites.png"; //각자 자신의 이미지 주소를 넣자
    this.spriteSheet = new SpriteSheet(this.img, SpriteDefs.character); //캐릭트 스프라이트 시트
    this.animations = {}; //애니메이션들을 모아둘 컨테이너
    //애니메이션 정의에 맞춰서 컨테이너에 애니메이션을 생성해서 넣는다.
    for (let i in AnimationDefs.character) {
      if (!AnimationDefs.character.hasOwnProperty(i)) continue;
      this.animations[i] = new Animation(this.spriteSheet, AnimationDefs.character[i]);
    }
  }

  init() {
    // 여기서는 각종 변수를 초기화해야 한다.
    // 일단 현재 위치를 나타내는 변수를 만들어봤다.
    this.x = 50;
    this.y = 50;
    this.gravity = 9; //일단 대충 10으로 해보자.
    this.pivot = null; //이건 줄이 걸린 좌표를 나타내는 변수다. null 이면 안 걸린거
    this.position = null; //이건 줄에 대한 캐릭터의 상대 좌표
    this.force = { x: 0, y: 0 };
    this.pLen = 0; //이건 줄의 길이
    this.angle = 0; //현재 진자운동의 각도
    this.accel = 0;  // 현재 각가속도

  }

  setPivot(point) {
    if (this.pivot === null) {
      // 현재 줄이 걸리지 않은 상태일때만 줄을 건다
      this.pivot = point;
      this.pLen = Math.distance(this, this.pivot);
      this.position = { x: this.x - this.pivot.x, y: this.y - this.pivot.y };
      this.angle = Math.angle({ x: this.x, y: this.y }, this.pivot);
      this.accel = (-1.3 * (this.force.x + this.force.y) / this.pLen) * Math.sin(this.angle);
      this.update(0);
    } else {
      this.pivot = null;
      this.pLen = 0;
      this.position = null;
      this.angle = 0;
      this.accel = 0;
      this.update(0);
    }
  }

  update(timeDelta) {
    // 캐릭터의 각종 상태를 변경하는 부분.
    if (this.pivot === null) {
      // 줄이 걸려있지 않을때
      this.currentAnimation = "spin"; //현재 애니메이션은 spin 으로
      this.force.y += this.gravity * timeDelta;
      this.x += this.force.x;
      this.y += this.force.y;
    } else {
      // 줄이 걸려있을 때
      // 중력은 작용하고 있지만 각가속도 계산에 들어가므로 force.y 에 별도로 더해줄 필요가 없다.
      let ang = this.angle;
      let ang_vel = (-1 * this.gravity / this.pLen) * Math.sin(ang); //각가속도
      // 현재 각가속도에 경과시간을 곱해서 전체 각가속도에 합산
      this.accel += ang_vel * timeDelta;
      // 계속 같은 높이로 흔들릴 수는 없으니 시간이 흐를수록 가속도를 줄여준다.
      // 현실로 치자면 줄의 마찰력이나 공기저항에 대한 시뮬레이션이라고 볼 수 있겟지?
      this.accel *= 0.999;

      // 그럼 이제 다음번 각속도 계산을 위해 현재 각도를 바꿔주고
      ang += this.accel;
      if (Math.abs(Math.rad2deg(ang)) >= 90) {
        this.setPivot(null);
      } else {
        this.angle = ang;


        // 각 성분으로 분해해서 force에 할당하자
        this.force.x = this.pLen * this.accel * Math.cos(ang);
        this.force.y = -this.pLen * this.accel * Math.sin(ang);

        this.position.x += this.force.x;
        this.position.y += this.force.y;
        this.x = this.position.x + this.pivot.x;
        this.y = this.position.y + this.pivot.y;
      }
      if (this.force.x < -3) {
        this.currentAnimation = "backward";
      } else if (this.force.x > 3) {
        this.currentAnimation = "forward";
      } else {
        this.currentAnimation = "nutral";
      }
    }
    this.animations[this.currentAnimation].update(timeDelta);
  }

  render(ctx) {
    // 여기서 그려주면 된다.
    // 일단은 현재 위치에 반지름 20픽셀 짜리 빨간 원을 그리는 코드를 넣어보자.
    ctx.save();
    if (this.pivot !== null) {
      ctx.strokeStyle = "blue";
      ctx.beginPath();
      ctx.moveTo(this.pivot.x, this.pivot.y);
      ctx.lineTo(this.pivot.x + this.position.x, this.pivot.y + this.position.y);
      ctx.stroke();
    }
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI); // 각도는 늘 라디안이라는 점을 잊지 말자!
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 2, this.force.y * 20);
    ctx.fillRect(0, 0, this.force.x * 20, 2);
    ctx.restore();
    this.animations[this.currentAnimation].draw(ctx, this.x, this.y, {});
  }
}

var game = new Game(document.getElementById('canv'));
game.push(new GameScene());
game.update();