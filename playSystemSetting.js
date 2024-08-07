const puppeteer = require('puppeteer');
const { login } = require('./adminLogin');

const VIEWPORT_WIDTH = 1400;
const VIEWPORT_HEIGHT = 1000;

const options = {
    headless: false, // 브라우저가 실제로 보이도록 설정
    args: ['--start-maximized'] // 브라우저 창을 최대화
};

async function playSet() {
    const browser = await puppeteer.launch(options);

    // 빈 페이지(about:blank) 닫기
    const pages = await browser.pages();
    for (const page of pages) {
        if (page.url() === 'about:blank') {
            await page.close();
        }
    }

    try {
        const page = await login(browser); // 로그인 함수 호출 및 페이지 가져오기

        await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

        // 플레이 시스템 설정 화면으로 이동
        const boothRegisterUrl = 'https://stag-admin.namco-ocg.com/admin/dai-configs/create';
        await page.goto(boothRegisterUrl, { waitUntil: 'networkidle2' });

        // 부스 이름 입력
        await page.type('#name', 'boothEx');

        // 선택 여부 체크
        await page.click('#is_selectable');

        // 기계 일괄 체크
        for (let value = 1; value <= 25; value++) {
            const machineSelector = `body > div.wrapper > div > section.content > div > div > div > form > div.box-body > div:nth-child(3) > div > div:nth-child(${value}) > label`;
            await page.click(machineSelector);
        }

        // 재시도 모드, 지원 모드 클릭
        await page.click('#selectable_redoable_mode');
        await page.click('#selectable_support_mode');

        // 각종 설정 값 입력
        await page.type('#play_time_limit', '60');
        await page.type('#continue_time_limit', '60');
        await page.type('#continue_charge_time_limit', '60');
        await page.type('#resume_time_limit', '60');
        await page.type('#inquiry_time_limit', '60');
        await page.type('#priority_time_limit', '45');
        await page.type('#watch_people_limit', '5');
        await page.type('#reserve_people_limit', '3');
        await page.type('#continue_count_limit', '-1');
        await page.type('#totalplay_count_limit', '-1');

        // 1초 대기
        await new Promise((page) => setTimeout(page, 1000));

        // 무한 대기 (브라우저 자동 종료 방지)
        await new Promise(() => {});
    } catch (error) {
        console.error('Error during playSet:', error);
    } finally {
        // 브라우저 종료 방지
        // await browser.close();
    }
}

// 모듈로 내보내기
module.exports = { playSet };
