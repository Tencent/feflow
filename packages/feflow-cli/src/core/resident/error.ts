import fs from 'fs';
import path from 'path';
import osenv from 'osenv';
import { FEFLOW_ROOT, RESIDENT_ERROR_LOG } from '../../shared/constant';

const root = path.join(osenv.home(), FEFLOW_ROOT);
const defaultErrorLogFile = path.join(root, RESIDENT_ERROR_LOG);

export default class ErrorInstance {
  private jsonFile: string;

  constructor(errorJsonFile: string = defaultErrorLogFile) {
    this.jsonFile = errorJsonFile;
    if (!fs.existsSync(errorJsonFile)) {
      fs.appendFileSync(errorJsonFile, '{}', 'utf-8');
    }
  }

  read(scope: string, key?: string | undefined): string | object | undefined {
    try {
      const fileBuffer = fs.readFileSync(this.jsonFile);
      const errorJson = JSON.parse(fileBuffer.toString());
      if (Object.prototype.hasOwnProperty.call(errorJson, scope)) {
        if (key) {
          if (Object.prototype.hasOwnProperty.call(errorJson[scope], key)) {
            return errorJson[scope][key];
          }
          return;
        } else {
          return errorJson[scope];
        }
      }
    } catch (e) {
      throw e;
    }
  }

  update(scope: string, key: string | undefined, value: any): undefined {
    try {
      let modified = false;
      const fileBuffer = fs.readFileSync(this.jsonFile);
      const errorJson = JSON.parse(fileBuffer.toString());
      if (!errorJson[scope]) {
        modified = true;
        errorJson[scope] = {};
      }
      if (key) {
        // key 值不重复写，不覆盖
        if (Object.prototype.hasOwnProperty.call(errorJson[scope], key)) {
          return;
        }
        modified = true;
        errorJson[scope][key] = value;
      } else {
        modified = true;
        errorJson[scope] = value;
      }
      modified &&
        fs.writeFileSync(
          this.jsonFile,
          JSON.stringify(errorJson, null, 4),
          'utf-8'
        );
    } catch (e) {
      throw e;
    }
  }
}
