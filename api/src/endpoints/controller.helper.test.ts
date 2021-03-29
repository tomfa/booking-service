import { testRequest } from '../testUtils/controllers.utils';
import { deleteFiles, getUploadURL } from './controller.helper';
import { FOLDER } from './enums';

describe('getUploadURL', () => {
  const controller = getUploadURL(FOLDER.templates);

  it('returns a signed url', async () => {
    const { status, message, json } = await testRequest(controller, {
      query: { name: 'Cheese' },
    });

    expect(status).toBe(200);
    expect(message).toBe('OK');
    expect(
      json.url.startsWith(
        'https://s3.eu-north-1.amazonaws.com/test.mybucket.com/templates/Cheese'
      )
    ).toBe(true);
  });
});

describe('deleteFiles', () => {
  const controller = deleteFiles(FOLDER.templates);

  it('deletes a file', async () => {
    const { status, message } = await testRequest(controller, {
      query: { files: 'Cheese' },
    });

    expect(status).toBe(200);
    expect(message).toBe('OK');
  });
});
