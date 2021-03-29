import * as uuid from 'uuid';
import { testRequest } from '../../testUtils/controllers.utils';

import { overrideNextS3ListObjectResponse } from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { listFiles } from './listFiles';

describe('listFiles', () => {
  const owner = 'kroloftet';
  describe('GET request', () => {
    it('returns list of generated filename', async () => {
      const filename = 'test.html';
      const fileId = uuid.v4();
      const key = `${owner}/files/${fileId}/${filename}`;
      const url = `${config.services.s3.endpointUrl}/${key}`;
      const createdDate = new Date();
      overrideNextS3ListObjectResponse(
        [
          {
            Etag: 'anEtag',
            LastModified: createdDate,
            Key: key,
          },
        ],
        `${owner}/files`
      );

      const { status, message, json } = await testRequest(listFiles);

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.data).toEqual([
        {
          filename,
          url,
          modified: createdDate.toISOString(),
          archived: false,
          id: fileId,
          owner,
          folder: 'files',
        },
      ]);
    });
  });
});
