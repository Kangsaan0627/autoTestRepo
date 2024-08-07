const { loginTestAccount } = require('./loginTestAccount');
const { regist } = require('./prizeRegister');
const { playSet } = require('./playSystemSetting');
const { boothRegister} = require('./boothRegister')
const { userFull } = require('./boothUserFull')
const {needCoinTicket} = require('./checkCoinTicket')
const {checkBoothUserNum} = require('./checkBooth')
// 테스트 계정 로그인 함수 호출
async function performTestAccountLogin(num, flag) {
    try {
        await loginTestAccount(num, flag); // 로그인 수, 코인/티켓:0 계정 포함 여부
        console.log('테스트 계정 로그인 테스트 성공');
    } catch (error) {
        console.log('테스트 계정 로그인 테스트 실패');
    }
}

// 경품 등록 함수 호출
async function performRegist() {
    try {
        await regist();
        console.log('경품 등록 테스트 성공');
    } catch (error) {
        console.log('경품 등록 테스트 실패');
    }
}

async function performPlaySet() {
    try {
        await playSet();
        console.log('플레이 시스템 설정 등록 테스트 성공');
    } catch (error) {
        console.log('플레이 시스템 설정 등록 테스트 실패');
    }
}

async function performeBoothRegister() {
    try {
        await boothRegister();
        console.log('부스 등록 테스트 성공');
    } catch (error) {
        console.log('부스 등록 테스트 실패');
    }
}

async function performUserFull() {
    try {
        await userFull();
    } catch (error) {
        console.log(error);
    }
}
async function performNeedCoinTicket() {
    try {
        await needCoinTicket(3);
    } catch (error) {
        console.log(error);
    }
}

async function performCheckBoothUserNum() {
    try {
        await checkBoothUserNum(4);
    } catch (error) {
        console.log(error);
    }
}
// 기능 호출
// performTestAccountLogin(3,0); // 테스트 계정 로그인 호출
// performRegist(); // 경품 등록 호출
// performPlaySet();
// performeBoothRegister()
// performUserFull()
// performNeedCoinTicket();
performCheckBoothUserNum();