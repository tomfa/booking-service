import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { getData } from '../utils';
import { decodeBase64, isValidBase64 } from '../../utils/encoding';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { store } from '../../utils/files';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { getUser } from '../../utils/auth/utils';

export const generatePdfFromHtml = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { html: base64Html, ...variables } = getData(req);
  const user = getUser(req);
  if (!base64Html) {
    throw new BadRequestError({ field: 'html', error: 'query param missing' });
  }
  const filename = (variables.filename ||
    variables.title ||
    variables.name ||
    'File.pdf') as string;
  if (!isValidBase64(base64Html)) {
    throw new BadRequestError({
      field: 'html',
      error: 'query param is not base64 encoded',
    });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const htmlString = decodeBase64(String(base64Html));
  const htmlWithVariables = insertVariables(htmlString, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const { url } = await store({
    content: pdfContent,
    owner: user.username,
    filename,
  });
  if (req.method === 'GET') {
    return res.redirect(url);
  }
  return res.json({ url, message: 'OK' });
};
