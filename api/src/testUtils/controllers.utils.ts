import { MockRequest } from '@jest-mock/express/dist/src/request';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { errorMiddleware } from '../utils/errorHandler';

type APIResponse = {
  status: number;
  json?: Record<string, any>;
  message?: string;
  headers: Record<string, any>;
  errors?: string[];
};
export const testRequest = async (
  controller: (req: Express.Request, res: Express.Request) => unknown,
  { method = 'GET', ...options }: MockRequest = {}
): Promise<APIResponse> => {
  const req = getMockReq({ method, ...options });
  const { res } = getMockRes();
  try {
    await controller(req, res);
  } catch (err) {
    // Consider setting up app completely instead of this hack
    errorMiddleware(err, req, res, () => {});
  }

  // @ts-ignore
  const redirectUrl = res.redirect.mock.calls?.[0]?.[0];
  if (redirectUrl) {
    return { status: 302, headers: { location: redirectUrl }, message: null };
  }
  // @ts-ignore
  const status = res.status.mock.calls?.[0]?.[0] || 200;
  // @ts-ignore
  const json = res.json.mock.calls?.[0]?.[0];
  const message = json?.message;
  const errors = json?.errors;
  const headers = res.getHeaders();

  return { status, json, message, errors, headers };
};
