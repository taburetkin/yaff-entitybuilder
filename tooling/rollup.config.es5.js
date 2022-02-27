const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const cfg = require('../lib.config.json');

module.exports = {
  input: [cfg.es5Entry],
  output: {
    file: `./lib/${cfg.file}.es5.umd.js`,
    format: 'umd',
    name: 'routing'
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelrc: false,
      exclude: /node_modules/,
      presets: [
        [
          '@babel/preset-env'
          // ,
          // {
          //   modules: false,
          //   spec: true,
          //   forceAllTransforms: true,
          //   useBuiltIns: 'usage',
          //   corejs: 3
          // }
        ]
      ]
    })
  ]
};
