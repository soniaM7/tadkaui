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

    async readandCompareLogs(){
        const returnValue = await readUserLogsTable("Mix Long",this.page)
        const clock_24 = await convertTo24HourFormat(returnValue[0]);  
        const machineReceivingMessage = mockMachine.getUserMessages();
        console.log(machineReceivingMessage);
        const value = machineReceivingMessage[0].msg;
                        
        //mock Machine Received message
        const commandReceivedMessage= '{"type":"message","timestamp":"'+clock_24+'","msg":"202:'+value+'", "from":"machine","user":"tadka-1"}'
        mockMachine.sendMessage(commandReceivedMessage);
        await sleep(1000);
        // command is completed and now moc machine can take other command
        const commandCompleted = '{"type":"message","timestamp": "'+clock_24+'","msg":"200:'+value+'", "from":"machine","user":"tadka-1"}'
        mockMachine.sendMessage(commandCompleted);
        await sleep(1000);

        const machineLog= await readMachineLogsTable(this.page);
        let x = await machineLog.split(': ');
        let machineLogName= await x[1];
        await compareUserAndMachineLogs(returnValue[1],machineLogName);

    }

    async clickToMixContiniousAndVerifyLogs(){
        const isConnected = await connectToMachine();
        switch(isConnected){
            case true:
                break;
            
            case false:
                console.log("Machine is not connected");
                break;
        }
        //expect(isConnected).toBeTruthy();
        await debugButtonStatus(this.page);
        await this.page.getByText('Mix Continuous').click();
        await this.readandCompareLogs();  
        expect(await this.page.locator(OR.mixContiniousStopButton).isVisible());

        let mixingNumberText = await this.page.locator('[class ="actionButtonHotPlate"] div').first();
        await sleep(5000);
        console.log("Current Log is:  ",await mixingNumberText.textContent());
       
        await expect(await this.page.locator('text=Stop (mixing inseconds)0')).toBeVisible({timeout:32000});
        //await expect(await this.page.locator("//button[@class='actionButtonHotPlate' and normalize-space()='Stop (mixing inseconds)0']")).toBeVisible({timeout:32000});
        await this.page.locator('[class ="actionButtonHotPlate"] div').first().click();
        await sleep(2000);
              

    }
   
       
        
   
}
module.exports={MixContiniousPage};