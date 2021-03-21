/* eslint-disable max-classes-per-file */

export class AWSError extends Error {
  message: string;

  code: string;

  name: string;

  time: Date;

  constructor({ message, code, name, time }) {
    super(message);
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

const getMock = jest.fn().mockImplementation(() => Promise.resolve({}));
const putMock = jest.fn().mockImplementation(() => {
  return Promise.resolve({ ETag: 'Test-Etag' });
});

export const getLastPutActionArgs = (): Record<string, any> | undefined => {
  const callLength = putMock.mock.calls?.[0].length;
  const args = putMock.mock.calls?.[0]?.[callLength - 1] as
    | Record<string, any>
    | undefined;
  if (!args) {
    return undefined;
  }
  return args;
};

const sendFn = jest
  .fn()
  .mockImplementation((command: GetObjectCommand | PutObjectCommand) => {
    if (command instanceof GetObjectCommand) {
      getMock(command.input);
      if (nextGetResponse) {
        const response = nextGetResponse;
        nextGetResponse = null;
        return response();
      }
      const key = command.input.Key;
      const matchingTemplate = Object.values(templates).find(
        (t) => t.key === key,
      );
      if (matchingTemplate) {
        return matchingTemplate.mock();
      }
      throw NoSuchKeyError();
    } else if (command instanceof PutObjectCommand) {
      return putMock(command.input);
    }
  });

export class GetObjectCommand {
  name = 'GetObjectCommand';

  input: Record<string, any>;

  constructor(input: Record<string, any>) {
    this.input = input;
  }
}
export class PutObjectCommand {
  name = 'PutObjectCommand';

  input: Record<string, any>;

  constructor(input: Record<string, any>) {
    this.input = input;
  }
}

export class S3Client {
  send = sendFn;
}
