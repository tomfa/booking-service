import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { decodeBase64, isValidBase64 } from '../../utils/encoding';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { JSONObject, Variables } from '../../types';
import { storeFile } from '../../utils/files';
import { BadRequestError } from '../../utils/errors/BadRequestError';

const getData = (req: Express.Request) => {
  if (req.method === 'GET') {
    return req.query as Record<string, string | string[]>
  }
  return (req.body || {}) as JSONObject;
}

export const generatePdfFromHtml = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { html: base64Html, ...variables } = getData(req);
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
  if (req.method === 'GET') {
    return res.redirect(url);
  }
  return res.json({ url, message: 'OK' })
};
