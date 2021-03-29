import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { FOLDER } from '../enums';
import { listFonts } from './listFonts';

describe('listFonts', () => {
  const owner = `undefined`;
  describe('GET request', () => {
    it('returns list of template filenames', async () => {
      const filename = 'testFont.otf';
      const id = '1441';
      const url = `${config.services.s3.endpointUrl}/${owner}/${FOLDER.fonts}/${id}/${filename}`;
      const modified = new Date();
      overrideNextS3ListObjectResponse([
        {
          Etag: 'folderEtag',
          LastModified: modified,
          Key: `${owner}/${FOLDER.fonts}/`,
        },
        {
          Etag: 'anEtag',
          LastModified: modified,
          Key: `${owner}/${FOLDER.fonts}/${id}/${filename}`,
        },
      ]);

      const { status, message, json } = await testRequest(listFonts);

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.data.length).toBe(1);
      expect(json.data[0]).toEqual({
        filename,
        modified: modified.toISOString(),
        url,
        archived: false,
        folder: FOLDER.fonts,
        id,
        owner,
      });
    });
  });
});
