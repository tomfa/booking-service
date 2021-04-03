import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { retrieveTemplate, store } from '../../storage/fileStorage';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { getData, getFileNameFromVariables } from '../utils';
import { getUserOrThrow } from '../../utils/auth/request.utils';
import { generateFileId } from '../../utils/id';

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { template, _id, ...variables } = getData(req);
  const user = getUserOrThrow(req);
  if (!template) {
    throw new BadRequestError({
      field: 'template',
      error: 'query param is missing',
    });
  }
  if (!_id) {
    throw new BadRequestError({
      field: '_id',
      error: 'query param is missing',
    });
  }

  const cleanedVariables: Variables = cleanVariables(variables);

  const html = await retrieveTemplate({
    templateName: String(template),
    id: String(_id),
    owner: user.username,
  });
  const htmlWithVariables = insertVariables(html, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const filename = getFileNameFromVariables(variables);
  const id = generateFileId({
    userId: user.username,
    templateId: String(_id),
    variables: cleanedVariables,
  });
  const { url } = await store({
    id,
    content: pdfContent,
    owner: getUserOrThrow(req).username,
    filename,
  });
  if (req.method === 'GET') {
    return res.redirect(url);
  }
  return res.json({ url, message: 'OK' });
};
