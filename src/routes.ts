import * as Express from 'express';
import { generatePdfFromHtml } from './endpoints/generate/fromHtml';
import { generatePdfFromTemplate } from './endpoints/generate/fromTemplate';

const router = Express.Router();

router.get('/generate/from_html', generatePdfFromHtml);
router.get('/generate/from_template', generatePdfFromTemplate);

export default router;
