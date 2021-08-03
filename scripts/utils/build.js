const path = require('path');
const fs = require('fs-extra');
const through2 = require('through2');

function getComponentName(file) {
  const { history, base } = file;
  const [, resultPath] = history;
  const [, componentName] = resultPath.split(base)[1].split('/');
  return componentName;
}

exports.output = (dir) => {
  return through2.obj((file, encode, next) => {
    const { history, base, contents } = file;
    const [, resultPath] = history;
    const fileName = path.basename(resultPath);
    const componentName = getComponentName(file);
    const outputPath = path.join(base, componentName, dir, fileName);
    fs.outputFileSync(outputPath, contents);
    next();
  });
};
