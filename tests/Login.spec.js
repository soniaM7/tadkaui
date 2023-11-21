const {test,expect} = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
import fs from 'fs';
import path from'path';
import {parse} from 'csv-parse/sync';
import { connect } from 'http2';
import { exit } from 'process';
const {readFile,filePath,deletOldReport} = require('../Resources/Functions/helper');
const { exportUserLogsToCsv } = require("../pageObjects/CommonFunctionPage");

//import { exit } from 'node:process';



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
    const foodBoxesPage = poManager.getFoodBoxesPage();
    const Machine_statusPage = poManager.getMachineStatusPage();
    const spicesPage = poManager.getSpicesPage();
    //const mixerPage = poManager.getMixerPage();

    await foodBoxesPage.verifyTitle();
    await Machine_statusPage.verifyServerStatus();
    await Machine_statusPage.verifyServerStatusIcon();

   
    await foodBoxesPage.clickToFoodandVerifyLogs();
    
    
    await spicesPage.clickToSpiecesandVerifyLogs();
    //await mixerPage.clickToMixerAndVerifyLogs();
    await deletOldReport();
    const reliablePath = await filePath();
    await foodBoxesPage.exportUserLogsToCsv(reliablePath);
    
    const UserRecipeLogs = await readFile('../../'+reliablePath);
    console.log(UserRecipeLogs);
    
    
   
  });