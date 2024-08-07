const puppeteer = require('puppeteer');
const { loginTestAccount } = require('./loginTestAccount');
const chromeOptions = {
    headless: false,  // 브라우저 UI를 표시하기 위해 false로 설정합니다.
};

async function checkBoothUserNum(num) {
    const browsers = await loginTestAccount(4, 0);
    const pagePromises = [];

    for (let i = 0; i < browsers.length; i++) {
        const browser = browsers[i];
        const page = (await browser.pages())[0]; // 각 브라우저의 첫 번째 페이지를 가져옴

        // 부스 입장
        await page.waitForSelector('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info');
        const booth_num = await page.$eval('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info > span.pitem__booth',el => el.textContent);
        await page.click('body > section > div > ul > li:nth-child(4) > a > div > div.pitem__info');
        await new Promise((page) => setTimeout(page, 5000));

        const currentBoothNum = await page.$eval('body > section.player > div > div > div.player__gridlayout--header.cm__header > div > div.player__header--right > div > span', el => el.textContent);
        if (booth_num === currentBoothNum) {
            console.log(`부스 번호 ${booth_num} 일치, 테스트 통과`);
        } else {
            console.log('부스 번호 불일치, 테스트 실패');
        }

        const boothPeopleNum = await page.$eval('#viewing-people', el => el.textContent);
        if (parseInt(boothPeopleNum) === i + 1) {
            console.log(`현재 부스 인원: ${i + 1}, 테스트 통과`);
        } else {
            console.log('부스 인원이 일치하지 않음, 테스트 실패');
        }
    }

    for (let i = 0; i < browsers.length-1; i++) {
        const browser = browsers[i];
        const page = (await browser.pages())[0]; // 각 브라우저의 첫 번째 페이지를 가져옴

        await page.click('#reservation-button');

        if (i == 0) {
            await new Promise((page) => setTimeout(page, 1000));
            await page.click('#modal-reserve-yourturn > div.cm__modal--button > a'); // 플레이 가능 안내창 닫기 버튼

            const boothReserveNum = await page.$eval('#reserve-people', el => el.textContent);
            if (boothReserveNum === '0') {
                console.log('1번째 접속자 테스트 성공');
            } else {
                console.log('1번째 접속자 테스트 실패');
                console.log(boothReserveNum);
            }
            await new Promise((page) => setTimeout(page, 1000));

            const observerPage = page[0];
            const observerReserveNum = await page.$eval('#reserve-people', el => el.textContent);
            if (observerReserveNum === '0') {
                console.log('관전자 시점 예약 인원 테스트 성공');
            } else {
                console.log('관전자 시점 예약 인원 테스트 실패');
            }
        } else {
            await new Promise((page) => setTimeout(page, 1000));
            await page.click('#modal-reserve-reserving > div.cm__modal--button > a');

            const boothReserveNum = await page.$eval('#reserve-people', el => el.textContent);
            if (boothReserveNum === `${i} / ${i}`) {
                console.log(`${i + 1}번째 접속자 테스트 성공`);
            } else {
                console.log(`${i + 1}번째 접속자 테스트 실패`);
                console.log(boothReserveNum, `${i} / ${i}`);
            }
            await new Promise((page) => setTimeout(page, 1000));

            const observerPage = page[0];
            const observerReserveNum = await observerPage.$eval('#reserve-people', el => el.textContent);
            if (observerReserveNum === `${i}`) {
                console.log('관전자 시점 예약 인원 테스트 성공');
            } else {
                console.log('관전자 시점 예약 인원 테스트 실패');
            }
        }
    }
    // 모든 부스 접속 작업을 기다림
    await Promise.all(pagePromises);
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기
}

module.exports = { checkBoothUserNum };
