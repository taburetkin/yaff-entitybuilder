
module.exports = {
  extends: '@istanbuljs/nyc-config-babel',
  //all: true,
  include: [
    'index.js',
    'build.js',
    'knownCtors.js',
    'utils.js',
    'invokeValue.js'
  ],
  // exclude: [
  //   'jsdocs.js',
  //   'nyc.config.js',
  //   'rollup.config.js',
  //   'jsdoc.config.js'
  // ],
  reporter: ['text', 'html'],
  'report-dir': './.coverage'
};
