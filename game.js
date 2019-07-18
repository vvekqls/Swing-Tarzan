Array.prototype.last = function () {
  return (this.length > 0) ? this[this.length - 1] : null;
}
class Game {
  constructor(_canv) {
    this.canvas = _canv;
    this.ctx = this.canvas.getContext('2d'); 
    this.scenes = []; 

    // 시간 관리용 멤버 변수들
    this.now = 0;
    this.last = 0;
    this.elapsed = 0;
    this.timeDelta = 0;
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
      this.scenes.last().update(this.timeDelta); // 활성화된 장면을 갱신
      this.scenes.last().render(this.ctx); // 활성화된 장면을 그려줌
    }
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

  }

  update(timeDelta) {
    super.update(timeDelta);
  }

  render(ctx) {
    super.render(ctx)
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
  }

  init() {
    // 여기서는 각종 변수를 초기화해야 한다.
    // 일단 현재 위치를 나타내는 변수를 만들어봤다.
    this.x = 0;
    this.y = 0;
    this.force = { x: 0, y: 0 };
    this.gravity = 10;
  }

  update(timeDelta) {
    // 캐릭터의 각종 상태를 변경하는 부분.
    
    this.force.y += this.gravity * timeDelta;
    this.x += this.force.x;
    this.y += this.force.y;
  }

  render(ctx) {
    // 여기서 그려주면 된다.
    // 일단은 현재 위치에 반지름 20픽셀 짜리 빨간 원을 그리는 코드를 넣어보자.
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, 2 * Math.PI); // 각도는 늘 라디안이라는 점을 잊지 말자!
    ctx.fill();
    ctx.restore();
  }
}

const game = new Game(document.getElementById('canv'));
game.push(new GameScene());
game.update();