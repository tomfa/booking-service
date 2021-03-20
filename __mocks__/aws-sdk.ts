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
    throw new Error('TODO: Implement 404 response');
  });

export class S3 {
  getObject = getFn;
}
