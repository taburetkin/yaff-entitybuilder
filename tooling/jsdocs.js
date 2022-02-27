const cfg = require('../lib.config.json');
const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
(async () => {
  let content = await jsdoc2md.render({
    files: cfg.docs.files,
    configure: './tooling/jsdoc.config.js'
  });
  fs.writeFileSync('reference.md', content);
})();
