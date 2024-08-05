export interface ParsedXml {
  kml: {
    Document: {
      Folder: {
        Placemark: PlaceMark|PlaceMark[];
      }
    }
  }
}

export interface PlaceMark {
  name: string;
  ExtendedData: {
    SchemaData: {
      SimpleData: SimpleDataAttr[]
    }
  }
}

export interface SimpleDataAttr {
  '#text': string | number;
  '@_name': PlaceAttr;
}

export type PlaceAttr = 'clean_name' | 'diameter' | 'center_lon' | 'center_lat' | 'code' | 'approval';