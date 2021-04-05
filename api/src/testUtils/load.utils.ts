import * as fs from 'fs';

export const requireFile = (path: string): string =>
  fs.readFileSync(path, 'utf8');
