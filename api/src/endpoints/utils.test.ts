import * as uuid from 'uuid';
import { FOLDER } from '@pdf-generator/shared';
import config from '../config';
import {
  getAbsoluteUrlFromKey,
  getFileDataFromUrl,
  getKeyFromData,
} from './utils';

describe('getFileDataFromUrl', () => {
  it('returns fileData from URL', () => {
    const originalData = {
      folder: FOLDER.templates,
      filename: 'I love aspargus.html',
      modified: '', // Note blank modified
      owner: 'darth',
      id: uuid.v4(),
      archived: false,
    };
    const url = getAbsoluteUrlFromKey(getKeyFromData(originalData));
    expect(url).toBe(
      `${config.services.s3.endpointUrl}/darth/${FOLDER.templates}/${originalData.id}/I love aspargus.html`
    );

    const parsedData = getFileDataFromUrl(url);
    expect(parsedData).toEqual({ ...originalData, url, archived: false });
  });
  it('parses archived urls', () => {
    const id = uuid.v4();
    const badUrl = `${config.services.s3.endpointUrl}/darth/${FOLDER.templates}/${id}/I love aspargus.html.archived`;

    const data = getFileDataFromUrl(badUrl);

    expect(data.filename).toBe(`I love aspargus.html`);
    expect(data.archived).toBe(true);
  });
  it('throws an error if URL comes from a different domain', () => {
    const originalData = {
      folder: FOLDER.templates,
      filename: 'I love aspargus.html',
      modified: '', // Note blank modified
      owner: 'darth',
      id: uuid.v4(),
      archived: true,
    };
    const url = getAbsoluteUrlFromKey(getKeyFromData(originalData));
    const urlFromDifferentDomain = url.replace(
      config.services.s3.endpointUrl,
      'https://example.com'
    );

    try {
      getFileDataFromUrl(urlFromDifferentDomain);
      fail('getFileDataFromUrl should throw error when from unknown domain');
    } catch (err) {}
  });
  it('throws an error when URL is missing expected parts', () => {
    const missingId = '';
    const badUrl = `${config.services.s3.endpointUrl}/darth/folder/${missingId}/I love aspargus.html`;

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
      id: uuid.v4(),
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
