class Wormhole {
  constructor(el) {
    ['a', 'b'].forEach((label) => {
      const node = `node${label.toUpperCase()}`;
      this[node] = document.createElement('div');
      this[node].setAttribute('class', 'wormhole');
      this[node].setAttribute('id', `wormhole-${label}`);
      el.appendChild(this[node]);
    });
  }
}
