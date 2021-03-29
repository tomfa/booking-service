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

get(`/${FOLDER.templates}`, listTemplates);
del(`/${FOLDER.templates}`, deleteFiles(FOLDER.templates));
get(`/${FOLDER.templates}/upload_url`, getUploadURL(FOLDER.templates));

get(`/${FOLDER.fonts}`, listFonts);
del(`/${FOLDER.fonts}`, deleteFiles(FOLDER.fonts));
get(`/${FOLDER.fonts}/upload_url`, getUploadURL(FOLDER.fonts));

get(`/${FOLDER.files}`, listFiles);
del(`/${FOLDER.files}`, deleteFiles(FOLDER.files));

export default router;
