import puppeteer, { LaunchOptions } from 'puppeteer';

module.exports = async (options: LaunchOptions, url: string) => {

    const errorArr= [];

    const linkClassName = '.icArrSearch';
    
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "domcontentloaded"
    });

    let areaLink = await page.$$(linkClassName);

    await page.waitFor(1000);

    for(let j = 0; j < areaLink.length; j++) {

        await areaLink[j].click();

        await page.waitFor('.footer');

        if(await page.$('.l-error')) {
            errorArr.push(await page.url());
        }
    
        if(j !== areaLink.length -1) {
            await page.goto(url);
            areaLink = await page.$$(linkClassName);
        }
    }
    if(errorArr.length === 0) {
        console.log('No Error');
    } else {
        console.log(errorArr);
    }
};