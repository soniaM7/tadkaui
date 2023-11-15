const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {filePath} = require('../Resources/Functions/helper');



class FoodBoxesPage{
    constructor(page){
        this.page=page;
    }

    async verifyTitle(){
       console.log("Title of the page is: " , await this.title.textContent());
       expect(await this.page.locator(OR.title).textContent()).toEqual('Tadka Maker');
       
    }

    async verifyServerStatus(){
        expect(await this.page.locator(OR.serverStatus).screenshot({path:'serverStatus.png'})).toMatchSnapshot('serverStatusIcon.png');
    }

   /* async openDebug(){
        await this.page.getByRole('button',{name:"Enable Debug"}).click();
        await expect(this.clearLogs).toBeVisible();
    }*/

    async clickToFoodandVerifyLogs(){
        await this.page.locator(OR.foodTab).click();
        const items = await this.page.locator(OR.allFoodBoxes).textContent();
        console.log("Food Boxes name: ",items);
        await this.page.getByRole('button',{name:"Enable Debug"}).click();
        expect(this.page.locator(OR.clearLogs)).toBeVisible();
        // click to food boxes one by one
        for(let i=0 ; i<4 ; i++){
            const buttonName = await this.page.locator(OR.foodBox).nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator(OR.foodBox).nth(i).click();   
           await this.page.waitForSelector('[class = "ant-table-row ant-table-row-level-0 table-row-light"]');
            const userTable_rows = await this.page.locator(OR.userTable).first().locator('tr');
            await sleep(1000);
            const userTable_first_column = await userTable_rows.first().locator('td');
            const logName= await userTable_first_column.last().textContent();
            console.log("Log box name",logName);
            expect(buttonName).toEqual(logName);
        }
    }

    async exportUserLogsToCsv(path){
        const [ download ] = await Promise.all([
        this.page.waitForEvent('download'), // wait for download to start
        this.page.getByRole('button',{name:'Export to CSV'}).first().click()
        ]);

        // wait for download to complete
        await download.saveAs(path);      
        //this.page.close();
    };

}
module.exports={FoodBoxesPage};