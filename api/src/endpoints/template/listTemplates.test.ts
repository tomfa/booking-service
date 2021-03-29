import * as uuid from 'uuid';
import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { FOLDER } from '../enums';
import { listTemplates } from './listTemplates';

describe('listTemplates', () => {
  const username = `undefined`;
  describe('GET request', () => {
    it('returns list of template filenames', async () => {
      const filename = 'test.html';
      const id = uuid.v4();
      const url = `${config.services.s3.endpointUrl}/${username}/${FOLDER.templates}/${id}/${filename}`;
      const modified = new Date();
      overrideNextS3ListObjectResponse(
        [
          {
            Etag: 'folderEtag',
            LastModified: modified,
            Key: `${username}/${FOLDER.templates}/`,
          },
          {
            Etag: 'anEtag',
            LastModified: modified,
            Key: `${username}/${FOLDER.templates}/${id}/${filename}`,
          },
        ],
        `${username}/${FOLDER.templates}/`
      );

      const { status, message, json } = await testRequest(listTemplates);

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.data.length).toBe(1);
      expect(json.data[0]).toEqual({
        filename,
        modified: modified.toISOString(),
        url,
        archived: false,
        owner: username,
        id,
        folder: FOLDER.templates,
      });
    });
  });
});
