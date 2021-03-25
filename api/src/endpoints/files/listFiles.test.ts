import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { listFiles } from './listFiles';

describe('listFiles', () => {
  describe('GET request', () => {
    it('returns list of generated filename', async () => {
      const filename = 'test.html';
      const url = `${config.services.s3.endpointUrl}/files/${filename}`;
      const createdDate = new Date();
      overrideNextS3ListObjectResponse([
        {
          filename,
          eTag: 'anEtag',
          modified: createdDate,
          key: `files/${filename}`,
          url,
        },
      ]);

      const { status, message, json } = await testRequest(listFiles);

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.data).toEqual([
        { filename, url, modified: createdDate.toISOString() },
      ]);
    });
  });
});
