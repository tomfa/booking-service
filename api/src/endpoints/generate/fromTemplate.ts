import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { retrieveTemplate, storeFile } from '../../utils/files';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { getData } from '../utils';

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { template, ...variables } = getData(req);
  if (!template) {
    throw new BadRequestError({ field: 'template', error: 'query param is missing' });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const html = await retrieveTemplate(String(template));
  const htmlWithVariables = insertVariables(html, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const { url } = await storeFile(pdfContent);
  if (req.method === 'GET') {
    return res.redirect(url);
  }
  return res.json({ url, message: 'OK' });
};
