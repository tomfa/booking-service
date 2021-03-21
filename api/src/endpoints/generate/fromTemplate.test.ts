import { testRequest } from '../../testUtils/controllers.utils';
import {
  getLastPutActionArgs,
  templates,
} from '../../../__mocks__/@aws-sdk/client-s3';
import config from '../../config';
import { generatePdfFromTemplate } from './fromTemplate';

describe('generatePdfFromTemplate', () => {
  const bucketUrl = config.services.s3.endpointUrl;

  describe('GET request', () => {
    it('returns 400 if template is not specified', async () => {
      const { status, message, errors } = await testRequest(
        generatePdfFromTemplate,
      );

      expect(status).toBe(400);
      expect(message).toBe('Seems you passed on something wrong.');
      expect(errors.length).toBe(1);
      expect(errors[0]).toContain('query param is missing');
    });
    it('returns 404 if template is not found', async () => {
      const { status, message } = await testRequest(generatePdfFromTemplate, {
        query: { template: 'non-existing' },
      });

      expect(status).toBe(404);
      expect(message).toBe('Specified template was not found');
    });
    it('returns 302 redirect to new PDF if successful', async () => {
      const { status, headers } = await testRequest(generatePdfFromTemplate, {
        query: { template: templates.htmlTemplate.name },
      });

      expect(status).toBe(302);
      const { location } = headers;
      expect(location).toContain(`${bucketUrl}/files/`);
    });
    it('stores generated pdf file as public in files folder', async () => {
      await testRequest(generatePdfFromTemplate, {
        query: { template: templates.htmlTemplate.name },
      });

      const { ACL, Key } = getLastPutActionArgs();
      expect(ACL).toBe('public-read');
      expect(Key.startsWith('files/')).toBe(true);
      expect(Key.endsWith('.pdf')).toBe(true);
    });
  });
  describe('POST request', () => {
    it('returns JSON containing PDF url', async () => {
      const { status, message, json } = await testRequest(generatePdfFromTemplate, {
        method: 'POST',
        body: { template: templates.htmlTemplate.name },
      });

      expect(status).toBe(200);
      expect(message).toBe('OK');
      expect(json.url.endsWith('.pdf')).toBe(true);
      expect(json.url.startsWith(bucketUrl)).toBe(true);
    });
  });
});
