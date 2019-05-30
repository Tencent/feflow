'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const Loading = require('../../utils/index').Loading;
const exec = require('child_process').exec;
const sgf = require('staged-git-files');
const pify = require('pify');
const findParentDir = require('find-parent-dir');

// filter js file
function jsFilesFilter (files){
  return files.filter(filepath => /\.js$/.test(filepath));
}

// get stage files
function getStageFiles(cb) {
  const gitDir = findParentDir.sync(process.cwd(), '.git');
  sgf.cwd = gitDir
  let stageFiles = [];
  sgf('ACM', (err, files) => {
    if (files) {
      stageFiles = files.map(item => {
        return item.filename
      })
    }
    cb(err, stageFiles);
  });
}

// get commit times
function getCommitTimes(cb) {
  exec('git rev-list --all --count', 'utf8', (err, stdout, stderr) => {
    if (err) {
      console.log('err:', err)
    } else {
        
    }
    cb(err, Number(stdout));
  })
}


// get last commit files
function getCommitDiffFiles(cb) {
  let result = [];
  const command = 'git diff --name-status HEAD~ HEAD';
  const getArrList = (str, type) => {
    const arr = str.split('\n')
    return arr.filter(item => {
      const regex = new RegExp(`[${type}].*`)
      if (regex.test(item)) {
        return item !== undefined
      }
    })
  }
  const formatList = (arr, type) => {
    return arr.map(item => {
      return item.replace(/\s/g, '').replace(type, '')
    })
  }
  exec(command, 'utf8', (err, stdout, stderr) => {
    if (err) {
      console.log('err:', err)
      console.log('stderr:', stderr)
    } else {
      const typeList = ['A', 'C', 'M'];
      let arr;
      typeList.forEach(type => {
        arr = getArrList(stdout, type)
        arr = formatList(arr, type)
        if (arr.length > 0) {
          result = result.concat(arr);
        }
      })
    }
    cb(err, result);
  })
}

function lintNeedCheckFiles(checkFiles) {
  if (typeof checkFiles !== 'function') return;
  pify(getStageFiles)().then(files => {
    if (files && files.length) {
      checkFiles(jsFilesFilter(files));
    } else {
      pify(getCommitTimes)().then(commitNum => {
            if (commitNum > 1) {
              pify(getCommitDiffFiles)().then(files => {
                  if (files.length) {
                    checkFiles(jsFilesFilter(files))
                  } else {
                    checkFiles()
                  }
              })
            } else {
                //lint all
                checkFiles()
            }
        })
    }
  })
}

class Linter {

  constructor(ctx) {
    this.ctx = ctx;
  }

  init(args = [], ignores = []) {
    const nodePath = path.resolve(__dirname, '../../../node_modules');
    const rootPath = process.cwd();
    const target = args.length ? args.map(arg => path.resolve(rootPath, arg)) : [rootPath];

    const lintIgnores = [];
    ignores.forEach(ignore => {
      lintIgnores.push('--ignore-pattern');
      lintIgnores.push(ignore);
    });

    const child = spawn(
      path.resolve(nodePath, '.bin/eslint'),
      ['--ignore-pattern', 'node_modules', ...lintIgnores, ...target],
      { stdio: 'inherit' }
    );
    const loading = new Loading('linting');

    child.on('close', (code) => {
      if (!code) {
        loading.success('lint complete');
      } else {
        loading.fail(`code get errors or warnings`);
        process.exit(code);
      }
    });
  }
}

module.exports = function (args) {
  const linter = new Linter(this);
  let { _, ignore } = args;

  if (ignore) {
    ignore = Array.isArray(ignore) ? ignore : [ignore];
  }

  return lintNeedCheckFiles((args) => {
    if (!args || args.length) {
      linter.init(args, ignore)
    }
  });
};
