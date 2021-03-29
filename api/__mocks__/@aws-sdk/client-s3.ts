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

const createGetObjectMock = (content: string) =>
  jest.fn().mockReturnValue(
    Promise.resolve({
      Body: Buffer.from(content),
    })
  );

let nextGetResponse;
export const overrideNextS3GetObjectResponse = (content: string) => {
  nextGetResponse = createGetObjectMock(content);
};

const createListObjectMock = (files: unknown) =>
  jest.fn().mockReturnValue(
    Promise.resolve({
      Contents: files,
    })
  );

let nextListResponse;
export const overrideNextS3ListObjectResponse = (
  files: { Key: string; LastModified: Date; Etag: string }[]
) => {
  nextListResponse = createListObjectMock(files);
};

export const templates = {
  htmlTemplate: {
    name: 'cheese',
    key: 'templates/cheese',
    content: `<body><h1>{{ name }}</h1></body>`,
    mock: createGetObjectMock(`<body><h1>{{ name }}</h1></body>`),
  },
};

const deleteMock = jest
  .fn()
  .mockImplementation(
    ({ Delete }: { Bucket: string; Delete: { Objects: Array<{ Key }> } }) =>
      Promise.resolve({
        $metadata: {
          httpStatusCode: 200,
          requestId: undefined,
          extendedRequestId:
            'atFlggEKhoDPyvZ+Rt+DOHtT32rTTQeqc7vTdz4GTlaIJLmTfEODVyObIA/fWX20tbhP7E7rljk=',
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0,
        },
        Deleted: Delete.Objects?.map(({ Key }) => ({
          Key,
          VersionId: undefined,
          DeleteMarker: undefined,
          DeleteMarkerVersionId: undefined,
        })),
        Errors: undefined,
        RequestCharged: undefined,
      })
  );
const getMock = jest.fn().mockImplementation(() => Promise.resolve({}));
const putMock = jest.fn().mockImplementation(() => {
  return Promise.resolve({ ETag: 'Test-Etag' });
});
const listMock = createListObjectMock([]);

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
  .mockImplementation(
    (command: GetObjectCommand | PutObjectCommand | ListObjectsCommand) => {
      if (command instanceof GetObjectCommand) {
        getMock(command.input);
        if (nextGetResponse) {
          const response = nextGetResponse;
          nextGetResponse = null;
          return response();
        }
        const key = command.input.Key;
        const matchingTemplate = Object.values(templates).find(
          t => t.key === key
        );
        if (matchingTemplate) {
          return matchingTemplate.mock();
        }
        throw NoSuchKeyError();
      } else if (command instanceof PutObjectCommand) {
        return putMock(command.input);
      } else if (command instanceof DeleteObjectsCommand) {
        return deleteMock(command.input);
      } else if (command instanceof ListObjectsCommand) {
        if (nextListResponse) {
          listMock(command.input);
          const response = nextListResponse;
          nextListResponse = null;
          return response();
        }
        return listMock(command.input);
      } else {
        // eslint-disable-next-line no-console
        console.log(
          `Command not handled in aws-sdk mock`,
          JSON.stringify(command)
        );
      }
    }
  );

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

export class ListObjectsCommand {
  name = 'ListObjectsCommand';

  input: Record<string, any>;

  constructor(input: Record<string, any>) {
    this.input = input;
  }
}

export class DeleteObjectsCommand {
  name = 'DeleteObjectsCommand';

  input: Record<string, any>;

  constructor(input: Record<string, any>) {
    this.input = input;
  }
}

export class S3Client {
  send = sendFn;
}
