'use strict';

const fs = require('fs');
const path = require('path');

class Config {
    /**
     * @function getPath
     * @desc     Find feflow.json file
     */
    static getPath() {
        let currDir = process.cwd();

        while (!fs.existsSync(path.join(currDir, 'feflow.json'))) {
            currDir = path.join(currDir, '../');

            // unix跟目录为/， win32系统根目录为 C:\\格式的
            if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
                console.error('未找到 feflow.json');
                process.exit(1);
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
        const configFile = path.join(Config.getPath(), './feflow.json');

        if (!fs.existsSync(configFile)) {
            console.error('未找到 feflow.json');
        } else {
            const fileContent = fs.readFileSync(configFile, 'utf-8');

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
        }
    }
}

module.exports = Config;
