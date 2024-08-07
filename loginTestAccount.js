const puppeteer = require('puppeteer');
const { accountStag } = require('./TestAccount'); // 테스트 계정 목록

const VIEWPORT_WIDTH = 1280; // 뷰포트의 너비
const VIEWPORT_HEIGHT = 1000; // 뷰포트의 높이

const options = {
  headless: false, // 브라우저가 실제로 보이도록 설정
};

async function loginTestAccount(num, flag) {
  const availableNumbers = Array.from({ length: accountStag.length }, (_, i) => i);
  const usedNumbers = new Set();
  const browsers = []; // 브라우저 인스턴스를 저장할 배열
  const pagePromises = []; // 페이지 객체를 저장할 배열

  let specialAccountUsed = false;

  for (let i = 0; i < num; i++) {
    const browser = await puppeteer.launch(options);
    browsers.push(browser);

    // 기본 빈 페이지 닫기
    const pages = await browser.pages();
    for (const page of pages) {
      if (page.url() === 'about:blank') {
        await page.close();
      }
    }

    const page = await browser.newPage();
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

    let selectedNumber;

    if (flag === 1 && i === num - 1) {
      // 마지막 브라우저에만 0인 계정을 로그인
      selectedNumber = 5;
      specialAccountUsed = true;
    } else {
      // 나머지 경우
      const filteredNumbers = availableNumbers.filter(n => !usedNumbers.has(n) && n !== 5);
      selectedNumber = filteredNumbers[Math.floor(Math.random() * filteredNumbers.length)];
      usedNumbers.add(selectedNumber);
    }

    // 페이지 로그인 처리
    const loginPromise = (async () => {
      await page.goto('https://stag.namco-ocg.com/login');
      await page.type('[name="user_id"]', accountStag[selectedNumber]);
      await page.type('[name="user_pass"]', 'Lce991101'); // 비밀번호는 실제 비밀번호로 대체
      await page.click('[name="done"]');
      await page.waitForNavigation();
    })();

    pagePromises.push(loginPromise);

    // 코인/티켓 0인 계정 로그인 경우
    if (flag === 1 && i === num - 1 && !specialAccountUsed) {
      const specialBrowser = await puppeteer.launch(options);
      browsers.push(specialBrowser);
      const specialPage = await specialBrowser.newPage();
      await specialPage.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

      const specialLoginPromise = (async () => {
        await specialPage.goto('https://stag.namco-ocg.com/login');
        await specialPage.type('[name="user_id"]', accountStag[5]); // 코인/티켓 0인 계정 index
        await specialPage.type('[name="user_pass"]', 'Lce991101');
        await specialPage.click('[name="done"]');
        await specialPage.waitForNavigation();
      })();
    }
  }
  console.log(`테스트 계정 ${num}개 접속 완료`)
  return browsers;
}

module.exports = { loginTestAccount };
