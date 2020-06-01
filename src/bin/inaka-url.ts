import fs from 'fs';
import path from 'path';
import puppeteer, { LaunchOptions } from 'puppeteer';
const targetPath = path.resolve('./target.json');

import { URLObject } from '../types/util'

module.exports = async (options: LaunchOptions) => {
    const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    let url : URLObject = {};
    
    const browser = await puppeteer.launch(options);
    
    for(let i of Object.keys(data)){

        const page = await browser.newPage();
        const baseURL = `https://suumo.jp/chintai/${i}/`
        await page.goto(baseURL, {
            waitUntil: "domcontentloaded"
        });

        let areaBtn = await page.$$('a[href*="city"]');

        await page.waitFor(1000);

        for(let j = 0; j < areaBtn.length; j++) {
            await areaBtn[j].click();

            await page.waitFor('.searchtable input[type="checkbox"]');
            await page.$$eval('.searchtable input[type="checkbox"]', (checks: HTMLInputElement[]) => checks.forEach((c: HTMLInputElement)=> c.checked = true));

            const title = await page.$eval('.ui-section-title', (item: HTMLHeadingElement) => {
                let text = item.textContent!;
                if(text) {
                    text = text.match(/.+(?=のエリアから賃貸情報探し)/)![0]
                }
                return text;
            });

            await page.click('.ui-btn.ui-btn--search.btn--large.js-shikugunSearchBtn');

            await page.waitFor(1000);

            url[title] = page.url();

            if(j !== areaBtn.length -1) {
                await page.goto(baseURL);
                areaBtn = await page.$$('a[href*="city"]');
            }
        }
    }
    for(let k of Object.keys(url)) {
        url[k] = url[k].replace(/https\:/, '');
        url[k] = url[k].replace(/cb=0.0&ct=9999999&et=9999999&cn=9999999&mb=0&mt=9999999&shkr1=03&shkr2=03&shkr3=03&shkr4=03&fw2=/,
            'cb=0.0&ct=9999999&mb=0&mt=9999999&et=9999999&cn=9999999&shkr1=03&shkr2=03&shkr3=03&shkr4=03&sngz=&po1=11&po2=01')

    }
    fs.writeFileSync('output.json', JSON.stringify(url, undefined, "\t"));
    await browser.close();
};