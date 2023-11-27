const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus } = require("../pageObjects/allReusables");


class SpicesPage{
    constructor(page){
        this.page=page;       
    }

    async printSpicesBoxesName(){
        await this.page.locator(OR.spicesTab).click();
        const items = await this.page.locator(OR.allSpiecesBoxes).textContent();
        console.log("Spieces Boxes name: ",items);
    }

    async clickToSpiecesandVerifyLogs(){
        await this.printSpicesBoxesName();
        await debugButtonStatus(this.page);

        const pageObjectMixer = await this.page.locator(OR.mixerType);
        const count =await pageObjectMixer.count();
        console.log(count);
        
        for(let i=0 ; i<count ; i++){
            const buttonName = await this.page.locator(OR.spiecesBox).nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator(OR.spiecesBox).nth(i).click(); 

            const time = await readUserLogsTable(buttonName,this.page)
           
            const clock_24 = await convertTo24HourFormat(time);
            
            const machineReceivingMessage = mockMachine.getUserMessages();
            const length = machineReceivingMessage.length;
            let j=length-1;
            const value = machineReceivingMessage[j].msg;
            console.log(machineReceivingMessage);
                        
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

module.exports={SpicesPage};

