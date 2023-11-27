const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {connectToMachine,convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
import fs from 'fs';
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus,verifyServerStatusIcon } = require("../pageObjects/allReusables");


class FoodBoxesPage{
    constructor(page){
        this.page=page;
    }

    async verifyTitle(){
       console.log("Title of the page is: " , await this.page.locator(OR.title).textContent());
       expect(await this.page.locator(OR.title).textContent()).toEqual('Tadka Maker');
       
    }

    async printFoodBoxesName(){
        await this.page.locator(OR.foodTab).click();
        const items = await this.page.locator(OR.allFoodBoxes).textContent();
        console.log("Food Boxes name: ",items);
    }
 

    async clickToFoodandVerifyLogs(){
        const isConnected = await connectToMachine();
        expect(isConnected).toBeTruthy();
        await verifyServerStatusIcon(this.page);
        await this.printFoodBoxesName();
        await debugButtonStatus(this.page);

        const pageObjectMixer = await this.page.locator(OR.mixerType);
        const count =await pageObjectMixer.count();
        console.log(count);
        
        // click to food boxes one by one
        for(let i=0 ; i<count ; i++){
            const buttonName = await this.page.locator(OR.foodBox).nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator(OR.foodBox).nth(i).click();   
            const time = await readUserLogsTable(buttonName,this.page)
           
            const clock_24 = await convertTo24HourFormat(time);

            const machineReceivingMessage = mockMachine.getUserMessages();
            console.log("machineReceivingMessage");
            console.log(machineReceivingMessage);
            const value = machineReceivingMessage[i].msg;
                        
            //mock Machine Received message
            const commandReceivedMessage= '{"type":"message","timestamp":"'+clock_24+'","msg":"202:'+value+'", "from":"machine","user":"tadka-1"}'
            mockMachine.sendMessage(commandReceivedMessage);
            await sleep(1000);
            // command is completed and now moc machine can take other command
            const commandCompleted = '{"type":"message","timestamp": "'+clock_24+'","msg":"200:'+value+'", "from":"machine","user":"tadka-1"}'
            mockMachine.sendMessage(commandCompleted);
            await sleep(1000);
            await readMachineLogsTable(this.page);
            break;
        }
    }


}
module.exports={FoodBoxesPage};