const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');

class SpicesPage{
    constructor(page){
        this.page=page;       
        this.debugButton = this.page.locator('button[class*="ant-btn-default ant-btn-lg"]');
        this.clearLogs = this.page.locator('//span[text()="Clear Logs"]');
        this.spicesTab = this.page.locator('#rc-tabs-0-tab-2');       
        this.allSpiecesBoxes = this.page.locator('[id="rc-tabs-0-panel-2"] .top');
        this.spiecesBox = this.page.locator('#rc-tabs-0-panel-2 .actionButton'); 
        this.userTable = this.page.locator('div [class ="ant-table-tbody"]'); 
        this.clearLogs =this.page.locator('[class*= "ant-btn-default ant-btn-lg"]');
        this.userOptionExportToCsv = this.page.locator('[class*="ant-btn css-dev-only-do-not-override"]');

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
}

module.exports={SpicesPage};

