import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { decodeBase64, isValidBase64 } from '../../utils/encoding';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { storeFile } from '../../utils/files';
import { BadRequestError } from '../../utils/errors/BadRequestError';

export const generatePdfFromHtml = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { html: base64Html, ...variables } = req.query;
  if (!base64Html) {
    throw new BadRequestError({ field: 'html', error: 'query param missing'})
  }
  if (!isValidBase64(base64Html)) {
    throw new BadRequestError({ field: 'html', error: 'query param is not base64 encoded'})
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const htmlString = decodeBase64(String(base64Html));
  const htmlWithVariables = insertVariables(htmlString, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const { url } = await storeFile(pdfContent);
  return res.redirect(url);
};
