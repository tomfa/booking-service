import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { listTemplates } from './listTemplates';

describe('listTemplates', () => {
  describe('GET request', () => {
    it('returns list of template filenames', async () => {
      const filename = 'test.html';
      overrideNextS3ListObjectResponse([
        {
          filename,
          eTag: 'anEtag',
          modified: new Date(),
          key: `templates/${filename}`,
          url: `${config.services.s3.endpointUrl}/templates/${filename}`,
        },
      ]);

      const { status, message, json } = await testRequest(listTemplates);

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.templates).toEqual([filename]);
    });
  });
});
