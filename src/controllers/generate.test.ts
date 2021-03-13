import { generatePdfFromHtml } from './generate';
import { encodeBase64 } from '../utils/encoding';
import { testRequest } from '../testUtils/controllers.utils';

describe('generatePdfFromHtml', () => {
  it('requires html parameter', async () => {
    const { status, message } = await testRequest(generatePdfFromHtml, {
      query: { html: '' },
    });

    expect(status).toBe(400);
    expect(message).toEqual('Query param "html" is missing');
  });
  it('requires html parameter to be base64', async () => {
    const { status, message } = await testRequest(generatePdfFromHtml, {
      query: { html: '<h1>This is not b64</h1>' },
    });

    expect(status).toBe(400);
    expect(message).toEqual('Query param "html" is not base64 encoded');
  });
  it.skip('returns a PDF file', async () => {
    const base64Html = encodeBase64('<h1>This is b64</h1>');
    const { status, message, json } = await testRequest(generatePdfFromHtml, {
      query: { html: base64Html },
    });

    expect(status).toBe(200);
    expect(message).toEqual('OK');
  });
});
