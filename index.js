const puppeteer = require('puppeteer');
const fs = require('fs');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const logs = ["timestamp;droppedFrames;bufferLevel;frameRate;bitrate;resolution"];

  const config = {
    headless: false,
    defaultViewport: null,
    executablePath:
      '/usr/bin/google-chrome',
  };

  const browser = await puppeteer.launch(config);

  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log(msg.text());
    logs.push(msg.text());
  });

  await page.goto(`file://${__dirname}/index.html`);

  const videoDuration = 600 * 1000; // 10 minutes (600 sec)

  await page.click('video');

  await wait(videoDuration);

  await browser.close();

  const time = new Date().getTime();

  fs.writeFileSync(`logs-${time}.txt`, logs.join('\n'));
})();
