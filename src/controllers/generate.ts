import * as Express from 'express';
import { convertHTMLtoPDF } from '../utils/pdf';
import { decodeBase64, isValidBase64 } from '../utils/encoding';
import { cleanVariables, insertVariables } from '../utils/variables';
import { Variables } from '../types';
import { retrieveTemplate, storeFile } from '../utils/files';

export const generatePdfFromHtml = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { html: base64Html, ...variables } = req.query;
  if (!base64Html) {
    return res.status(400).json({ message: 'Query param "html" is missing' });
  }
  if (!isValidBase64(base64Html)) {
    return res
      .status(400)
      .json({ message: 'Query param "html" is not base64 encoded' });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const htmlString = decodeBase64(String(base64Html));
  const { url } = await generatePdf(htmlString, cleanedVariables);
  return res.redirect(url);
};

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response,
) => {
  const { template, ...variables } = req.query;
  if (!template) {
    return res.status(400).json({ message: 'Query param "template" is missing' });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const htmlString = await retrieveTemplate(String(template) + '.html')
  const { url } = await generatePdf(htmlString, cleanedVariables);
  return res.redirect(url);
};

const generatePdf = async (html: string, variables: Variables) => {
  const htmlWithVariables = insertVariables(html, variables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  return await storeFile(pdfContent);
};
