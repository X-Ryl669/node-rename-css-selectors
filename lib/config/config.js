const rcs = require('rcs-core');
const path = require('path');
const json = require('json-extra');
const minimatch = require("minimatch");

class Config {
  constructor() {
    this.ignorePatterns = [];
  }

  load(pathString = path.join(process.cwd(), '.rcsrc')) {
    let configObject;

    configObject = json.readToObjSync(pathString);

    if (!configObject) {
      // package.json .rcs if no other config is found
      configObject = json.readToObjSync(path.join(process.cwd(), 'package.json')).rcs;
    }

    if (configObject.exclude) {
      rcs.selectorsLibrary.setExclude(configObject.exclude);
    }

    if (configObject.reserve) {
      rcs.selectorsLibrary.setReserved(configObject.reserve);
    }

    if (configObject.ignore) {
      this.ignorePatterns = configObject.ignore;
    }
  }

  isIgnored(filePath) {
    for (let i = 0; i < this.ignorePatterns.length; i++) {
      if (minimatch(filePath, this.ignorePatterns[i])) {
        return true;
      }
    }
    return false;
  }
}; // /include

module.exports = new Config;