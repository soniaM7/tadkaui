const {test,expect} = require("@playwright/test");
const OR = require("../ObjectRepository/ObjectRepository.json");
const { POManager } = require('../pageObjects/POManager');

test.beforeEach(async ({page}) => {
    await page.goto("http://www.tadka.fun/tadkaui");
    const loginButtonVisibitlity =  await page.locator(OR.loginButton).isVisible({timeout:2000});
    switch(loginButtonVisibitlity){
        case true:
            break;
        case false:
            await page.reload({timeout:3000});
            try{
                await page.locator(OR.loginButton).click();
            }catch(error){
                console.log("Login button is not visible",error);
            }
            break;
    }
})

test("Practice after vacation",(async ({page}) =>{
    await page.getByRole("button",{name:"Login user-3"}).click();
    const title = await page.locator(OR.title).textContent();
    console.log("Title of the page is: " + title);

    const poManager = new POManager(page);
    const practice_MixerPage= poManager.getPractice_MixerPage();

    await practice_MixerPage.verifyMachineConnectivity()
    await practice_MixerPage.clickToMixerAndVerifyLogs();
    
}))