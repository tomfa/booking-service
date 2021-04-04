import { FOLDER } from '@pdf-generator/shared';
import { authedTestRequest } from '../testUtils/controllers.utils';
import config from '../config';
import { overrideNextS3ListObjectResponse } from '../../__mocks__/@aws-sdk/client-s3';
import { randomId } from '../utils/id';
import { deleteFiles, getUploadURL, listFiles } from './controller.helper';

describe('getUploadURL', () => {
  const controller = getUploadURL(FOLDER.templates);
  const user = { username: 'kroloftet' };

  it('returns a signed url', async () => {
    const { status, message, json } = await authedTestRequest(
      controller,
      user,
      {
        query: { name: 'Cheese.jpg' },
      }
    );

    expect(status).toBe(200);
    expect(message).toBe('OK');
    const { uploadUrl, file } = json.data;
    const [fileUrl, signing] = uploadUrl.split('?');
    expect(
      fileUrl.startsWith(
        'https://s3.eu-north-1.amazonaws.com/test.mybucket.com/kroloftet/templates/'
      )
    ).toBe(true);
    expect(fileUrl.endsWith('Cheese.jpg')).toBe(true);
    expect(signing).toContain('X-Amz-Algorithm');
    expect(file).toEqual(
      expect.objectContaining({
        owner: 'kroloftet',
        folder: 'templates',
        filename: 'Cheese.jpg',
        archived: false,
      })
    );
    expect(
      file.url.startsWith(
        'https://s3.eu-north-1.amazonaws.com/test.mybucket.com/kroloftet/templates/'
      )
    ).toBeTruthy();
    expect(file.url.endsWith('Cheese.jpg')).toBeTruthy();
  });
});

describe('deleteFiles', () => {
  const controller = deleteFiles(FOLDER.templates);
  const user = { username: 'kroloftet' };

  it('deletes a file', async () => {
    const { status, message } = await authedTestRequest(controller, user, {
      query: { files: 'Cheese', permanent: '1' },
    });

    expect(status).toBe(200);
    expect(message).toBe('OK');
  });
});

describe('listFiles', () => {
  const folder = FOLDER.templates;
  const controller = listFiles(folder);
  const user = { username: 'kroloftet' };
  const owner = user.username;

  it('lists files', async () => {
    const filename = 'test.html';
    const fileId = randomId();
    const key = `${owner}/${folder}/${fileId}/${filename}`;
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
      `${owner}/${folder}`
    );

    const { status, message, json } = await authedTestRequest(controller, user);

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
        folder,
      },
    ]);
  });
});
