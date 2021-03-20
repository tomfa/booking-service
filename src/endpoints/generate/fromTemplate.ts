import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { retrieveTemplate, storeFile } from '../../utils/files';

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { template, ...variables } = req.query;
  if (!template) {
    return res
      .status(400)
      .json({ message: 'Query param "template" is missing' });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const html = await retrieveTemplate(String(template));
  const htmlWithVariables = insertVariables(html, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const { url } = await storeFile(pdfContent);
  return res.redirect(url);
};
