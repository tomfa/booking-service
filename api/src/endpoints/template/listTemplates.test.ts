import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { listTemplates } from './listTemplates';

describe('listTemplates', () => {
  describe('GET request', () => {
    it('returns list of template filenames', async () => {
      const filename = 'test.html';
      const url = `${config.services.s3.endpointUrl}/templates/${filename}`;
      const modified = new Date();
      overrideNextS3ListObjectResponse([
        {
          Etag: 'folderEtag',
          LastModified: modified,
          Key: `templates/`,
        },
        {
          Etag: 'anEtag',
          LastModified: modified,
          Key: `templates/${filename}`,
        },
      ]);

      const { status, message, json } = await testRequest(listTemplates);

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
