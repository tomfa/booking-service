export enum FOLDER {
  files = 'files',
  fonts = 'fonts',
  templates = 'templates',
}

export type FileDataDTO = {
  filename: string;
  url: string;
  modified: string;
  owner: string;
  folder: FOLDER;
  id: string;
  archived: boolean;
};
