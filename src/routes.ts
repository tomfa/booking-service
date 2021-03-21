import { Router } from 'express';
import { generatePdfFromHtml } from './endpoints/generate/fromHtml';
import { generatePdfFromTemplate } from './endpoints/generate/fromTemplate';
import { errorWrapper } from './utils/errorHandler';
import { ControllerFunction } from './types';


const router = Router();

const get = (url: string, fun: ControllerFunction) => router.get(url, errorWrapper(fun));

get('/generate/from_html', generatePdfFromHtml);
get('/generate/from_template', generatePdfFromTemplate);

export default router;
