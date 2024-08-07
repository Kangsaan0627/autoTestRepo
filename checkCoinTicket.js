const puppeteer = require('puppeteer');
const { loginTestAccount } = require('./loginTestAccount');

const VIEWPORT_WIDTH = 1280; // 뷰포트의 너비
const VIEWPORT_HEIGHT = 1000; // 뷰포트의 높이

async function needCoinTicket(num) {
    // 로그인 함수 호출하여 브라우저 배열을 반환받음
    const browsers = await loginTestAccount(num, 1);

    // 브라우저 배열을 순회하며 각 브라우저에서 부스 접속 및 코인/티켓 확인 수행
    for (let i = 0; i < browsers.length; i++) {
        const browser = browsers[i];
        const pages = await browser.pages();
        const page = pages[0];

        // 부스 입장
        await page.waitForSelector('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info');
        await page.click('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info');

        // 플레이에 필요한 코인/티켓 수 확인
        await new Promise((page) => setTimeout(page, 2000));
        const playCoin = await page.$eval('#play-cp', el => parseInt(el.innerText.replace(',', '')));
        const playTicket = await page.$eval('#play-ticket', el => parseInt(el.innerText.replace(',', '')));
        console.log(`플레이 시 필요한 코인: ${playCoin}, 티켓: ${playTicket}`);

        // 소유한 코인/티켓 수 확인
        const myCoin = await page.$eval('#owner-cp', el => parseInt(el.innerText.replace(',', '')));
        const myTicket = await page.$eval('#owner-ticket', el => parseInt(el.innerText.replace(',', '')));
        console.log(`소유한 코인: ${myCoin}, 티켓: ${myTicket}`);

        // 플레이 가능 여부 확인 후 예약
        if (myCoin >= playCoin || myTicket >= playTicket) {
            console.log(`플레이 가능 - 브라우저 인덱스: ${i}`);
            await page.click('#reservation-button');
            console.log(`예약 완료 - 브라우저 인덱스: ${i}`);
        } else {
            console.log(`플레이 불가능 - 브라우저 인덱스: ${i} - 코인/티켓 수 부족`);
            await page.click('#reservation-button > span'); 
            const cpChargeInfo = await page.$('#modal-reservation-charge-confirm > div.cm__modal--content');
            if (cpChargeInfo) {
                console.log("CP 충전 안내 화면 발생. 테스트 성공");
            } else {
                console.log("테스트 실패입니다.");
            }
            break; // 충전 안내 화면 확인 후 루프 종료
        }
    }

}

module.exports = { needCoinTicket };
