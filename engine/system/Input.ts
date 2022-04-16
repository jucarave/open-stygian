import { Vector2 } from '../math/Vector2';

interface KeysMap {
  [index: string]: number;
}

interface MouseButtons {
  left: number;
  middle: number;
  right: number;
}

export class Input {
  private _canvas: HTMLCanvasElement;
  private _focused: boolean;
  private _keys: KeysMap;
  private _needsUpdate: boolean;
  private _isPointerLocked: boolean;
  private _mouseMovement: Vector2;
  private _mouseButtons: MouseButtons;

  public static instance: Input;

  public lockCursor = true;

  constructor(canvas: HTMLCanvasElement) {
    Input.instance = this;

    this._canvas = canvas;
    this._focused = false;
    this._keys = {};
    this._mouseButtons = {
      left: 0,
      middle: 0,
      right: 0
    };
    this._needsUpdate = false;

    this._mouseMovement = { x: 0, y: 0 };

    document.addEventListener('pointerlockchange', this._handlePointerLockChange.bind(this));
    document.addEventListener('mozfullscreenchange', this._handlePointerLockChange.bind(this));
    document.addEventListener('webkitfullscreenchange', this._handlePointerLockChange.bind(this));

    document.addEventListener('click', (ev: MouseEvent) => {
      this._focused = ev.target === this._canvas;

      if (!this.lockCursor) { return; }
      if (this._focused && this._canvas.requestPointerLock) {
        this._canvas.requestPointerLock();
      }
    })

    document.body.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (!this._focused) { return; }

      if (this._keys[ev.code] === 0 || this._keys[ev.code] === undefined) {
        this._keys[ev.code] = 1;
        this._needsUpdate = true;
      }
    });

    document.body.addEventListener('keyup', (ev: KeyboardEvent) => {
      this._keys[ev.code] = 0;
    });

    document.body.addEventListener('mousemove', (ev: MouseEvent) =>  {
      if (!this._focused || !this._isPointerLocked) { return; }

      this._mouseMovement.x = ev.movementX;
      this._mouseMovement.y = ev.movementY;
    });

    this._canvas.addEventListener('mousedown', (ev: MouseEvent) => {
      if (!this._focused) { return; }

      if (ev.button === 0 && this._mouseButtons.left === 0) {
        this._mouseButtons.left = 1;
        this._needsUpdate = true;
      } else if (ev.button === 1 && this._mouseButtons.middle === 0) {
        this._mouseButtons.middle = 1;
        this._needsUpdate = true;
      } else if (ev.button === 2 && this._mouseButtons.right === 0) {
        this._mouseButtons.right = 1;
        this._needsUpdate = true;
      }
    });

    this._canvas.addEventListener('mouseup', (ev: MouseEvent) => {
      if (ev.button === 0) {
        this._mouseButtons.left = 0;
      } else if (ev.button === 1) {
        this._mouseButtons.middle = 0;
      } else if (ev.button === 2) {
        this._mouseButtons.right = 0;
      }
    });
  }

  private _handlePointerLockChange(): void {
    if (
      document.pointerLockElement === this._canvas ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>document).mozfullscreenchange === this._canvas ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (<any>document).webkitPointerLockElement === this._canvas
    ) {
      this._isPointerLocked = true;
    } else {
      this._isPointerLocked = false;
      this._focused = false;
    }
  }

  /**
   * Updates all the key pressed into key presses if it needs update
   */
  private _updateKeysStatus() {
    if (!this._needsUpdate) { return; }

    for (const key in this._keys) {
      if (this._keys[key] === 1) {
        this._keys[key] = 2;
      }
    }

    return false;
  }

  /**
   *  Updates all the mouse button pressed into mouse button press if it needs update
   */
  private _updateMouseStatus() {
    if (!this._needsUpdate) { return; }

    if (this._mouseButtons.left === 1) { this._mouseButtons.left = 2; } else
    if (this._mouseButtons.middle === 1) { this._mouseButtons.middle = 2; } else
    if (this._mouseButtons.right === 1) { this._mouseButtons.right = 2; }
  }

  public update() {
    this._updateKeysStatus();
    this._updateMouseStatus();
    this._needsUpdate = false;

    // Cancel last frame mouse movement
    this._mouseMovement.x = 0;
    this._mouseMovement.y = 0;
  }

  /**
   * Checks if the player is pressing a keyboard key
   * 
   * @param key 
   * @returns Returns 1 when a key is being pressed or 0 otherwise
   */
  public static isKeyDown(key: string) {
    return Input.instance._keys[key] >= 1 ? 1 : 0;
  }

  /**
   * Checks if the player has just pressed a keyboard key
   * 
   * @param key 
   * @returns Returns 1 during the first frame of a key pressed or 0 otherwise
   */
  public static isKeyPressed(key: string) {
    return Input.instance._keys[key] === 1 ? 1 : 0;
  }

  /**
   * Checks if the player is not pressing a keyboard key
   * 
   * @param key 
   * @returns Returns 1 if the player is not pressing a key or 0 otherwise
   */
  public static isKeyUp(key: string) {
    return (Input.instance._keys[key] === 0 || Input.instance._keys[key] === undefined) ? 1 : 0;
  }

  /**
   * Checks if the player is pressing a mouse button
   * 
   * @param mouseButton 
   * @returns Returns 1 when a button is being pressed or 0 otherwise
   */
  public static isMouseButtonDown(mouseButton: 'left' | 'middle' | 'right') {
    return Input.instance._mouseButtons[mouseButton] >= 1 ? 1 : 0;
  }

  /**
   * Checks if the player has just pressed a mouse button
   * 
   * @param mouseButton 
   * @returns Returns 1 during the first frame of a mouse being pressed or 0 otherwise
   */
  public static isMouseButtonPressed(mouseButton: 'left' | 'middle' | 'right') {
    return Input.instance._mouseButtons[mouseButton] === 1 ? 1 : 0;
  }

  /**
   * Checks if the player is not pressing a mouse button
   * 
   * @param mouseButton 
   * @returns Returns 1 if the player is not pressing a mouse button or 0 otherwise
   */
  public static isMouseButtonUp(mouseButton: 'left' | 'middle' | 'right') {
    return Input.instance._mouseButtons[mouseButton] === 0;
  }

  public static get mouseMovement() {
    return Input.instance._mouseMovement;
  }
}