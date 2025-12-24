export class InputManager {
  constructor() {
    this.keys = {};
    this.keysPressed = {};
    this.keysReleased = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.mousePressed = false;
    this.mouseReleased = false;

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      if (!this.keys[e.code]) {
        this.keysPressed[e.code] = true;
      }
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.keysReleased[e.code] = true;
    });

    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    window.addEventListener('mousedown', (e) => {
      if (!this.mouseDown) {
        this.mousePressed = true;
      }
      this.mouseDown = true;
    });

    window.addEventListener('mouseup', (e) => {
      this.mouseDown = false;
      this.mouseReleased = true;
    });
  }

  update() {
    this.keysPressed = {};
    this.keysReleased = {};
    this.mousePressed = false;
    this.mouseReleased = false;
  }

  isKeyDown(code) {
    return !!this.keys[code];
  }

  isKeyPressed(code) {
    return !!this.keysPressed[code];
  }

  isKeyReleased(code) {
    return !!this.keysReleased[code];
  }

  getAxis(negative, positive) {
    let axis = 0;
    if (this.isKeyDown(negative)) axis -= 1;
    if (this.isKeyDown(positive)) axis += 1;
    return axis;
  }
}
