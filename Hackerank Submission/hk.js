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
browserStartPromise
    .then(function (browserObj){
        console.log("Browser Opened");
        browser = browserObj;
        let browserTabOpenPromise = browserObj.newPage();
        return browserTabOpenPromise;
    })
    .then(function(newTab){
        page = newTab;
        let hkPageOpenPromise = newTab.goto(loginLink);
        return hkPageOpenPromise;
    })
    .then(function (){
        let waitForSelectorPromise = page.waitForSelector("input[placeholder='Your username or email']", {visible: true});
        return waitForSelectorPromise;
    })
    .then(function (){
        let waitforTypingPromise = page.type("input[placeholder='Your username or email']", emailObj.email, {delay: 50});
        return waitforTypingPromise; 
    })
    .then(function (){
        let waitforTypingPromise = page.type("input[placeholder='Your password']", emailObj.password, {delay: 50});
        return waitforTypingPromise; 
    })
    .then(function(){
        let loginClickPromise = page.click("button[data-analytics='LoginPassword']", {delay:100});
        return loginClickPromise;
    })
    .then(function (){
        let algorithmPromise = waitAndClick("div [data-automation='algorithms']", page);
        return algorithmPromise;
    })
    .then(function(){
        let getToWarmUpPromise = waitAndClick("input[value='warmup']", page);
        return getToWarmUpPromise;
    })
    .then(function (){
        let watFor3SecondsPromise = page.waitFor(3000);
        return watFor3SecondsPromise;
    })
    .then(function(){
        let AllChallengesArrPromise = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled");
        return AllChallengesArrPromise;
    })
    .then(function (questionsArr){
        // n number of questions first
        console.log("number of questions", questionsArr.length);
        let qWillBeSolvedPromise = questionSolver(page, questionsArr[0], answers[0]);
        return qWillBeSolvedPromise;
    })
    .then(function (){
        console.log("question is solved");
    })
    // .then(function(){
    //     browser.close();
    // })
    // .then(function (){
    //     let watForSelectorPromise = page.waitForSelector('.monaco-editor.no-user-select', {visible:true});
    //     return watForSelectorPromise;
    // })
    // .then(function (){
    //     let settingDotClickPromise = page.click(".hr-monaco-settings-editor", {delay: 50});
    //     return settingDotClickPromise;
    // })
    // .then(function (){
    //     let autoCompleteOffPromise = waitAndClick("button[aria-label='Disable Autocomplete']", page);
    //     return autoCompleteOffPromise;
    // })
    // .then(function (){
    //     let settingDotClickPromise = page.click(".hr-monaco-settings-editor", {delay: 50});
    //     return settingDotClickPromise;
    // })
    // .then(function (){
    //     let waitForSettingClosePromise = page.waitFor(3000);
    //     return waitForSettingClosePromise;
    // })
    // .then(function (){
    //     let monacoEditorFocusPromise = page.focus('textarea.inputarea', {visible:true});
    //     return monacoEditorFocusPromise;
    // })
    // .then(function (){
    //     let allSelectedPromise = page.keyboard.down('Control');
    //     return allSelectedPromise;
    // })
    // .then(function (){
    //     let allSelectedPromise = page.keyboard.press('KeyA');
    //     return allSelectedPromise;
    // })
    // .then(function (){
    //     let allSelectedPromise = page.keyboard.up('Control');
    //     return allSelectedPromise;
    // })
    // .then(function (){
    //     let allSelectedPromise = page.keyboard.press('Backspace');
    //     return allSelectedPromise;
    // })
    // .then(function(){
    //     let codeTypePromise = page.keyboard.type(codeObj.answers[0]);
    //     return codeTypePromise;
    // })
    // .then(function(){
    //     let selectExtraCodePromise = page.keyboard.down('Shift');
    //     return selectExtraCodePromise;
    // })
    // .then(function(){
    //     let code = codeObj.answers[0];
    //     let count = 0;
    //     for(let i=0;i<code.length;i++){
    //         if(code.charAt(i)=='{'){
    //             count++;
    //         }
    //     }

    //     for(let i=0;i<count+1;i++){
    //         let arrowPressPromise =  page.keyboard.press('ArrowDown');
    //     }

    //     let deleteExtraCodePromise = page.keyboard.press('Backspace');
    //     return deleteExtraCodePromise;
    // })
    // .then(function (){
    //     let runCodePromise = page.click(".hr-monaco__run-code", {delay:100});
    //     return runCodePromise;
    // })


// return a promise -> that will submit a given question
function questionSolver(page, question, answer){
    return new Promise(function (resolve, reject){
        let qWillBeClickedPromise = question.click();
        
        qWillBeClickedPromise
        // click
        // code type
        // ctrl A + ctrl X
        // click on editor
        // ctrl A + ctrl V
        // reach editor and wait for checkbox to be visible
        .then(function (){
            // focus
            let waitForEditorToBeInFocus = waitAndClick(".monaco-editor.no-user-select.vs", page);
            return waitForEditorToBeInFocus;
        })
        .then(function (){
            return waitAndClick(".checkbox-input", page);
        })
        .then(function (){
            return page.waitForSelector("textarea.custominput", { visible:true});
        })
        .then(function (){
            return page.type("textarea.custominput", answer, {delay:10});
        })
        .then(function (){
            let ctrlIsPressedP = page.keyboard.down("Control");
            return ctrlIsPressedP;
        })
        .then(function (){
            let AIsPressedP = page.keyboard.press("A", {delay:100});
            return AIsPressedP;
        })
        .then(function (){
            return page.keyboard.press("X", {delay:100});
        })
        .then(function (){
            let ctrlIsPressedP = page.keyboard.up("Control");
            return ctrlIsPressedP;
        })
        .then(function (){
            // focus
            let waitForEditorToBeInFocus = waitAndClick(".monaco-editor.no-user-select.vs", page);
            return waitForEditorToBeInFocus;
        })
        .then(function (){
            let ctrlIsPressedP = page.keyboard.down("Control");
            return ctrlIsPressedP;
        })
        .then(function (){
            let AIsPressedP = page.keyboard.press("A", {delay:100});
            return AIsPressedP;
        })
        .then(function (){
            return page.keyboard.press("V", {delay:100});
        })
        .then(function (){
            let ctrlIsPressedP = page.keyboard.up("Control");
            return ctrlIsPressedP;
        })
        // .then(function (){
        //     // auto complete feature of vscode -> monaco editor
        //     return page.keyboard.type(answer, {delay:10});
        // })
        .then(function (){
            let runCodePromise = page.click(".hr-monaco__run-code", {delay:50});
            return runCodePromise;
        })
        .then(function (){
            resolve();
        })
        .catch(function (err){
            console.log(err);
            reject(err);
        })
    })
}




// user defined promise based function -> it will return a promise
// resolved when the user has waited for element to appear as well
function waitAndClick(selector, cPage){
    return new Promise(function (resolve, reject){
        let waitForModalPromise = cPage.waitForSelector(selector, {visible: true});
        waitForModalPromise.then(function (){
            let clickModal = cPage.click(selector, {delay: 100});
            return clickModal;
        }).then(function (){
            resolve();
        }).catch(function (err){
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