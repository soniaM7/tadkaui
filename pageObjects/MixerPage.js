const {sleep } = require('../Resources/Functions/resources');
const{expect} = require('@playwright/test');

class MixerPage{
    constructor(page){
        this.page=page;
        this.mixerTab = this.page.locator('#rc-tabs-0-tab-3');
        this.allMixerOptions = this.page.locator('[id="rc-tabs-0-panel-3"] .top');
        this.debugButton = this.page.locator('button[class*="ant-btn-default ant-btn-lg"]');
        this.mixerType = this.page.locator('#rc-tabs-0-panel-3 .actionButton'); 
        this.userTable = this.page.locator('div [class ="ant-table-tbody"]');
    }

    async clickToMixerAndVerifyLogs(){
        
        await this.mixerTab.click();
        //await this.page.waitForNavigation();
        const items = await this.allMixerOptions.textContent();
        console.log("Mixer name: ",items);
        const value = await this.debugButton.nth(1).textContent();
        console.log(value);
    
    
        if(value==='Enable Debug'){
            await this.page.getByRole('button',{name:"Enable Debug"}).click();
            expect(this.page.locator('//span[text()="Clear Logs"]')).toBeVisible();
            this.page.on("dialog" , dialog => dialog.accept());
            await this.clearLogs.nth(2).click();
        }
        expect(this.page.locator('//span[text()="Clear Logs"]')).toBeVisible();
        // click to food boxes one by one
        for(let i=0 ; i<4 ; i++){
            const buttonName = await this.mixerType.nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator('#rc-tabs-0-panel-3 .actionButton').nth(i).click();   
           await this.page.waitForSelector('[class = "ant-table-row ant-table-row-level-0 table-row-light"]');
            const userTable_rows = await this.userTable.first().locator('tr');
            await sleep(1000);
            const userTable_first_column = await userTable_rows.first().locator('td');
            const logName= await userTable_first_column.last().textContent();
            console.log("Log box name",logName);
            expect(buttonName).toEqual(logName);
        }
    }
}

module.exports={MixerPage};