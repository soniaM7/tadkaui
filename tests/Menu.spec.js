const {test} = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
const {readFile,filePath,deletOldReport} = require('../Resources/Functions/helper');


test.beforeEach(async ({ page }) => {
  
    await page.goto('http://www.tadka.fun/tadkaui');
    const loginButton =page.locator('div button');
    const loginButtonStatus = await loginButton.isVisible();
    console.log(loginButtonStatus);

    if(loginButtonStatus == false){
        await page.reload();
        try{
        await loginButton.click();
        } catch (error) {
        console.log(error);
        }
    
    }
    else{
        await loginButton.click();
    }
    
});

   
       /* switch (loginButtonStatus){
            case 1:{
                if(loginButtonStatus==false){
                    await page.reload();
                    try{
                    await loginButton.click();
                    }catch (error) {
                    console.log(error);
                    }
                }
                break;
            }
            
            case 2: {
                if(loginButtonStatus==true)
                    await loginButton.click();
            }
            break;
        }*/   
    
test("verify Water attachments", async ({page}) =>{

    const poManager = new POManager(page);
    const waterPage= poManager.getWaterPage();
    const foodBoxesPage = poManager.getFoodBoxesPage();

    

    async function verifyServerStatus(){
        let re_connect_button = await page.getByRole('button',{name:"Re-connect"}).isVisible();
        if(re_connect_button === true){
            await page.getByRole('button',{name:"Re-connect"}).click();
            let re_connect_button = await page.getByRole('button',{name:"Re-connect"}).isVisible();
            if(re_connect_button==true){
                console.log("server is down");
                throw "server is down"
            }
          
        }
        else{
            return;
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

    await foodBoxesPage.verifyTitle();
    await verifyServerStatus();
    await waterPage.clickToWaterandVerifyLogs();
    await waterPage.testWaterPersentage();

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