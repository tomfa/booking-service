import * as Express from 'express';
import {
  generatePdfFromHtml,
  generatePdfFromTemplate,
} from './controllers/generate';

const router = Express.Router();

router.get('/generate/from_html', generatePdfFromHtml);
router.get('/generate/from_template', generatePdfFromTemplate);

export default router;
