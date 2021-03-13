import { getMockReq, getMockRes } from '@jest-mock/express';
import { generatePdfFromHtml } from '../src/controllers/generate';

describe('generatePdfFromHtml', () => {
  it('implement tests here', () => {
    const req = getMockReq();
    const { res } = getMockRes();
    generatePdfFromHtml(req, res);
    const expectedResponse = expect.objectContaining({
      data: [{ name: 'User1' }],
      status: 'success',
    });
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});
