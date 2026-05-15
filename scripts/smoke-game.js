const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script>([\s\S]*)<\/script>/);

if (!match) {
  throw new Error('No inline game script found in index.html');
}

const script = match[1];
const elements = new Map();

function makeCanvasContext() {
  return new Proxy({}, {
    get(target, prop) {
      return target[prop] || (() => {});
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    }
  });
}

function makeElement(id) {
  const element = {
    id,
    style: {},
    className: '',
    dataset: {},
    children: [],
    innerHTML: '',
    textContent: '',
    lastChild: null,
    classList: {
      add() {},
      remove() {}
    },
    appendChild(child) {
      this.children.push(child);
      this.lastChild = this.children[this.children.length - 1] || null;
    },
    prepend(child) {
      this.children.unshift(child);
      this.lastChild = this.children[this.children.length - 1] || null;
    },
    remove() {},
    addEventListener() {},
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 960, height: 600 };
    },
    getContext() {
      return makeCanvasContext();
    }
  };

  if (id === 'game') {
    element.width = 960;
    element.height = 600;
  }

  return element;
}

const document = {
  getElementById(id) {
    if (!elements.has(id)) {
      elements.set(id, makeElement(id));
    }
    return elements.get(id);
  },
  createElement(tag) {
    return makeElement(tag);
  },
  querySelectorAll(selector) {
    if (selector !== '[data-key]') return [];
    return ['w', 'a', 's', 'd'].map(key => ({ ...makeElement(key), dataset: { key } }));
  },
  querySelector(selector) {
    return makeElement(selector);
  }
};

let rafCallback = null;
const context = {
  document,
  window: { addEventListener() {} },
  performance: { now: () => Date.now() },
  requestAnimationFrame(callback) {
    rafCallback = callback;
    return 1;
  },
  cancelAnimationFrame() {},
  Math,
  console
};

vm.createContext(context);
vm.runInContext(script, context, { filename: 'index.html' });

if (typeof context.start !== 'function') {
  throw new Error('Game start() function was not registered');
}

context.start();

if (typeof context.update !== 'function' || typeof context.draw !== 'function') {
  throw new Error('Game update/draw functions were not registered');
}

for (let frame = 0; frame < 60; frame += 1) {
  context.update(16);
  context.draw();
}

if (typeof rafCallback !== 'function') {
  throw new Error('Game loop did not request an animation frame');
}

console.log('Smoke test passed: game initialized and rendered 60 frames.');
