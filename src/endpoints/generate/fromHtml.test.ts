import { encodeBase64 } from '../../utils/encoding';
import { testRequest } from '../../testUtils/controllers.utils';
import config from '../../config';
import { generatePdfFromHtml } from './fromHtml';

describe('generatePdfFromHtml', () => {
  const bucketUrl = config.services.s3.endpointUrl;

  it('requires html parameter', async () => {
    const { status, errors } = await testRequest(generatePdfFromHtml, {
      query: { html: '' },
    });

    expect(status).toBe(400);
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('html: query param missing')
  });
  it('requires html parameter to be base64', async () => {
    const { status, errors } = await testRequest(generatePdfFromHtml, {
      query: { html: '<h1>This is not b64</h1>' },
    });

    expect(status).toBe(400);
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('html: value is not base 64 encoded')
  });
  it('redirects to url for generated pdf', async () => {
    const base64Html = encodeBase64('<h1>This is b64</h1>');
    const { status, headers } = await testRequest(generatePdfFromHtml, {
      query: { html: base64Html },
    });

    expect(status).toBe(302);
    expect(headers.location.endsWith('.pdf')).toBe(true);
    expect(headers.location.startsWith(bucketUrl)).toBe(true);
  });
});
