import { LaunchOptions } from "puppeteer";

const createURL = require('./bin/inaka-url');
const testURL = require('./bin/test-url');
const mode = process.env.MODE_TYPE;

const options: LaunchOptions = {
    slowMo: 100  // 動作を遅く(ページの読み込みが遅いことを考慮して常時必要)
};

switch(mode) {
    case 'dev' : 
        options['headless'] = false; 
        createURL(options);
    break;

    case 'test_dev0' : 
        options['headless'] = false;
        testURL(options, 'https://wwwtst.k0.inaka.suumo.jp/edit/sub/inaka/chintai/index.html')
    break;

    case 'test_dev1' :
        options['headless'] = false;
        testURL(options, 'https://wwwtst.inaka.suumo.jp/edit/sub/inaka/chintai/index.html')
    break;

    case 'test_production' : 
        options['headless'] = false;
        testURL(options, 'https://inaka.suumo.jp/edit/sub/inaka/chintai/index.html')
    break;

    case 'production' :
        createURL(options);
    break;
}
