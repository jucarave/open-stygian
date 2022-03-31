/* eslint @typescript-eslint/no-var-requires: 0 */

const args = process.argv.slice(2);

const debug = args.indexOf('debug') !== -1 ? true : false;

const browserify = require('./browserify');
const watchify = require('watchify');
const errorify = require('errorify');

function watchBundle() {
    const bundle = browserify.getBrowserify(debug);

    bundle.plugin(watchify).plugin(errorify);

    bundle.on('update', function() {
        browserify.build(bundle);
    });

    bundle.on('log', function(msg) {
      console.log(msg);
    });

    browserify.build(bundle);

    return bundle;
}

watchBundle();