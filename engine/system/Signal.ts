// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallbackFunction = (...args: any[]) => void;

interface Callback {
  callback: CallbackFunction;
  context: object;
}

export class Signal {
  private _listeners: Array<Callback>;

  constructor() {
    this._listeners = [];
  }

  public add(callback: CallbackFunction, context: object): void {
    this._listeners.push({ callback, context });
  }

  public remove(callback: CallbackFunction): void {
    const len = this._listeners.length;
    for (let i = 0; i < len; i++) {
      if (this._listeners[i].callback === callback) {
        this._listeners.splice(i, 1);
        return;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public dispatch(...args: any[]): void {
    const len = this._listeners.length;

    for (let i = 0; i < len; i++) {
      const listener = this._listeners[i];
      listener.callback.bind(listener.context)(...args);
    }
  }
}