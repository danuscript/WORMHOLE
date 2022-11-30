class Head {
  constructor(el) {
    this.node = document.createElement('div');
    this.node.setAttribute('id', 'head');
    el.appendChild(this.node);

    this.bodyNodes = [];
    this.positions = [{ top: '0px', left: '0px', dir: 'right' }];

    this.currentDirection = 'right';
    this.SPEED = 200;
    this.node.style.top = 0;
    this.node.style.left = 0;

    setTimeout(this.move.bind(this), this.SPEED);
  }

  move() {
    const head = this.node;
    const direction = this.currentDirection;
    const wormholeA = document.querySelector('#wormhole-a');
    const wormholeB = document.querySelector('#wormhole-b');
    const currentPositions = {
      top: +head.style.top.slice(0, -2),
      left: +head.style.left.slice(0, -2),
    };

    const [axis, offset] = movement[direction];
    head.style[axis] = `${currentPositions[axis] += offset}px`;

    this.updateEyes(direction);
    this.wraparound(currentPositions.top, currentPositions.left);
    this.updateState(this.node.style.top, this.node.style.left, wormholeA, wormholeB);
    updateCorners(direction, head, headCorners);
    if (!this.bodyNodes.length) head.style.borderRadius = '15px';
    this.teleport(this.node.style.top, this.node.style.left, wormholeA, wormholeB);

    this.updatePositions(this.node.style.top, this.node.style.left);

    if (!ghostState) {
      if (!this.asteroidCheck(this.node.style.top, this.node.style.left)) return this.gameOver('asteroid');
      if (!this.snakeCheck()) return this.gameOver('ate self');
    }

    this.updateBodyNodes();

    setTimeout(this.move.bind(this), this.SPEED);
  }

  updateState(top, left, wormholeA, wormholeB) {
    const apple = document.querySelector('#apple');
    if (top === apple.style.top && left === apple.style.left) {
      this.bodyNodes.push(new Body(board));
      score += 1;
      if (score && score % 3 === 0) addAsteroid();
      ghostMode(false);
      place(apple);
      magicApple();
      if (this.SPEED > 20) this.SPEED -= 8;
      if (!wormholeState.cooldown) {
        place(wormholeA, wormholeB);
      }
    }

    updateCorners(this.currentDirection, this.node, headCorners);
  }

  snakeCheck() {
    for (let i = 0; i < this.positions.length - 3; i += 1) {
      const {top, left} = this.positions[i];
      if (this.node.style.top === top && this.node.style.left === left) {
        return false;
      }
    }
    return true;
  }

  asteroidCheck(top, left) {
    const asteroids = document.querySelectorAll('#asteroid');
    for (const asteroid of asteroids) {
      if (asteroid.style.top === top
        && asteroid.style.left === left) {
        return false;
      }
    }
    return true;
  }

  wraparound(top, left) {
    if (top < 0) this.node.style.top = '650px';
    if (top > 650) this.node.style.top = '0px';
    if (left < 0) this.node.style.left = '650px';
    if (left > 650) this.node.style.left = '0px';
  }

  teleport(top, left, wormholeA, wormholeB) {
    if (top === wormholeA.style.top && left === wormholeA.style.left) {
      this.node.style.top = wormholeB.style.top;
      this.node.style.left = wormholeB.style.left;
    } else if (top === wormholeB.style.top && left === wormholeB.style.left) {
      this.node.style.top = wormholeA.style.top;
      this.node.style.left = wormholeA.style.left;
    }

    if (top !== this.node.style.top && left !== this.node.style.top) {
      wormholeState.cooling = true;
      wormholeState.cooldown = this.positions.length;
    }
    wormholeTimer();
  }

  updatePositions(top, left) {
    this.positions.push({ top, left, dir: this.currentDirection });
    occupied.add(`${top},${left}`);
    if (this.positions.length > this.bodyNodes.length + 1) {
      const { top: prevTop, left: prevLeft } = this.positions.shift();
      occupied.delete(`${prevTop},${prevLeft}`);
    }
  }

  updateBodyNodes() {
    this.bodyNodes.forEach((bodyNode, i) => {
      const { top, left } = this.positions[i];
      bodyNode.node.style.top = top;
      bodyNode.node.style.left = left;
      bodyNode.node.style.backgroundColor = colors[i % 5];
    });
    if (this.bodyNodes.length) {
      updateCorners(this.positions[1].dir, this.bodyNodes[0].node, tailCorners);
    }
  }

  updateEyes(direction) {
    this.node.style.background = (direction === 'left' || direction === 'right')
      ? 'url(src/assets/eyes-side.png) rgb(114, 200, 68)'
      : 'url(src/assets/eyes-up.png) rgb(114, 200, 68)';
  }

  gameOver(message) {
    alert(message);
    reset();
  }
}
