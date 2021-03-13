import {Browser} from "puppeteer-core";

const chromium = require('chrome-aws-lambda');

export const convertHTMLtoPDF = async (html: string): Promise<Buffer> => {
  let browser: Browser;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.setContent(html);
    return await page.pdf({format: 'a4'});
  } finally {
    if (!!browser) {
      await browser.close();
    }
  }
};

