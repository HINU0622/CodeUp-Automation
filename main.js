const WebDriver = require('selenium-webdriver');
const { By, until, Key } = require('selenium-webdriver');
const Config = require('./config.json');
const answer = require('./answer.json');
const URL = 'https://codeup.kr/submitpage.php?id=';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var crawling = async function() {
    let driver = new WebDriver.Builder().forBrowser('chrome').build();

    await driver.get('https://codeup.kr/');
    await driver.findElement(By.xpath('//*[@id="navbarNavDropdown"]/ul[2]/li[2]/a')).click();
    await driver.wait(until.elementLocated({name:'user_id'})).sendKeys(Config.id);
    await driver.findElement(By.name('password')).sendKeys(Config.password);
    await driver.findElement(By.name('submit')).click();

    // for(let i = 6001; i <= 6031; i++) { // 6001부터
        
    // }

    for(let problem = 6087; problem <= 6098; problem++) {
        console.log(`PROBLEM ${problem}...`);
        let tab = 0;
        await driver.get(URL + problem + '&rid=');
        await driver.findElement(By.id('language')).click();
        await driver.findElement(By.xpath('//*[@id="language"]/option[4]')).click();
        let result = answer[problem].split('');
        for(let i = 0; i < result.length; i++) {
            await driver.findElement(By.xpath('//*[@id="source"]/textarea')).sendKeys(result[i]);
            if(result[i+1] == '\n') await driver.findElement(By.xpath('//*[@id="source"]/textarea')).sendKeys(Key.ESCAPE);
            if(result[i] == ':' && result[i+1] == '\n') tab++;
            else if(result[i] == '\n') {
                if('' + result[i-5] + result[i-4] + result[i-3] + result[i-2] + result[i-1] == 'break' || '' + result[i-5] + result[i-4] + result[i-3] + result[i-2] + result[i-1] == 'tinue') tab--;
                for(var j = 0; j < tab; tab--) {
                    await driver.findElement(By.xpath('//*[@id="source"]/textarea')).sendKeys(Key.BACK_SPACE);
                }
                for(var j = i+1; result[j] == '\t'; tab++, i++, j++) {
                    await driver.findElement(By.xpath('//*[@id="source"]/textarea')).sendKeys(Key.TAB);
                }
            }
        }
        await sleep(100);
        await driver.findElement(By.id('Submit')).click();
        await driver.wait(until.elementLocated(By.xpath('//*[@id="result-tab"]/tbody/tr[1]/td[4]/a')));
        console.log("OK!");
        await sleep(8500);
    }
}

crawling();