// this test file covers food,mixer and spieces
const {test,expect} = require('@playwright/test');
const { POManager } = require('../pageObjects/POManager');
import fs from 'fs';
import path from'path';
import {parse} from 'csv-parse/sync';
import { connect } from 'http2';
import { exit } from 'process';
import { sleep } from '../Resources/Functions/resources';
const {readFile,filePath,deletOldReport} = require('../Resources/Functions/helper');
const { verifyTitle } = require('../pageObjects/allReusables');

//const { exportUserLogsToCsv } = require("../pageObjects/allReusables");

//import { exit } from 'node:process';



test.beforeEach(async ({ page }) => {
  
    await page.goto('http://www.tadka.fun/tadkaui');
    await sleep(1000);
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

/*test("Login", async ({page})=>{

    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
   // loginPage.goTo();
    loginPage.signIn();
    
})*/

test("verify Food, Spices and Mixer attachments", async ({page}) =>{

    const poManager = new POManager(page);
    const foodBoxesPage = poManager.getFoodBoxesPage();
    
    const spicesPage = poManager.getSpicesPage();
    const mixerPage = poManager.getMixerPage();

    
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

    await verifyTitle(page);
    await verifyServerStatus();
   
    await foodBoxesPage.clickToFoodandVerifyLogs();
    await spicesPage.clickToSpiecesandVerifyLogs();
    await mixerPage.clickToMixerAndVerifyLogs();

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