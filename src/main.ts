import axios from 'axios';
import type { SourceDef } from './types/SourceDef';
import sources from '../def/sourceDefinition.json';
import { cleanDir } from './util/cleanDir';
import { saveSourceFile } from './util/saveSourceFile';
import { processSourceFile } from './util/processSourceFile';

const OUTPUT = __dirname + '/../../output';
const TMP = __dirname + '/../../tmp';

async function main() {
  cleanDir(OUTPUT);
  cleanDir(TMP);

  await Promise.all(
    (sources as SourceDef[])
      .filter((sourceDef) => typeof sourceDef.url === 'string')
      .map(async (sourceDef) => {
        try {
          const sourceFile = await axios.get<string>(sourceDef.url!, { responseType: 'text' });
          await saveSourceFile(`${TMP}/${sourceDef.target}`, sourceFile.data);
          processSourceFile(`${TMP}/${sourceDef.target}.xml`, `${OUTPUT}/${sourceDef.target}.ssc`, sourceDef.feature);
        } catch (e: unknown) {
          if (e instanceof Error) {
            console.log(`ERROR in ${sourceDef.target}: ${e.message}`);
          } else {
            console.log(e);
          }
        }
      })
  );
}
void main();
