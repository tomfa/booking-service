import { Router } from 'express';
import { generatePdfFromHtml } from './endpoints/generate/fromHtml';
import { generatePdfFromTemplate } from './endpoints/generate/fromTemplate';
import { errorWrapper } from './utils/errorHandler';
import { ControllerFunction } from './types';
import { listTemplates } from './endpoints/template/listTemplates';


const router = Router();

const get = (url: string, fun: ControllerFunction) => router.get(url, errorWrapper(fun));
const post = (url: string, fun: ControllerFunction) => router.post(url, errorWrapper(fun));

get('/generate/from_html', generatePdfFromHtml);
post('/generate/from_html', generatePdfFromHtml);
get('/generate/from_template', generatePdfFromTemplate);
post('/generate/from_template', generatePdfFromTemplate);
get('/template', listTemplates);

export default router;
