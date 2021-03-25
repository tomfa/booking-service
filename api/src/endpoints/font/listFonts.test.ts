import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { listFonts } from './listFonts';

describe('listFonts', () => {
  describe('GET request', () => {
    it('returns list of template filenames', async () => {
      const filename = 'testFont.otf';
      const url = `${config.services.s3.endpointUrl}/fonts/${filename}`;
      const modified = new Date();
      overrideNextS3ListObjectResponse([
        {
          filename: '',
          eTag: 'folderEtag',
          modified,
          key: `fonts/`,
          url: `${config.services.s3.endpointUrl}/fonts/`,
        },
        {
          filename,
          eTag: 'anEtag',
          modified,
          key: `fonts/${filename}`,
          url,
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
      });
    });
  });
});
