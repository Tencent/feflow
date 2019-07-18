import fs from 'fs';
import Feflow from "../index"

module.exports = (ctx: Feflow) => {
    const { root, rootPkg } = ctx;
    if (fs.existsSync(root) && fs.statSync(root).isFile()) {
        fs.unlinkSync(root);
    }

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root);
    }

    if (!fs.existsSync(rootPkg)) {
        fs.writeFileSync(rootPkg, JSON.stringify({
          'name': 'feflow-home',
          'version': '0.0.0',
          'private': true
        }, null, 2));
    }
};