const { expect } = require("@playwright/test");
const {sleep,sleep1Sec } = require('../Resources/Functions/resources');
const ExcelJS = require('exceljs');
const { promises } = require("dns");
const { CsvFormatterStream } = require("fast-csv");




class DashboardPage{
    constructor(page){
        this.page=page;
        this.title = this.page.locator('div .title');
        this.serverStatus = this.page.locator('[class="anticon anticon-check-circle"]');
        this.debugButton = this.page.locator('button[class*="ant-btn-default ant-btn-lg"]');
        this.clearLogs = this.page.locator('//span[text()="Clear Logs"]');
        this.foodTab = this.page.locator('#rc-tabs-0-tab-1');
        this.spicesTab = this.page.locator('#rc-tabs-0-tab-2');

        
        
        this.allFoodBoxes = this.page.locator('[id="rc-tabs-0-panel-1"] .top'); 
        this.allSpiecesBoxes = this.page.locator('[id="rc-tabs-0-panel-2"] .top');

        this.foodBox = this.page.locator('#rc-tabs-0-panel-1 .actionButton');
        this.spiecesBox = this.page.locator('#rc-tabs-0-panel-2 .actionButton'); 

        this.userTable = this.page.locator('div [class ="ant-table-tbody"]'); 
        this.clearLogs =this.page.locator('[class*= "ant-btn-default ant-btn-lg"]');

        this.userOptionExportToCsv = this.page.locator('[class*="ant-btn css-dev-only-do-not-override"]');
        

    }

    async verifyTitle(){
       console.log("Title of the page is: " , await this.title.textContent());
       expect(await this.title.textContent()).toEqual('Tadka Maker');
       
    }

    async verifyServerStatus(){
        expect(await this.serverStatus.screenshot({path:'serverStatus.png'})).toMatchSnapshot('serverStatusIcon.png');
    }

   /* async openDebug(){
        await this.page.getByRole('button',{name:"Enable Debug"}).click();
        await expect(this.clearLogs).toBeVisible();
    }*/

    async clickToFoodandVerifyLogs(){
        await this.foodTab.click();
        const items = await this.allFoodBoxes.textContent();
        console.log("Food Boxes name: ",items);
        await this.page.getByRole('button',{name:"Enable Debug"}).click();
        expect(this.page.locator('//span[text()="Clear Logs"]')).toBeVisible();
        // click to food boxes one by one
        for(let i=0 ; i<4 ; i++){
            const buttonName = await this.foodBox.nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator('.actionButton').nth(i).click();   
           await this.page.waitForSelector('[class = "ant-table-row ant-table-row-level-0 table-row-light"]');
            const userTable_rows = await this.userTable.first().locator('tr');
            await sleep(1000);
            const userTable_first_column = await userTable_rows.first().locator('td');
            const logName= await userTable_first_column.last().textContent();
            console.log("Log box name",logName);
            expect(buttonName).toEqual(logName);
        }
    }

    async clickToSpiecesandVerifyLogs(){
        await this.spicesTab.click();
        const items = await this.allSpiecesBoxes.textContent();
        console.log("Spieces Boxes name: ",items);
       const value = await this.debugButton.nth(1).textContent();
        console.log(value);


        if(value==='Enable Debug'){
            await this.page.getByRole('button',{name:"Enable Debug"}).click();
            expect(this.page.locator('//span[text()="Clear Logs"]')).toBeVisible();
            this.page.on("dialog" , dialog => dialog.accept());
            await this.clearLogs.nth(2).click();
        }
       /* else{
            this.page.on("dialog" , dialog => dialog.accept());
            await this.clearLogs.nth(2).click();
        }*/
        //this.page.pause();
        for(let i=0 ; i<4 ; i++){
            const buttonName = await this.spiecesBox.nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator('#rc-tabs-0-panel-2 .actionButton').nth(i).click(); 
            const userTable_rows = await this.userTable.first().locator('tr');
            await sleep(1000);
            const userTable_first_column = await userTable_rows.first().locator('td');
            const logName= await userTable_first_column.last().textContent({delay:1000});
            console.log("Log box name",logName);
            expect(buttonName).toEqual(logName);
        }  

    }


    async exportUserLogsToCsv(){
        const reliablePath = '../TadkaMaker/user_Report/report.csv';
       // const reliablePath = 'file4.csv';
        const [ download ] = await Promise.all([
            this.page.waitForEvent('download'), // wait for download to start
            this.page.getByRole('button',{name:'Export to CSV'}).first().click()
        ]);

        // wait for download to complete
        await download.saveAs(reliablePath);      
         this.page.close();
    };

}
module.exports={DashboardPage};