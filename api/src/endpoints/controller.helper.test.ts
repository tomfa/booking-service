import { testRequest } from '../testUtils/controllers.utils';
import { getUploadURL } from './controller.helper';

describe('getUploadURL', () => {
  const prefix = 'templates';
  const controller = getUploadURL(prefix);

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
