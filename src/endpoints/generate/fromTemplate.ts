import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { retrieveTemplate, storeFile } from '../../utils/files';
import { BadRequestError } from '../../utils/errors/BadRequestError';

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { template, ...variables } = req.query;
  if (!template) {
    throw new BadRequestError({ field: 'template', error: 'query param is missing' });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const html = await retrieveTemplate(String(template));
  const htmlWithVariables = insertVariables(html, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const { url } = await storeFile(pdfContent);
  return res.redirect(url);
};
