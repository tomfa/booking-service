import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { retrieveTemplate, store } from '../../utils/files';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { getData } from '../utils';
import { getUser } from '../../utils/auth/utils';

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { template, ...variables } = getData(req);
  if (!template) {
    throw new BadRequestError({
      field: 'template',
      error: 'query param is missing',
    });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const html = await retrieveTemplate(String(template));
  const htmlWithVariables = insertVariables(html, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const filename = (variables.filename ||
    variables.title ||
    variables.name ||
    'File.pdf') as string;
  const { url } = await store({
    content: pdfContent,
    owner: getUser(req).username,
    filename,
  });
  if (req.method === 'GET') {
    return res.redirect(url);
  }
  return res.json({ url, message: 'OK' });
};
