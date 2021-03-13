import * as Express from 'express';
import { generatePdfFromHtml } from './controllers/generate';

const router = Express.Router();

router.get('/generate/from_html', generatePdfFromHtml);

export default router;
