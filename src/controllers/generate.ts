import * as Express from 'express';
import { isValidBase64 } from '../utils/encoding';

export const generatePdfFromHtml = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { html, filename = 'file.pdf', ...variables } = req.query;
  if (!html) {
    return res.status(400).json({ message: 'Query param "html" is missing' });
  }
  if (!isValidBase64(html)) {
    return res
      .status(400)
      .json({ message: 'Query param "html" is not base64 encoded' });
  }

  return res.json({
    status: 'success',
    message: 'OK',
    data: [
      {
        name: 'User1',
      },
    ],
  });
};
