import { XMLParser } from 'fast-xml-parser';
import * as fs from 'node:fs';
import custom from '../../def/custom.json';
import { ParsedXml, PlaceAttr, PlaceMark, SimpleDataAttr } from '../types/ParsedXml';
import { CustomSources } from '../types/CustomSource';

export function processSourceFile(sourceFile: string, targetFile: string, bodyPath: string): void {
  const sourceData = fs.readFileSync(sourceFile).toString();
  const parser = new XMLParser({ignoreAttributes : false});
  const data = parser.parse(sourceData) as ParsedXml;

  const fileHandle = fs.openSync(targetFile, 'a');
  const places: PlaceMark[] = Array.isArray(data.kml.Document.Folder.Placemark)
    ? data.kml.Document.Folder.Placemark
    : [data.kml.Document.Folder.Placemark];

  places.forEach((sourcePlace) => {
    const source = sourcePlace.ExtendedData.SchemaData.SimpleData;
    const getAttr = (name: PlaceAttr, source: SimpleDataAttr[]) => source.find((attr) => attr['@_name'] === name)?.['#text'] + '';

    if (getAttr('approval', source) === 'Adopted by IAU') {
      const name = getAttr('clean_name', source);
      const customizedData = (custom as CustomSources)?.[bodyPath]?.[name];
      const placeModel = {
        name,
        type: getAttr('code', source),
        diameter: customizedData?.size ?? parseFloat(getAttr('diameter', source)),
        lon: customizedData?.longlat?.[0] ?? parseFloat(getAttr('center_lon', source)),
        lat: customizedData?.longlat?.[1] ?? parseFloat(getAttr('center_lat', source)),
        alt: customizedData?.longlat?.[2] ?? 0,
      }

      fs.writeSync(fileHandle, `
Location "${placeModel.name}" "${bodyPath}"
{
    LongLat [ ${placeModel.lon} ${placeModel.lat} ${placeModel.alt} ]
    Size    ${placeModel.diameter}
    Type    "${placeModel.type}"
}
      `);
    }
  });
  fs.closeSync(fileHandle);
}
