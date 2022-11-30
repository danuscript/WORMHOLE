const newGame = () => {
  const body = document.querySelector('body');
  const board = document.querySelector('#board');

  const head = new Head(board);
  const apple = new Apple(board);
  const wormhole = new Wormhole(board);
  place(wormhole.nodeA, wormhole.nodeB, apple.node);
  magicApple();
  addAsteroid();

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

const wormholeTimer = () => {
  const { cooling, cooldown } = wormholeState;
  if (cooling && cooldown === 0) {
    const wormholeA = document.querySelector('#wormhole-a');
    const wormholeB = document.querySelector('#wormhole-b');
    place(wormholeA, wormholeB);
    wormholeState.cooling = false;
  } else if (cooling && cooldown > 0) {
    wormholeState.cooldown -= 1;
  }
};

const place = (...nodes) => {
  nodes.forEach((node) => {
    occupied.delete(`${node.style.top},${node.style.left}`);
    do {
      node.style.top = `${generatePos()}px`;
      node.style.left = `${generatePos()}px`;
    } while (occupied.has(`${node.style.top},${node.style.left}`));
    occupied.add(`${node.style.top},${node.style.left}`);
  });
};

const addAsteroid = () => {
  const asteroid = new Asteroid(board);
  place(asteroid.node);
};

const magicApple = () => {
  const apple = document.querySelector('#apple');
  if (apple.src.slice(-8) === 'star.gif') ghostMode(true);
  apple.removeAttribute('src');
  apple.setAttribute('src', 'src/assets/diamond.gif');
  const magicNumber = Math.floor(Math.random() * 11);
  if (magicNumber >= 8) {
    apple.removeAttribute('src');
    apple.setAttribute('src', 'src/assets/star.gif');
  }
};

const reset = () => {
  const board = document.querySelector('#board');
  occupied.clear();
  occupied.add('0px,0px');
  board.innerHTML = '';
  wormholeState.cooling = false;
  wormholeState.cooldown = 0;
  ghostState = false;
  score = 0;
  newGame();
};

const ghostMode = (active) => {
  const body = document.querySelectorAll('.bodySegment');
  body.forEach((segment) => {
    active
      ? segment.classList.add('ghost')
      : segment.classList.remove('ghost');
  });
  ghostState = active;
};

const updateCorners = (direction, node, corners) => {
  const { round, square } = corners[direction];
  node.style[`border${round[0]}Radius`] = '20px';
  node.style[`border${round[1]}Radius`] = '20px';
  node.style[`border${square[0]}Radius`] = '0px';
  node.style[`border${square[1]}Radius`] = '0px';
};

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
  left: { round: ['TopLeft', 'BottomLeft'], square: ['TopRight', 'BottomRight'] },
  right: { round: ['TopRight', 'BottomRight'], square: ['TopLeft', 'BottomLeft'] },
  up: { round: ['TopLeft', 'TopRight'], square: ['BottomLeft', 'BottomRight'] },
  down: { round: ['BottomLeft', 'BottomRight'], square: ['TopLeft', 'TopRight'] },
};

const tailCorners = {
  left: headCorners.right,
  right: headCorners.left,
  up: headCorners.down,
  down: headCorners.up,
};

const occupied = new Set(['0px,0px']);
const wormholeState = { cooling: false, cooldown: 0 };
let ghostState = false;
let score = 0;

document.addEventListener('DOMContentLoaded', newGame);
