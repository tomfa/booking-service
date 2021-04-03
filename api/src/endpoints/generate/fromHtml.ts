import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { getData, getFileNameFromVariables } from '../utils';
import { decodeUrlSafeBase64, isValidUrlSafeBase64 } from '../../utils/base64';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { store } from '../../storage/fileStorage';
import { BadRequestError } from '../../utils/errors/BadRequestError';
import { getUserOrThrow } from '../../utils/auth/request.utils';
import { generateFileId } from '../../utils/id';

export const generatePdfFromHtml = async (
  req: Express.Request,
  res: Express.Response
) => {
  const { html: base64Html, ...variables } = getData(req);
  const user = getUserOrThrow(req);
  if (!base64Html) {
    throw new BadRequestError({ field: 'html', error: 'query param missing' });
  }
  const filename = getFileNameFromVariables(variables);
  if (!isValidUrlSafeBase64(base64Html)) {
    throw new BadRequestError({
      field: 'html',
      error: 'query param is not base64 encoded',
    });
  }
  const cleanedVariables: Variables = cleanVariables(variables);

  const htmlString = decodeUrlSafeBase64(String(base64Html));
  const htmlWithVariables = insertVariables(htmlString, cleanedVariables);
  const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
  const id = generateFileId({
    userId: user.username,
    templateId: htmlString,
    variables: cleanedVariables,
  });
  const { url } = await store({
    id,
    content: pdfContent,
    owner: user.username,
    filename,
  });
  if (req.method === 'GET') {
    return res.redirect(url);
  }
  return res.json({ url, message: 'OK' });
};
