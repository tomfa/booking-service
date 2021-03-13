import * as Express from 'express';

const router = Express.Router();

router.get('/generate/from_html', (request, res) => {
  res.json({
    status: 'success',
    data: [
      {
        name: 'User1',
      },
    ],
  });
});

export default router;
