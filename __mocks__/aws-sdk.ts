import { AWSError as OriginalAWSError } from 'aws-sdk/lib/error';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

export class AWSError implements OriginalAWSError {
  message: string;
  code: string;
  name: string;
  time: Date;

  constructor({ message, code, name, time }) {
    this.message = message;
    this.code = code;
    this.name = name;
    this.time = time;
  }
}

const NoSuchKeyError = () =>
  new AWSError({
    name: 'No Such Key',
    code: 'NoSuchKey',
    message: 'The specified key does not exist.',
    time: new Date(),
  });

const createMock = (content: string) =>
  jest.fn().mockReturnValue(
    Promise.resolve({
      Body: Buffer.from(content),
    }),
  );

let nextGetResponse;
export const overrideNextS3GetObjectResponse = (content: string) => {
  nextGetResponse = createMock(content);
};

export const templates = {
  htmlTemplate: {
    name: 'cheese',
    key: 'templates/cheese',
    content: `<body><h1>{{ name }}</h1></body>`,
    mock: createMock(`<body><h1>{{ name }}</h1></body>`),
  },
};

const putFn = jest
  .fn()
  .mockImplementation(() => ({ promise: () => Promise.resolve(undefined) }));

export const getLastS3PutObjectArgs = (): PutObjectRequest => {
  const args = putFn.mock.calls?.[0]?.[0];
  return args
}

const getFn = jest
  .fn()
  .mockImplementation((x: { Bucket: string; Key: string }) => {
    if (nextGetResponse) {
      const response = { promise: nextGetResponse };
      nextGetResponse = null;
      return response;
    }
    const matchingTemplate = Object.values(templates).find(
      (t) => t.key === x.Key,
    );
    if (matchingTemplate) {
      return { promise: matchingTemplate.mock };
    }
    throw NoSuchKeyError();
  });

export class S3 {
  getObject = getFn;
  putObject = putFn;
}
