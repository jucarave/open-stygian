import { KEY_CODES } from './KeyCodes';

export const Config = {
  input: {
    up: KEY_CODES.W,
    left: KEY_CODES.A,
    down: KEY_CODES.S,
    right: KEY_CODES.D,

    lookLeft: KEY_CODES.Q,
    lookRight: KEY_CODES.E,
    lookUp: KEY_CODES.Digit1,
    lookCenter: KEY_CODES.Digit2,
    lookDown: KEY_CODES.Digit3,
  },

  player: {
    radius: 0.3,
    height: 0.6
  },

  gravity: -0.003,
  slopeHeight: 0.2
};