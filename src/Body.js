class Body {
  constructor(el) {
    this.node = document.createElement('div');
    this.node.setAttribute('class', 'bodySegment');
    el.appendChild(this.node);
  }
}
