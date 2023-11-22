const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus } = require("../pageObjects/CommonFunctionPage");


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
    
        for(let i=0 ; i<4 ; i++){
            const buttonName = await this.page.locator(OR.spiecesBox).nth(i).textContent();
            console.log("Pressed box: ",buttonName);
            await this.page.locator(OR.spiecesBox).nth(i).click(); 

            const time = await readUserLogsTable(buttonName,this.page)
           
            const clock_24 = await convertTo24HourFormat(time);
            
            const machineReceivingMessage = mockMachine.getUserMessages();
            console.log(machineReceivingMessage);
            let j=i;
            const value = machineReceivingMessage[j+1].msg;
                        
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

