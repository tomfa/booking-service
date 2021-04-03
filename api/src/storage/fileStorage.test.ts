import { overrideNextS3GetObjectResponse } from '../../__mocks__/@aws-sdk/client-s3';
import { TemplateNotFound } from '../utils/errors/TemplateNotFound';
import { retrieveTemplate } from './fileStorage';

describe('retrieveTemplate', () => {
  test('retrieves template from S3', async () => {
    const content = '<h1>{{ name }}</h1>';
    overrideNextS3GetObjectResponse(content);

    const template = await retrieveTemplate({
      templateName: 'my-template',
      owner: '',
      id: '',
    });

    expect(template).toEqual(content);
  });
  test('throws error if no file found', async () => {
    try {
      await retrieveTemplate({
        templateName: 'non-existing',
        owner: '',
        id: '',
      });
      fail('Retrieving non-existing template should throw error');
    } catch (err) {
      expect(err).toBeInstanceOf(TemplateNotFound);
    }
  });
});
