/* eslint @typescript-eslint/no-var-requires: 0 */

const browserify = require('browserify');
const tsify = require('tsify');
const tsConfig = require('../tsconfig.json');
const fs = require('fs');

const args = process.argv.slice(2);

function getProjectPath() {
  const argInd = args.indexOf('--project');
  if (argInd === -1) { throw new Error('No project specified'); }
  
  switch (args[argInd + 1]) {
    case 'game':
      return ['./src', './game/src/'];

    case 'mapEditor':
      return ['./src', './mapEditor/src/'];

    default:
      throw new Error(`Invalid project ${args[argInd + 1]}`);
  }
}
  
function getEntriesPath() {
  const argInd = args.indexOf('--project');
  if (argInd === -1) { throw new Error('No project specified'); }
  
  switch (args[argInd + 1]) {
    case 'game':
      return './game/src/Game.ts';

    case 'mapEditor':
      return './mapEditor/src/MapEditor.ts';

    default:
      throw new Error(`Invalid project ${args[argInd + 1]}`);
  }
}

function getTSConfigFile() {
  return './tsconfig.json';
}

function onError(error) {
  console.error(error);
}

function getDestinyPath() {
  const argInd = args.indexOf('--project');
  if (argInd === -1) { throw new Error('No project specified'); }
  
  switch (args[argInd + 1]) {
    case 'game':
      return './game/build/js';

    case 'mapEditor':
      return './mapEditor/build/js';

    default:
      throw new Error(`Invalid project ${args[argInd + 1]}`);
  }
}

module.exports = {
  getBrowserify: (debug) => {
    return browserify({
      basedir: '.',
      debug: debug,
      entries: [getEntriesPath()],
      paths: getProjectPath(),
      files: tsConfig.files,
      cache: {},
      packageCache: {}
    })
      .plugin(tsify, { project: getTSConfigFile() })
      .add(getEntriesPath())
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

