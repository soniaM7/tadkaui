const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));


class SpicesPage{
    constructor(page){
        this.page=page;       
    }

    async clickToSpiecesandVerifyLogs(){
        await this.page.locator(OR.spicesTab).click();
        const items = await this.page.locator(OR.allSpiecesBoxes).textContent();
        console.log("Spieces Boxes name: ",items);
       const value = await this.page.locator(OR.debugButton).nth(1).textContent();
        console.log(value);
    
    
        if(value==='Enable Debug'){
            await this.page.getByRole('button',{name:"Enable Debug"}).click();
            expect(this.page.locator(OR.clearLogs).toBeVisible());
            this.page.on("dialog" , dialog => dialog.accept());
            await this.clearLogs.nth(2).click();
        }
       /* else{
            this.page.on("dialog" , dialog => dialog.accept());
            await this.clearLogs.nth(2).click();
        }*/
        //this.page.pause();
        for(let i=0 ; i<4 ; i++){
            const buttonName = await this.page.locator(OR.spiecesBox).nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator(OR.spiecesBox).nth(i).click(); 
            const userTable_rows = await this.page.locator(OR.userTable).first().locator('tr');
            await sleep(1000);
            const userTable_first_column = await userTable_rows.first().locator('td');
            const logName= await userTable_first_column.last().textContent({delay:1000});
            console.log("Log box name",logName);
            expect(buttonName).toEqual(logName);
        }  
    
    }
}

module.exports={SpicesPage};

