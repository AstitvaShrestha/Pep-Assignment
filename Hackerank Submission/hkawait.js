const puppeteer = require('puppeteer');
const emailObj = require('./secrets');
const { answers } = require('./codes');
const loginLink = "https://www.hackerrank.com/auth/login";

let browserStartPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
})

let page, browser;
(async function(){
    try{
        let browserObj = await browserStartPromise;
        console.log("Browser opened");
        browser = browserObj;
        // new Tab
        page = await browserObj.newPage();
        await page.goto(loginLink);
        await page.type("input[id='input-1']", emailObj.email, { delay: 50 });
        await page.type("input[type='password']", emailObj.password, { delay: 50 });
        await page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
        await waitAndClick(".track-card a[data-attr2='algorithms']", page);
        await waitAndClick("input[value='warmup']", page);
        await page.waitFor(3000);
        let questionsPage = page;
        let questionsArr = await page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled"
            , { delay: 100 });
        for (let i = 0; i < questionsArr.length; i++) {
            await questionSolver(questionsPage, questionsArr[i], answers[i]);
        }
    } 
    catch (err){
        console.log(err);
    }
})();



// n number of question first 

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
        waitForModalPromise
            .then(function () {
                let clickModal =
                    cPage.click(selector, { delay: 100 });
                return clickModal;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err)
            })
    }
    )
}

// return a promise -> that will submit a given question 
function questionSolver(page, question, answer) {
    return new Promise(function (resolve, reject) {
        let qWillBeCLickedPromise = question.click();
        qWillBeCLickedPromise
            //click
            // code type 
            // ctrl A+ ctrl x
            // click on editor 
            // ctrl A+ctrl v
            //  reached to editor
            .then(function () {
                // focus 
                let waitFOrEditorToBeInFocus =
                    waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            // click
            .then(function () {
                return waitAndClick(".checkbox-input", page);
            }).then(function () {
                return page.waitForSelector("textarea.custominput", { visible: true });
            })
            .then(function () {
                return page.type("textarea.custominput", answer, { delay: 10 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                return page.keyboard.press("X", { delay: 100 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            })
            .then(function () {
                // focus 
                let waitFOrEditorToBeInFocus =
                    waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            .then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("V", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            }).then(function () {
                return page.click(".hr-monaco__run-code", { delay: 50 });
            })
            .then(function () {
                resolve();
            }).catch(function (err) {
                console.log(err)
                reject(err);
            })
    })
}




// promise -> banner is present or not -> the code will run
function handleIfNotPresent(selector, cPage){
    return new Promise(function (resolve, reject){
        // wait clickModal
        let waitAndClickPromise = waitAndClick(selector, cPage);
        waitAndClickPromise.then(function(){
            resolve();
        }).catch(function(err){
            resolve();
        })
    })
}