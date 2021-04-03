import { encodeUrlSafeBase64 } from '../../utils/base64';
import { testRequest } from '../../testUtils/controllers.utils';
import config from '../../config';
import { generatePdfFromHtml } from './fromHtml';

describe('generatePdfFromHtml', () => {
  const bucketUrl = config.services.s3.endpointUrl;

  describe('GET request', () => {
    it('requires html parameter', async () => {
      const { status, errors } = await testRequest(generatePdfFromHtml, {
        query: { html: '' },
      });

      expect(status).toBe(400);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('html: query param missing');
    });
    it('requires html parameter to be base64', async () => {
      const { status, errors } = await testRequest(generatePdfFromHtml, {
        query: { html: '<h1>This is not b64</h1>' },
      });

      expect(status).toBe(400);
      expect(errors.length).toBe(1);
      expect(errors[0]).toBe('html: query param is not base64 encoded');
    });
    it('redirects to url for generated pdf', async () => {
      const base64Html = encodeUrlSafeBase64('<h1>This is b64</h1>');
      const { status, headers } = await testRequest(generatePdfFromHtml, {
        query: { html: base64Html },
      });

      expect(status).toBe(302);
      expect(headers.location.endsWith('.pdf')).toBe(true);
      expect(headers.location.startsWith(bucketUrl)).toBe(true);
    });
  });
  describe('POST request', () => {
    it('returns JSON containing PDF url', async () => {
      const base64Html = encodeUrlSafeBase64('<h1>This is b64</h1>');
      const { status, json, message } = await testRequest(generatePdfFromHtml, {
        method: 'POST',
        body: { html: base64Html },
      });

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.url.endsWith('.pdf')).toBe(true);
      expect(json.url.startsWith(bucketUrl)).toBe(true);
    });
  });
});
