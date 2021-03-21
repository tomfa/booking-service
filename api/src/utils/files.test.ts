import { overrideNextS3GetObjectResponse } from '../../__mocks__/@aws-sdk/client-s3';
import { retrieveTemplate } from './files';
import { TemplateNotFound } from './errors/TemplateNotFound';

describe('retrieveTemplate', () => {
  test('retrieves template from S3', async () => {
    const content = '<h1>{{ name }}</h1>';
    overrideNextS3GetObjectResponse(content)

    const template = await retrieveTemplate('my-template')

    expect(template).toEqual(content);
  })
  test('throws error if no file found', async () => {
    try {
      await retrieveTemplate('non-existing')
      fail('Retrieving non-existing template should throw error')
    } catch (err) {
      expect(err).toBeInstanceOf(TemplateNotFound);
    }
  })
});
