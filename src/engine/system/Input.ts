import { Signal } from './Signal';

export class Input {
  private _canvas: HTMLCanvasElement;
  private _focused: boolean;

  public onKeyDown: Signal<KeyboardEvent>;
  public onKeyUp: Signal<KeyboardEvent>;
  
  public static instance: Input;

  constructor(canvas: HTMLCanvasElement) {
    Input.instance = this;

    this._canvas = canvas;
    this._focused = false;

    this.onKeyDown = new Signal();
    this.onKeyUp = new Signal();

    document.addEventListener('click', (ev: MouseEvent) => {
      this._focused = ev.target === this._canvas;
    })

    document.body.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (!this._focused) { return; }

      this.onKeyDown.dispatch(ev);
    });

    document.body.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (!this._focused) { return; }

      this.onKeyUp.dispatch(ev);
    });
  }
}