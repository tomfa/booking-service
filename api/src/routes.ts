import { Router } from 'express';
import { errorWrapper } from './utils/errorHandler';
import { ControllerFunction } from './types';
import { listTemplates } from './endpoints/template/listTemplates';
import { listFiles } from './endpoints/files/listFiles';
import { listFonts } from './endpoints/font/listFonts';
import { getUploadURL } from './endpoints/controller.helper';

const router = Router();

const get = (url: string, fun: ControllerFunction) =>
  router.get(url, errorWrapper(fun));

get('/template', listTemplates);
get('/template/upload_url', getUploadURL('template'));
get('/file', listFiles);
get('/font', listFonts);
get('/font/upload_url', getUploadURL('font'));

export default router;
