const cfg = require('../lib.config.json');

module.exports = {
  input: cfg.esmEntry,
  output: {
    file: `./lib/${cfg.file}.esm.js`,
    format: 'esm'
  }
};
