const newGame = () => {
  const body = document.querySelector('body');
  const board = document.querySelector('#board');

  const head = new Head(board);
  new Apple(board);
  const wormhole = new Wormhole(board);
  placeWormHoles();
  placeApple();
  placeAsteroid();

  body.addEventListener('keydown', (e) => {
    const dir = wasdControls[e.code] || e.code.slice(5).toLowerCase();
    if (['left', 'right', 'down', 'up'].includes(dir) && head.currentDirection !== counterDirections[dir]) {
      head.currentDirection = dir;
    }
  });
};

const generatePos = () => {
  const randomNum = Math.random() * 650;
  return Math.round(randomNum / 50) * 50;
};

const placeWormHoles = () => {
  const wormholeA = document.querySelector('#wormhole-a');
  const wormholeB = document.querySelector('#wormhole-b');
  [wormholeA, wormholeB].forEach((end) => {
    occupied.delete(`${end.style.top},${end.style.left}`);
    end.style.top = `${generatePos()}px`;
    end.style.left = `${generatePos()}px`;
    while (occupied.has(`${end.style.top},${end.style.left}`)) {
      end.style.top = `${generatePos()}px`;
      end.style.left = `${generatePos()}px`;
    }
    occupied.add(`${end.style.top},${end.style.left}`);
  })
}

const placeAsteroid = () => {
  const asteroid = new Asteroid(board);
  asteroid.node.style.top = `${generatePos()}px`;
  asteroid.node.style.left = `${generatePos()}px`;
  while (occupied.has(`${asteroid.node.style.top},${asteroid.node.style.left}`)) {
    asteroid.node.style.top = `${generatePos()}px`;
    asteroid.node.style.left = `${generatePos()}px`;
  }
  occupied.add(`${asteroid.node.style.top},${asteroid.node.style.left}`);
}

const wormholeTimer = () => {
  const {cooling, cooldown} = wormholeState;
  if (cooling && cooldown === 0) {
    placeWormHoles();
    wormholeState.cooling = false;
  } else if (cooling && cooldown > 0) {
    wormholeState.cooldown -= 1;
  }
}

const placeApple = () => {
  const apple = document.querySelector('#apple');
  occupied.delete(`${apple.style.top},${apple.style.left}`);
  apple.style.top = `${generatePos()}px`;
  apple.style.left = `${generatePos()}px`;
  while (occupied.has(`${apple.style.top},${apple.style.left}`)) {
    apple.style.top = `${generatePos()}px`;
    apple.style.left = `${generatePos()}px`;
  }
  if (apple.src.slice(-8) === 'star.gif') ghostMode(true);
  apple.removeAttribute('src');
  apple.setAttribute('src', 'src/assets/diamond.gif');
  const magicNumber = Math.floor(Math.random() * 11);
  if (magicNumber >= 8) { 
    apple.removeAttribute('src');
    apple.setAttribute('src', 'src/assets/star.gif');
  }
  occupied.add(`${apple.style.top},${apple.style.left}`);
}

const reset = () => {
  const board = document.querySelector('#board');
  occupied = new Set(['0px,0px']);
  board.innerHTML = '';
  wormholeState = { cooling: false, cooldown: 0 };
  snakeState = { ghost: false, }
  gameState = { score: 0, ticks: 0 };
  newGame();
};

const ghostMode = (active) => {
  const body = document.querySelectorAll('.bodySegment');
  body.forEach((segment) => {
    if (active) {
      segment.classList.add('ghost');
      snakeState.ghost = true;
    } else {
      segment.classList.remove('ghost');
      snakeState.ghost = false;
    }
  })
};

const updateHeadCorners = (direction, node, corners) => {
  const [cornerA, cornerB, cornerC, cornerD] = corners[direction];
  node.style[`border${cornerA}Radius`] = '20px';
  node.style[`border${cornerB}Radius`] = '20px';
  node.style[`border${cornerC}Radius`] = '0px';
  node.style[`border${cornerD}Radius`] = '0px';
}

const movement = {
  left: ['left', -50],
  right: ['left', 50],
  up: ['top', -50],
  down: ['top', 50],
};

const counterDirections = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up',
};

const wasdControls = {
  KeyA: 'left',
  KeyD: 'right',
  KeyS: 'down',
  KeyW: 'up',
};

const colors = ['#ECCA2F', '#F78331', '#E0376E', '#8231F7', '#45A7FF'];

const headCorners = {
  left: ['TopLeft', 'BottomLeft', 'TopRight', 'BottomRight'],
  right: ['TopRight', 'BottomRight', 'TopLeft', 'BottomLeft'],
  up: ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
  down: ['BottomLeft', 'BottomRight', 'TopLeft', 'TopRight'],
};

const tailCorners = {
  left: ['TopRight', 'BottomRight', 'TopLeft', 'BottomLeft'],
  right: ['TopLeft', 'BottomLeft', 'TopRight', 'BottomRight'],
  up: ['BottomLeft', 'BottomRight', 'TopLeft', 'TopRight'],
  down: ['TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'],
}

let occupied = new Set(['0px,0px']);
let wormholeState = { cooling: false, cooldown: 0 };
let snakeState = { ghost: false, }
let gameState = { score: 0, ticks: 0 };

document.addEventListener('DOMContentLoaded', newGame);

