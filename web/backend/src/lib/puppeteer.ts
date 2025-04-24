import puppeteer, { type Browser } from 'puppeteer';

const minimalArgs = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-sandbox',
  '--disable-gpu',
  '--password-store=basic',
  '--use-mock-keychain',
];

let browser: Browser;

async function createBrowser() {
  return await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/google-chrome',
    args: minimalArgs,
  });
}

async function createSingleton() {
  if (!browser) {
    browser = await createBrowser();
  }
  return browser;
}

createSingleton();

export { browser };
