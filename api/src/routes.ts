import { Router } from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { errorWrapper } from './utils/errorHandler';
import { ControllerFunction } from './types';
import { listTemplates } from './endpoints/template/listTemplates';
import { listFiles } from './endpoints/files/listFiles';
import { listFonts } from './endpoints/font/listFonts';
import { deleteFiles, getUploadURL } from './endpoints/controller.helper';

const router = Router();

const get = (url: string, fun: ControllerFunction) =>
  router.get(url, errorWrapper(fun));
const del = (url: string, fun: ControllerFunction) =>
  router.delete(url, errorWrapper(fun));

get('/template', listTemplates);
del('/template', deleteFiles(FOLDER.templates));
get('/template/upload_url', getUploadURL(FOLDER.templates));
get('/file', listFiles);
del('/file', deleteFiles(FOLDER.files));
get('/font', listFonts);
del('/font', deleteFiles(FOLDER.fonts));
get('/font/upload_url', getUploadURL(FOLDER.fonts));

export default router;
