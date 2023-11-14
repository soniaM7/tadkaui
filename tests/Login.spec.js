const {test,expect} = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
const assert = require("assert");
import fs from 'fs';
import path from'path';
import {parse} from 'csv-parse/sync';
const {readFile} = require('../Resources/Functions/helper');


test.beforeEach(async ({ page }) => {
    await page.goto('http://www.tadka.fun/tadkaui');
    const loginButton =page.locator('div button');
   const loginButtonStatus = await loginButton.isVisible();
   console.log(loginButtonStatus);

   if(loginButtonStatus == false){
     await page.reload();
     await loginButton.click();
   }
    else{
        await loginButton.click();
    }
    
  });

/*test("Login", async ({page})=>{

    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
   // loginPage.goTo();
    loginPage.signIn();
    
})*/

test("verify Food and Spices attachments", async ({page}) =>{

    const poManager = new POManager(page);
    const dashBoardPage = poManager.getDashboardPage();
   // const convertPage = poManager.getConvertPage();

    //await dashBoardPage.verifyTitle();
   // await dashBoardPage.verifyServerStatus();
    
    await dashBoardPage.clickToFoodandVerifyLogs();
    //await dashBoardPage.clearLogsFunction();

    await dashBoardPage.clickToSpiecesandVerifyLogs();
    await dashBoardPage.exportUserLogsToCsv();
        
    const filePath = '../../user_Report/report.csv'; 
    const UserRecipeLogs = await readFile(filePath);
    console.log(UserRecipeLogs);

 
    

    
    
   
  });