'use strict';

const fs = require('fs');
const path = require('path');

class Config {
    /**
     * @function getPath
     * @desc     Find feflow.json file
     */
    static getPath(filename) {
        let currDir = process.cwd();

        while (!fs.existsSync(path.join(currDir, filename))) {
            currDir = path.join(currDir, '../');

            // unix跟目录为/， win32系统根目录为 C:\\格式的
            if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
                return false;
            }
        }

        return currDir;
    }

    /**
     * @function getBuilderType
     * @desc     Find builder type in feflow.json
     */
    static getBuilderType() {
        let builderType;

        if (Config.getPath('feflow.json')) {
            const jsonConfigFile = path.join(Config.getPath('feflow.json'), './feflow.json');
            const fileContent = fs.readFileSync(jsonConfigFile, 'utf-8');

            let feflowCfg;

            try {
                feflowCfg = JSON.parse(fileContent);
            } catch (ex) {
                console.error('请确保feflow.json配置是一个Object类型，并且含有builderType字段');
            }

            builderType = feflowCfg.builderType;

            if (!builderType) {
              console.error('请确保feflow.json配置是一个Object类型，并且含有builderType字段内容不为空')
            }
            return builderType;
        } else if (Config.getPath('feflow.js')) {
            const jsConfigFile = path.join(Config.getPath('feflow.js'), './feflow.js');

            let feflowCfg = require(jsConfigFile);

            builderType = feflowCfg.builderType;

            if (!builderType) {
              console.error('请确保feflow.js配置包含builderType字段，且内容不为空')
            }
            return builderType;
        } else {
            console.error('未找到 feflow 配置文件 feflow.json 或者 feflow.js');
        }
    }
}

module.exports = Config;
