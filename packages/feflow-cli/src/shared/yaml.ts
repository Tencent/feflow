import fs from 'fs';
import yaml from 'js-yaml';

export function parseYaml(path: string) {
  let config;

  if (fs.existsSync(path)) {
    config = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  }

  return config;
}

export function safeDump(obj: object, path: string) {
  const doc = yaml.safeDump(obj, {
    styles: {
      '!!null': 'canonical',
    },
    sortKeys: true,
    skipInvalid: true,
  });

  return fs.writeFileSync(path, doc, 'utf-8');
}
