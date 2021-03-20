import { AWSError as OriginalAWSError } from 'aws-sdk/lib/error';
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

const getFn = jest
  .fn()
  .mockImplementation((x: { Bucket: string; Key: string }) => {
    if (nextGetResponse) {
      const response = { promise: nextGetResponse };
      nextGetResponse = null;
      return response;
    }
    throw NoSuchKeyError();
  });

export class S3 {
  getObject = getFn;
}
