const {test} = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
const {readFile,filePath,deletOldReport} = require('../Resources/Functions/helper');
const { sleep } = require('../Resources/Functions/resources');
const { verifyTitle } = require('../pageObjects/allReusables');



test.beforeEach(async ({ page }) => {
  
    await page.goto('http://www.tadka.fun/tadkaui');
    const loginButton =page.locator('div button');
    const loginButtonStatus = await loginButton.isVisible();
    console.log(loginButtonStatus);

    switch(loginButtonStatus){
        case false:
            await page.reload();
            await sleep(1000);
            try{
            await loginButton.click();
            } catch (error) {
            console.log(error);
            }
            break;

        case true:
            await loginButton.click();
            break;
    }
});
    
test("verify Water attachments", async ({page}) =>{

    const poManager = new POManager(page);
    const mixContinious =poManager.getMixContiniousPage();


    
    
    async function verifyServerStatus(re_connect_button_available){
        console.log(re_connect_button_available);
        switch(re_connect_button_available){
            case true :
                try{
                    await page.getByRole('button',{name:"Re-connect"}).click();
                } catch (error) {
                    console.log("server is down"+error);
                }
                break;
            case false:
                break;
        }
    }

    async function exportUserLogsToCsv(path,table){
        if(table=="userLogs"){
            const [ download ] = await Promise.all([
                page.waitForEvent('download'),
                page.getByRole('button',{name:'Export to CSV'}).first().click()
                ]);
                // wait for download to complete
                await download.saveAs(path);      
                //this.page.close();
        }
        if(table=="machineLogs"){
            const [ download ] = await Promise.all([
                page.waitForEvent('download'),
                page.getByRole('button',{name:'Export to CSV'}).last().click()
                ]);
                // wait for download to complete
                await download.saveAs(path);      
                //this.page.close();
        }
        
    };

    await verifyTitle(page);
    let re_connect_button = await page.getByRole('button',{name:"Re-connect"}).isVisible();
    await verifyServerStatus(re_connect_button);

    await mixContinious.clickToMixContiniousAndVerifyLogs();
    
   
    await deletOldReport();

    const userLogs_reliablePath = await filePath("userLogs");
    const machineLogs_reliablePath = await filePath("machineLogs");

    await exportUserLogsToCsv(userLogs_reliablePath,"userLogs");
    await exportUserLogsToCsv(machineLogs_reliablePath,"machineLogs");
    
    const userRecipeLogs = await readFile('../../'+userLogs_reliablePath);
    const machineRecipeLogs = await readFile('../../'+machineLogs_reliablePath);
    
    console.log(userRecipeLogs);
    console.log(machineRecipeLogs);
    
  });