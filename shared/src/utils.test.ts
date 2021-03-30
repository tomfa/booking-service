import {
  getFileDataFromUrl,
  getKeyFromData,
  removeDomainFromUrl,
  removeQueryFromUrl,
} from './utils';
import { FOLDER } from './types';

describe('getFileDataFromUrl', () => {
  const endpoint = 'https://example.com';
  it('returns fileData from URL', () => {
    const originalData = {
      folder: FOLDER.templates,
      filename: 'I love aspargus.html',
      modified: '', // Note blank modified
      owner: 'darth',
      id: 'random-uuid-key',
      archived: false,
    };
    const url = endpoint + `/` + getKeyFromData(originalData);
    expect(url).toBe(
      `${endpoint}/darth/${FOLDER.templates}/${originalData.id}/I love aspargus.html`
    );

    const parsedData = getFileDataFromUrl(url);
    expect(parsedData).toEqual({ ...originalData, url, archived: false });
  });
  it('parses archived urls', () => {
    const id = 'random-uuid-key';
    const badUrl = `${endpoint}/darth/${FOLDER.templates}/${id}/I love aspargus.html.archived`;

    const data = getFileDataFromUrl(badUrl);

    expect(data.filename).toBe(`I love aspargus.html`);
    expect(data.archived).toBe(true);
  });

  it('throws an error when URL is missing expected parts', () => {
    const missingId = '';
    const badUrl = `${endpoint}/darth/folder/${missingId}/I love aspargus.html`;

    try {
      getFileDataFromUrl(badUrl);
      fail('getFileDataFromUrl should throw error when missing id');
    } catch (err) {}
  });
});

describe('getKeyFromData', () => {
  it('returns fileKey based on FileData', () => {
    const fileData = {
      folder: FOLDER.fonts,
      filename: 'I love aspargus.html',
      modified: 'today',
      owner: 'darth',
      id: 'random-uuid-key',
      archived: false,
    };
    const archivedFile = { ...fileData, archived: true };

    const fileKey = getKeyFromData(fileData);
    const archivedKey = getKeyFromData(archivedFile);

    expect(fileKey).toBe(
      `darth/${FOLDER.fonts}/${fileData.id}/I love aspargus.html`
    );
    expect(archivedKey).toBe(`${fileKey}.archived`);
  });
});

describe('removeDomainFromUrl', () => {
  describe('removes domain and protocol ?', () => {
    expect(removeDomainFromUrl('https://vg.no')).toBe('');
    expect(removeDomainFromUrl('https://vg.no/')).toBe('');
    expect(removeDomainFromUrl('vg.no/ost/kake?fem')).toBe('ost/kake?fem');
  });
});
describe('removeQueryFromUrl', () => {
  describe('returns nothing after ?', () => {
    expect(removeQueryFromUrl('https://vg.no')).toBe('https://vg.no');
    expect(removeQueryFromUrl('https://vg.no/ost')).toBe('https://vg.no/ost');
    expect(removeQueryFromUrl('vg.no/ost/kake?fem')).toBe('vg.no/ost/kake');
  });
});
