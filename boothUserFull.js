const { loginTestAccount } = require('./loginTestAccount');
const puppeteer = require('puppeteer');

const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 1000;

const options = {
    // headless: false, // 브라우저가 실제로 보이도록 설정
    args: [`--window-size=${VIEWPORT_WIDTH},${VIEWPORT_HEIGHT}`] // 브라우저 크기 설정
};

async function userFull() {
    // 로그인 수행 (6개의 브라우저를 띄우고, flag 1로 설정하여 마지막 계정은 특별 계정으로 로그인)
    const browsers = await loginTestAccount(6, 1);

    const pagePromises = [];

    for (let i = 0; i < browsers.length; i++) {
        const browser = browsers[i];
        const page = (await browser.pages())[0]; // 각 브라우저의 첫 번째 페이지를 가져옴

        const boothAccessPromise = (async () => {
            // 만인 표시 여부 확인
            if (i < 5) {
                // 부스 입장
                await page.waitForSelector('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info');
                await page.click('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info');
            }else {  // 마지막 계정의 경우
                try {
                    await new Promise((page) => setTimeout(page, 5000));
                    page.reload()
                    // 만인 표시 클릭
                    await new Promise((page) => setTimeout(page, 1000));
                    await page.click('div.mask.mask__full');
                    console.log('만인 표시 완료. 테스트 성공');
                } catch (error) {
                    console.log('만인 표사ㅣ 실패, 테스트 실패.');
                }
            }
        })();

        pagePromises.push(boothAccessPromise);
    }

    // 모든 부스 접속 작업을 기다림
    await Promise.all(pagePromises);
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기

}

module.exports = { userFull };
