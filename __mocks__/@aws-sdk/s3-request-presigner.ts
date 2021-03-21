const getSignedUrltMock = jest.fn().mockImplementation((s3, command) => {
  return Promise.resolve(
    `https://s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/${command.input.Key}?X-Amz-Algorithm=THISISJUSTFAKE`,
  );
});
export const lastGetSignedUrlArgs = (): Record<string, any> | undefined => {
  const callLength = getSignedUrltMock.mock.calls?.[0].length;
  const args = getSignedUrltMock.mock.calls?.[0]?.[callLength - 1] as
    | Record<string, any>
    | undefined;
  if (!args) {
    return undefined;
  }
  return args;
};
export const getSignedUrl = (s3, command, options) => {
  return getSignedUrltMock(s3, command, options);
};
