import { Router } from 'express';
import { FOLDER } from '@pdf-generator/shared';
import { errorWrapper } from './utils/errorHandler';
import { ControllerFunction } from './types';
import {
  deleteFiles,
  getUploadURL,
  listFiles,
} from './endpoints/controller.helper';

const router = Router();

const get = (url: string, fun: ControllerFunction) =>
  router.get(url, errorWrapper(fun));
const del = (url: string, fun: ControllerFunction) =>
  router.delete(url, errorWrapper(fun));

get(`/${FOLDER.templates}`, listFiles(FOLDER.templates));
del(`/${FOLDER.templates}`, deleteFiles(FOLDER.templates));
get(`/${FOLDER.templates}/upload_url`, getUploadURL(FOLDER.templates));

get(`/${FOLDER.fonts}`, listFiles(FOLDER.fonts));
del(`/${FOLDER.fonts}`, deleteFiles(FOLDER.fonts));
get(`/${FOLDER.fonts}/upload_url`, getUploadURL(FOLDER.fonts));

get(`/${FOLDER.files}`, listFiles(FOLDER.files));
del(`/${FOLDER.files}`, deleteFiles(FOLDER.files));

export default router;
