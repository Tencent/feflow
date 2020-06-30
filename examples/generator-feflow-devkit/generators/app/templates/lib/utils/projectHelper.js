const path = require('path');

class ProjectHelper {
  constructor(feflow) {
    this.feflow = feflow
    this.projectPath = feflow.projectPath
  }

  getProjectPath(...filePath) {
    return path.join(this.projectPath, ...filePath)
  }
}

module.exports = ProjectHelper
