export interface CustomSources {
  [key: string]: CustomSource;
}

interface CustomSource {
  [key: string]: CustomizedData;
}

interface CustomizedData {
  size?: number,
  longlat?: number[],
}
