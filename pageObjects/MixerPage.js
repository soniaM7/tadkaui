const {sleep } = require('../Resources/Functions/resources');
const{expect} = require('@playwright/test');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus } = require("../pageObjects/allReusables");
const { isArray } = require('util');

class MixerPage{
    constructor(page){
        this.page=page;
       /* this.mixerTab = this.page.locator('#rc-tabs-0-tab-3');
        this.allMixerOptions = this.page.locator('[id="rc-tabs-0-panel-3"] .top');
        this.debugButton = this.page.locator('button[class*="ant-btn-default ant-btn-lg"]');
        this.mixerType = this.page.locator('#rc-tabs-0-panel-3 .actionButton'); 
        this.userTable = this.page.locator('div [class ="ant-table-tbody"]');*/
    }

    async printMixerOptionsName(){
        await this.page.locator(OR.mixerTab).click();
        const items = await this.page.locator(OR.allMixerOptions).textContent();
        console.log("Mixer name: ",items);
    }

    async clickToMixerAndVerifyLogs(){
        await this.printMixerOptionsName();
        await debugButtonStatus(this.page);

        const pageObjectMixer = await this.page.locator(OR.mixerType);
        const count =await pageObjectMixer.count();
        console.log(count);
        
        // click to food boxes one by one
        for(let i=0 ; i<count ; i++){
            const buttonName = await this.page.locator(OR.mixerType).nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator(OR.mixerType).nth(i).click(); 
            
            const time = await readUserLogsTable(buttonName,this.page)
           
            const clock_24 = await convertTo24HourFormat(time);
            
            const machineReceivingMessage = mockMachine.getUserMessages();
            const length = machineReceivingMessage.length;
            let j=length-1;
            const value = machineReceivingMessage[j].msg;
                        
            //mock Machine Received message
            const commandReceivedMessage= '{"type":"message","timestamp":"'+clock_24+'","msg":"202:'+value+'", "from":"machine","user":"tadka-1"}'
            mockMachine.sendMessage(commandReceivedMessage);
            await sleep(1000);
            // command is completed and now moc machine can take other command
            const commandCompleted = '{"type":"message","timestamp": "'+clock_24+'","msg":"200:'+value+'", "from":"machine","user":"tadka-1"}'
            mockMachine.sendMessage(commandCompleted);
            await sleep(1000);
            await readMachineLogsTable(this.page);
        }
    }
}

module.exports={MixerPage};