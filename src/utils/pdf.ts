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

    await page.goto('https://db.no');
    return await page.pdf({path: './test.pdf', format: 'a4'});
  } finally {
    if (!!browser) {
      await browser.close();
    }
  }
};
