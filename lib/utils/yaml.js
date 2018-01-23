'use strict';

const yaml = require('js-yaml');
const fs = require('hexo-fs');

// Get document, or throw exception on error
function parseYaml(path) {
  let config;

  if (fs.existsSync(path)) {
    try {
      config = yaml.safeLoad(fs.readFileSync(path));

    } catch (e) {
      console.log(e);
    }
  }

  return config;
}


function safeDump(obj, path) {
  let doc;
  try {
    doc = yaml.safeDump(obj, {
      'styles': {
        '!!null': 'canonical' // dump null as ~
      },
      'sortKeys': true        // sort object keys
    });
  } catch (e) {
    console.log(e);
  }

  return fs.writeFileSync(path, doc, 'utf-8');
}

exports.parseYaml = parseYaml;
exports.safeDump = safeDump;
