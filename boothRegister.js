const puppeteer = require('puppeteer');
const { login } = require('./adminLogin');

const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 1000;

const options = {
    headless: false, // 브라우저가 실제로 보이도록 설정
};

async function boothRegister() {
    const browser = await puppeteer.launch(options);

    // 빈 페이지(about:blank) 닫기
    const pages = await browser.pages();
    for (const page of pages) {
        if (page.url() === 'about:blank') {
            await page.close();
        }
    }
    const page = await login(browser); // 로그인 함수 호출 및 페이지 가져오기

    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

    // 부스 등록 화면으로 이동
    const boothRegisterUrl = 'https://stag-admin.namco-ocg.com/admin/stages/create';
    await page.goto(boothRegisterUrl, { waitUntil: 'networkidle2' });
    
    // 대 번호 선택
    await page.select('#dai_no', 'dai_922');

    // 플레이 설정 정보 선택
    await page.select('#dai_config', '16');

    // 플레이 타입 선택
    await page.select('#playtype_id', '5');

    // 요금/플레이 티켓 입력
    await page.type('#service_price', '2');
    await page.type('#price_ticket', '2');

    // AUTO PO: 연속 수: 1
    await page.click('#js-form > div > div.box-body > div.row > div:nth-child(1) > div:nth-child(8) > div > div:nth-child(3) > label');
    await page.select('#po_auto_count', '1');

    // PO CONTINUE
    await page.click('#js-form > div > div.box-body > div.row > div:nth-child(1) > div:nth-child(10) > div > div:nth-child(4) > label');

    // 개별 경품 선택
    await page.click('#js-form > div > div.box-body > div.form-group.text-center > a:nth-child(1)');
    // 경품 이름으로 검색
    await new Promise((page) => setTimeout(page, 1000));
    await page.click('#prizesModalDataTableBuilder-form-search > div:nth-child(5) > input');
    await page.type('#prizesModalDataTableBuilder-form-search > div:nth-child(5) > input', 'prize_limit_7');
    // 검색 결과 클릭
    await new Promise((page) => setTimeout(page, 1000));
    await page.keyboard.press('Enter');
    await new Promise((page) => setTimeout(page, 1000));
    await page.click('#prizesModalDataTableBuilder > tbody > tr > td.text-center');
    await page.click('#btn-modal-prizes');
    
    // 경품 수량 입력
    await page.type('#js-prizes > div > div:nth-child(6) > div > input', '100');

    // 저장 클릭
    // await page.click('#js-form > div > div.box-footer > button');

    // 브라우저가 종료되지 않도록 대기
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기

}

module.exports = { boothRegister };
