import { Browser, Page } from 'puppeteer-core';

const chromium = require('chrome-aws-lambda');

async function generatePdf(
  loadData: (page: Page) => Promise<void>
): Promise<Buffer> {
  let browser: Browser;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await loadData(page);
    return await page.pdf({ format: 'a4' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export const convertHTMLtoPDF = async (html: string): Promise<Buffer> => {
  return generatePdf(page => page.setContent(html));
};

export const convertURLtoPDF = async (url: string): Promise<Buffer> => {
  return generatePdf(async page => {
    await page.goto(url);
  });
};
