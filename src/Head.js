class Head {
  constructor(el) {
    this.node = document.createElement('div');
    this.node.setAttribute('id', 'head');
    el.appendChild(this.node);

    this.bodyNodes = [];
    this.positions = [['0px', '0px', 'right']];
    this.currentDirection = 'right';
    this.SPEED = 200;
    this.node.style.top = 0;
    this.node.style.left = 0;

    setTimeout(this.move.bind(this), this.SPEED);
  }

  move() {
    const head = this.node;
    const direction = this.currentDirection;

    head.style.background = (direction === 'left' || direction === 'right')
      ? 'url(src/assets/eyes-side.png) rgb(114, 200, 68)'
      : 'url(src/assets/eyes-up.png) rgb(114, 200, 68)';

    const currentPositions = {
      top: +head.style.top.slice(0, -2),
      left: +head.style.left.slice(0, -2),
    };

    const [axis, offset] = movement[direction];
    head.style[axis] = `${currentPositions[axis] += offset}px`;

    this.wraparound(currentPositions.top, currentPositions.left);
    this.updateSnake(this.node.style.top, this.node.style.left);
    updateCorners(direction, head, headCorners);
    if (!this.bodyNodes.length) head.style.borderRadius = '15px';
    this.teleport(this.node.style.top, this.node.style.left);

    this.updatePositions();

    if (!this.asteroidCheck() && !snakeState.ghost) return this.gameOver('asteroid');

    if (!this.snakeCheck() && !snakeState.ghost) return this.gameOver('ate self');

    this.updateBodyNodes();

    setTimeout(this.move.bind(this), this.SPEED);
  }

  updateSnake(top, left) {
    if (top === apple.style.top && left === apple.style.left) {
      this.bodyNodes.push(new Body(board));
      gameState.score += 1;
      if (gameState.score && gameState.score % 3 === 0) {
        placeAsteroid()
      }
      ghostMode(false);
      placeApple();
      if (this.SPEED > 20) this.SPEED -= 8;
      if (!wormholeState.cooldown) placeWormHoles();
    }
  }

  snakeCheck() {
    for (let i = 0; i < this.positions.length - 3; i += 1) {
      const [top, left] = this.positions[i];
      if (this.node.style.top === top && this.node.style.left === left) {
        return false;
      }
    }
    return true;
  }

  asteroidCheck() {
    const asteroids = document.querySelectorAll('#asteroid');
    let valid = true;
    asteroids.forEach((asteroid) => {
      if (asteroid.style.top === this.node.style.top && asteroid.style.left === this.node.style.left) {
        valid = false;
      }
    })
    return valid;
  }

  wraparound(top, left) {
    if (top < 0) this.node.style.top = '650px';
    if (top > 650) this.node.style.top = '0px';
    if (left < 0) this.node.style.left = '650px';
    if (left > 650) this.node.style.left = '0px';
  }

  teleport(top, left) {
    const wormholeA = document.querySelector('#wormhole-a');
    const wormholeB = document.querySelector('#wormhole-b');
    if (top === wormholeA.style.top && left === wormholeA.style.left) {
      this.node.style.top = wormholeB.style.top;
      this.node.style.left = wormholeB.style.left;
      wormholeState.cooling = true;
      wormholeState.cooldown = this.positions.length;
    } else if (top === wormholeB.style.top && left === wormholeB.style.left) {
      this.node.style.top = wormholeA.style.top;
      this.node.style.left = wormholeA.style.left;
      wormholeState.cooling = true;
      wormholeState.cooldown = this.positions.length;
    }
    wormholeTimer();
  }

  updatePositions() {
    this.positions.push([this.node.style.top, this.node.style.left, this.currentDirection]);
    occupied.add(this.positions.at(-1).toString());
    if (this.positions.length > this.bodyNodes.length + 1) {
      const removed = this.positions.shift().toString();
      occupied.delete(removed);
    }
  }

  updateBodyNodes() {
    this.bodyNodes.forEach((bodyNode, i) => {
      bodyNode.node.style.top = this.positions[i][0];
      bodyNode.node.style.left = this.positions[i][1];
      bodyNode.node.style.backgroundColor = colors[i % 5];
      if (!i) {
        updateCorners(this.positions[i + 1][2], bodyNode.node, tailCorners)
      }
    })
  }

  gameOver(message) {
    alert(message);
    reset();
  }
}
