export type SignalCallbackType = number | string | boolean | object | void;
type CallbackFunction<T extends SignalCallbackType> = (args?: T) => void;

interface Callback<T extends SignalCallbackType> {
  callback: CallbackFunction<T>;
  context: object;
}

export class Signal<T extends SignalCallbackType> {
  private _listeners: Array<Callback<T>>;

  constructor() {
    this._listeners = [];
  }

  public add(callback: CallbackFunction<T>, context: object): void {
    this._listeners.push({ callback, context });
  }

  public remove(callback: CallbackFunction<T>): void {
    const len = this._listeners.length;
    for (let i = 0; i < len; i++) {
      if (this._listeners[i].callback === callback) {
        this._listeners.splice(i, 1);
        return;
      }
    }
  }

  public dispatch(args?: T): void {
    const len = this._listeners.length;

    for (let i = 0; i < len; i++) {
      const listener = this._listeners[i];
      listener.callback.bind(listener.context)(args);
    }
  }
}