import path from 'path';
import fs from 'fs-extra';
import through2 from 'through2';

export function getComponentName(file: any) {
  const { history, base } = file;
  const [originPath] = history;
  const [, componentName] = originPath.split(base)[1].split('/');
  return componentName;
}

export const output = (dir: string) => {
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
