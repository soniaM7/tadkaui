const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {connectToMachine,convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus,compareUserAndMachineLogs } = require("./allReusables");


class MixContiniousPage{
    constructor(page){
        this.page=page;
    }

    async clickToMixContiniousAndVerifyLogs(){
        const isConnected = await connectToMachine();
        expect(isConnected).toBeTruthy();
        await debugButtonStatus(this.page);
        await this.page.getByText('Mix Continuous').click();  
        //await this.page.waitForSelector(OR.mixContiniousStopButton); 
        
        expect(await this.page.locator(OR.mixContiniousStopButton).isVisible());
       // await this.page.locator('[class ="actionButtonHotPlate"] div').last().waitFor();
       //let text = await this.page.locator('.actionButtonHotPlate');
        let mixingNumberText = await this.page.locator('[class ="actionButtonHotPlate"] div').first();
        await sleep(5000);
        console.log("Number is ",await mixingNumberText.textContent());
        
        
       // await expect(await this.page.waitForSelector(text).nth(2).toBeVisible());

        await expect(await this.page.locator("//button[@class='actionButtonHotPlate' and normalize-space()='Stop (mixing inseconds)0']")).toBeVisible({timeout:32000});
        await this.page.locator('[class ="actionButtonHotPlate"] div').first().click();
        await sleep(2000);
        console.log("waited for 30sec");
       /* await this.page.getByText('Mix Continuous').click();
       
       /*await expect(this.page.waitForSelector('[class ="actionButtonHotPlate"] div', { state: 'attached' }).textContent('Stop (mixing inseconds)0'))
        console.log("Number is ",mixingNumberText);
        await text.first().click();

       /* await expect(text.nth(1)).toHaveText('0')
        console.log("Number is ",mixingNumberText);
        await text.first().click();*/
        

    }
}
module.exports={MixContiniousPage};