const puppeteer = require("puppeteer");
const getDate = require('./lib/getDate');
const getUSDAmount = require("./lib/getUSDAmount");

require('dotenv').config({ path: __dirname + '/../.env' });


module.exports = (async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // set {headless: false} on browser launch method above
  // then use the console.log below to identify userAgent
  // console.log(await browser.userAgent());
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36');


  await page.goto('https://us.etrade.com/e/t/user/login', { waitUntil: "networkidle2" });

  // write in username and password
  await page.type('#user_orig', process.env.ETRADE_USERNAME, { delay: 30 });
  await page.type('input[type=password]', process.env.ETRADE_PASSWORD, { delay: 30 });

  // click the login button
  await page.click('#logon_button');

  // wait for navigation to finish
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // check if logged in
  try {
    await page.waitFor('#application > div > section.Application---topSection---1YNQ3 > div > div > div > div:nth-child(2) > div.col-sm-pull-4.col-print-12.col-print-pull-clear.col-sm-8.col-xs-12 > div > div.WelcomeBanner---dataCol---15P3a.vertical-offset-sm.col-md-5.col-sm-6.col-xs-12 > table > tbody > tr:nth-child(1) > td.text-right > span');
  } catch (error) {
    console.log('Failed to Login');
    process.exit(0);
  }

  // grab Net Assets Amount
  const netAssets = await page.$('#application > div > section.Application---topSection---1YNQ3 > div > div > div > div:nth-child(2) > div.col-sm-pull-4.col-print-12.col-print-pull-clear.col-sm-8.col-xs-12 > div > div.WelcomeBanner---dataCol---15P3a.vertical-offset-sm.col-md-5.col-sm-6.col-xs-12 > table > tbody > tr:nth-child(1) > td.text-right > span');
  const netAssetsAmt = await page.evaluate(el => el.textContent, netAssets);


  // grab Daily Gain Amount
  const dailyGain = await page.$('#application > div > section.Application---topSection---1YNQ3 > div > div > div > div:nth-child(2) > div.col-sm-pull-4.col-print-12.col-print-pull-clear.col-sm-8.col-xs-12 > div > div.WelcomeBanner---dataCol---15P3a.vertical-offset-sm.col-md-5.col-sm-6.col-xs-12 > table > tbody > tr:nth-child(2) > td.text-right > span');
  const dailyGainAmt = await page.evaluate(el => el.textContent, dailyGain);

  //create new data Object 
  const data = { assets: getUSDAmount(netAssetsAmt), gain: getUSDAmount(dailyGainAmt), gainIsPositive: !dailyGainAmt.includes("-") };

  await browser.close();

  return data;

});