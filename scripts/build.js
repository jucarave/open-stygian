/* eslint @typescript-eslint/no-var-requires: 0 */

const args = process.argv.slice(2);

const debug = args.indexOf('debug') !== -1 ? true : false;

const browserify = require('./browserify');
browserify.build(browserify.getBrowserify(debug));