class Wormhole {
  constructor(el) {
    this.nodeA = document.createElement('div');
    this.nodeA.setAttribute('class', 'wormhole');
    this.nodeA.setAttribute('id', 'wormhole-a');
    el.appendChild(this.nodeA);

    this.nodeB = document.createElement('div');
    this.nodeB.setAttribute('class', 'wormhole');
    this.nodeB.setAttribute('id', 'wormhole-b');
    el.appendChild(this.nodeB);
  }
}
