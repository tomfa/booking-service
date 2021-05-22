import { FOLDER, utils } from '@booking-service/shared';
import config from '../config';
import { randomId } from '../utils/id';
import { getAbsoluteUrlFromKey, getFileDataFromUrl } from './utils';

describe('getFileDataFromUrl', () => {
  it('returns fileData from URL', () => {
    const originalData = {
      folder: FOLDER.templates,
      filename: 'I love aspargus.html',
      modified: '', // Note blank modified
      owner: 'darth',
      id: randomId(),
      archived: false,
    };
    const url = getAbsoluteUrlFromKey(utils.getKeyFromData(originalData));
    expect(url).toBe(
      `${config.services.s3.endpointUrl}/darth/${FOLDER.templates}/${originalData.id}/I love aspargus.html`
    );

    const parsedData = getFileDataFromUrl(url);
    expect(parsedData).toEqual({ ...originalData, url });
  });
  it('parses archived urls', () => {
    const id = randomId();
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
      id: randomId(),
      archived: true,
    };
    const url = getAbsoluteUrlFromKey(utils.getKeyFromData(originalData));
    const urlFromDifferentDomain = url.replace(
      config.services.s3.endpointUrl,
      'https://example.com'
    );

    expect(() => getFileDataFromUrl(urlFromDifferentDomain)).toThrow(
      'getFileDataFromUrl should throw error when from unknown domain'
    );
  });
  it('throws an error when URL is missing expected parts', () => {
    const missingId = '';
    const badUrl = `${config.services.s3.endpointUrl}/darth/folder/${missingId}/I love aspargus.html`;

    expect(() => getFileDataFromUrl(badUrl)).toThrow(
      'getFileDataFromUrl should throw error when missing id'
    );
  });
});
