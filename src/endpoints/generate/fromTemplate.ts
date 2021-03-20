import * as Express from 'express';
import { convertHTMLtoPDF } from '../../utils/pdf';
import { cleanVariables, insertVariables } from '../../utils/variables';
import { Variables } from '../../types';
import { retrieveTemplate, storeFile } from '../../utils/files';
import { APIError } from '../../utils/errors/APIError';

export const generatePdfFromTemplate = async (
  req: Express.Request,
  res: Express.Response,
) => {
  try {
    const { template, ...variables } = req.query;
    if (!template) {
      return res
        .status(400)
        .json({ message: `Query param 'template' is missing` });
    }
    const cleanedVariables: Variables = cleanVariables(variables);

    const html = await retrieveTemplate(String(template));
    const htmlWithVariables = insertVariables(html, cleanedVariables);
    const pdfContent = await convertHTMLtoPDF(htmlWithVariables);
    const { url } = await storeFile(pdfContent);
    return res.redirect(url);
  } catch (err) {
    // TODO: Move generic error handling outside of this function
    if (err instanceof APIError) {
      return res
        .status(err.httpCode)
        .json({ error: err.displayMessage, message: err.displayMessage });
    }
    // TODO: Hide error message outside dev and test
    return res.status(500).json({ error: err.message, message: err.message });
  }
};
