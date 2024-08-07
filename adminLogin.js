const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 1000;

const adminAccountPath = path.join(__dirname, 'adminAccount.json');
const adminAccount = JSON.parse(fs.readFileSync(adminAccountPath, 'utf8'));

const url = 'https://stag-admin.namco-ocg.com/admin/stages/in-service';

async function login(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

    // 페이지로 이동
    await page.goto(url, { waitUntil: 'networkidle2' });

    // ID, Password 입력 후 로그인
    await page.type('body > div > div.login-box-body > form > div:nth-child(2) > input', adminAccount.username); // ID 입력
    await page.type('body > div > div.login-box-body > form > div:nth-child(3) > input', adminAccount.password); // 비밀번호 입력
    await page.click('body > div > div.login-box-body > form > div.row > div > button');

    // 로그인 완료 후 대기
    return page;
}

module.exports = { login };
