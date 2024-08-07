const puppeteer = require('puppeteer');
const { login } = require('./adminLogin');

const VIEWPORT_WIDTH = 1400; // 뷰포트의 너비
const VIEWPORT_HEIGHT = 1000; // 뷰포트의 높이

const options = {
    headless: false, // 브라우저가 실제로 보이도록 설정
};

async function regist() {
    const browser = await puppeteer.launch(options);

    // 빈 페이지(about:blank) 닫기
    const pages = await browser.pages();
    for (const page of pages) {
        if (page.url() === 'about:blank') {
            await page.close();
        }
    }

    // 로그인 함수 호출
    const page = await login(browser);
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

    // 경품 등록 화면으로 이동
    const prizeRegisterUrl = 'https://stag-admin.namco-ocg.com/admin/prizes/create';
    await page.goto(prizeRegisterUrl, { waitUntil: 'networkidle2' });

    // 경품 이름 입력
    await page.type('#name', 'prize_name_1');
    
    // 분류 설정
    await page.select('#prize_kpi_type_id', '3');
    
    // 라이센스 소스 설정
    await page.select('#licensor_id', '1');
    
    // 장르 설정
    await page.select('#genre_id', '2');
    
    // 거래처 설정
    await page.select('#supplier_id', '1');
    
    // 품번 입력
    await page.type('#calling_no', '1112');
    
    // 구매 단가 입력
    await page.type('#purchase_price', '1000');
    
    // 선반 번호 설정
    await page.select('#prize_location_id', '1');
    
    // 경품 획득 상한 수 입력
    await page.type('#prize_out_limit_count', '0');

    // 폼 제출
    // await page.click('body > div.wrapper > div > section.content > form > div > div.box-footer > button');
    
    // 경품 일람 페이지로 이동
    const prizeEditUrl = 'https://stag-admin.namco-ocg.com/admin/prizes';
    await page.goto(prizeEditUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#dataTableBuilder > tbody > tr:nth-child(1) > td.text-center input[type="checkbox"]');

    // 첫 번째 경품의 체크박스 클릭
    await page.click('#dataTableBuilder > tbody > tr:nth-child(1) > td.text-center input[type="checkbox"]');
    
    // 입고 등록 버튼 클릭
    await page.click('#js-form > div.box-footer > button:nth-child(1)');
    await page.waitForSelector('body > div.wrapper > div > section.content > div.box > form > div.box-body.table-responsive > table > tbody > tr > td:nth-child(3) > div > input', '100');

    // 입고 번호 입력
    await page.type('body > div.wrapper > div > section.content > div.box > form > div.box-body.table-responsive > table > tbody > tr > td:nth-child(3) > div > input', '100');
    
    // 입고 폼 제출
    // await page.click('body > div.wrapper > div > section.content > div.box > form > div.box-footer > button');
    
    console.log('경품 등록 테스트 성공');

    // 브라우저가 종료되지 않도록 대기
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 대기
}

// 모듈로 내보내기
module.exports = { regist };
