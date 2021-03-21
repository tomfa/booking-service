import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { listTemplates } from './listTemplates';

describe('listTemplates', () => {
  describe('GET request', () => {
    it('returns list of template filenames', async () => {
      const filename = 'test.html';
      const url = `${config.services.s3.endpointUrl}/templates/${filename}`
      const modified = new Date();
      overrideNextS3ListObjectResponse([
        {
          filename: '',
          eTag: 'folderEtag',
          modified,
          key: `templates/`,
          url: `${config.services.s3.endpointUrl}/templates/`,
        },
        {
          filename,
          eTag: 'anEtag',
          modified,
          key: `templates/${filename}`,
          url,
        },
      ]);

      const { status, message, json } = await testRequest(listTemplates);

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.templates.length).toBe(1);
      expect(json.templates[0]).toEqual({ filename, modified: modified.toISOString(), url });
    });
  });
});
