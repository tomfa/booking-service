import { FOLDER } from '@pdf-generator/shared';
import { testRequest } from '../testUtils/controllers.utils';
import { deleteFiles, getUploadURL } from './controller.helper';

describe('getUploadURL', () => {
  const controller = getUploadURL(FOLDER.templates);

  it('returns a signed url', async () => {
    const { status, message, json } = await testRequest(controller, {
      query: { name: 'Cheese.jpg' },
    });

    expect(status).toBe(200);
    expect(message).toBe('OK');
    const [key, signing] = json.url.split('?');
    expect(
      key.startsWith(
        'https://s3.eu-north-1.amazonaws.com/test.mybucket.com/kroloftet/templates/'
      )
    ).toBe(true);
    expect(key.endsWith('Cheese.jpg')).toBe(true);
    expect(signing).toContain('X-Amz-Algorithm');
  });
});

describe('deleteFiles', () => {
  const controller = deleteFiles(FOLDER.templates);

  it('deletes a file', async () => {
    const { status, message } = await testRequest(controller, {
      query: { files: 'Cheese', permanent: '1' },
    });

    expect(status).toBe(200);
    expect(message).toBe('OK');
  });
});
