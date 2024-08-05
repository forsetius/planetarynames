import * as fs from 'node:fs';

export function cleanDir(dirPath: string) {
  fs.readdirSync(dirPath).forEach((fileName) => {
    if (fileName !== '.gitkeep') {
      fs.unlinkSync(`${dirPath}/${fileName}`);
    }
  });
}
