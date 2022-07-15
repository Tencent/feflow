/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require('child_process');

if (process.env.CI) {
  console.log('Skip npm version check in CI environment');
  process.exit(0);
}

const restrictMajorVersion = '7';
const semverRegExp =  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

exec('npm --version', (error, stdout, stderr) => {
  if (error || !stdout) {
    console.error(error || stderr);
    process.exit(1);
  }
  const [, majorVersion] = semverRegExp.exec(stdout) || [];
  if (majorVersion >= restrictMajorVersion) {
    console.log(`Please use a version of npm lower than v${restrictMajorVersion} for development due to a bug of lerna: https://github.com/lerna/lerna/issues/2832 .`);
    process.exit(1);
  } else {
    console.log('npm version ok');
  }
});
