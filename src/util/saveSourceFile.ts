import {  once } from 'node:events';
import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import * as readline from 'node:readline';

export async function saveSourceFile(fileName: string, sourceData: string) {
  await writeFile(`${fileName}.kmz`, sourceData);
  const input = createReadStream(`${fileName}.kmz`);
  const output = createWriteStream(`${fileName}.xml`);
  const rl = readline.createInterface({ input, output });

  rl.on('line', (line) => {
    const start = line.indexOf('<?xml');
    const end = line.indexOf('</kml>');

    if (start > -1) {
      output.write(line.slice(start) + "\n");
    } else if (end > -1) {
      output.write(line.slice(0, end + 6));
      rl.removeAllListeners('line');
    } else {
      output.write(line + "\n");
    }
  });

  await once(input, 'close');
}
