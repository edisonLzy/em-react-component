import through2 from 'through2';
import shell from 'shelljs';
import path from 'path';
import { getComponentName } from './build';
/**
 *
 * @returns 输出 ts文件
 */
export function buildType() {
  return through2.obj((file, encode, next) => {
    const { base } = file;
    const componentName = getComponentName(file);
    const projectPath = path.join(base, componentName);
    shell.exec(`npx tsc --project ${projectPath}`);
    next();
  });
}
