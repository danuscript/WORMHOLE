class Asteroid {
  constructor(el) {
    this.node = document.createElement('img');
    this.node.setAttribute('id', 'asteroid');
    this.node.setAttribute('src', 'src/assets/asteroid.png');
    el.appendChild(this.node);
  }
}
