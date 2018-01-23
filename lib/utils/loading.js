'use strict';

const ora = require('ora');

class Loading {
  constructor(name, color) {
    const spinner = ora(`Loading ${name}`).start();

    spinner.color = color || 'yellow';
    spinner.text = `Loading ${name}`;

    this.spinner = spinner;
  }

  /**
   * Loading success.
   */
  success(msg) {
    this.spinner.succeed(msg);
  }

  /**
   * Loading failure.
   */
  fail(msg) {
    this.spinner.fail(msg);
  }
}

module.exports = Loading;
