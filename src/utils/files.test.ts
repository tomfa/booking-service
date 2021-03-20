import { retrieveTemplate } from './files';
import { overrideNextS3GetObjectResponse } from '../../__mocks__/aws-sdk';

describe('retrieveTemplate', () => {
  test('retrieves template from S3', async () => {
    const content = '<h1>{{ name }}</h1>';
    overrideNextS3GetObjectResponse(content)

    const template = await retrieveTemplate('my-template')

    expect(template).toEqual(content);
  })

});
