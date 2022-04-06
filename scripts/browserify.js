/* eslint @typescript-eslint/no-var-requires: 0 */

const browserify = require('browserify');
const tsify = require('tsify');
const tsConfig = require('../tsconfig.json');
const fs = require('fs');

function getProjectPath() {
  return 'src/';
}
  
function getEntriesPath() {
  return getProjectPath() + 'Game.ts';
}

function getTSConfigFile() {
  return './tsconfig.json';
}

function onError(error) {
  console.error(error);
}

function getDestinyPath() {
  return './build/js';
}

module.exports = {
  getBrowserify: (debug) => {
    return browserify({
      basedir: '.',
      debug: debug,
      entries: [getEntriesPath()],
      paths: [getProjectPath()],
      files: tsConfig.files,
      cache: {},
      packageCache: {}
    })
      .plugin(tsify, { project: getTSConfigFile() })
      .add('./src/Game.ts')
      .on('error', onError);
  },

  build: function (bundle) {
    if (!fs.existsSync(getDestinyPath())) {
      fs.mkdirSync(getDestinyPath(), { recursive: true });
    }

    bundle
      .bundle()
      .pipe(fs.createWriteStream(getDestinyPath() + '/game.js'))
      .on('finish', () => {
        console.log('Finished executing browserify');
      });
  }
};

