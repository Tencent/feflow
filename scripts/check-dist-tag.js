const semverRegExp = (/^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g);

const { GITHUB_REF_NAME: tagName } = process.env;
const matchResult = semverRegExp.exec(tagName);
let distTag = 'latest';
if (matchResult) {
  [, , , , , distTag = 'latest'] = matchResult;
}
// 注意：此脚本只能输出 dist tag，不能输出其他 log，否则会污染 stdout 导致无法正常发布！
console.log(`DIST_TAG=${distTag}`);
