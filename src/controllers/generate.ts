import * as Express from 'express';

export const generatePdfFromHtml = (req: Express.Request, res: Express.Response) => {
  res.json({
    status: 'success',
    data: [
      {
        name: 'User1',
      },
    ],
  });
}
