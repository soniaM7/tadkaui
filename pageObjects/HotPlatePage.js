const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {connectToMachine,convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus,compareUserAndMachineLogs } = require("./allReusables");

class HotPlatePage{
    constructor(page){
        this.page=page;
        this.map1 = new Map();

        this.map1.set(1, 'Low');
        this.map1.set(2, 'Low Medium');
        this.map1.set(3, 'Medium');
        this.map1.set(4, 'Medium High');
        this.map1.set(5, 'High');
    }

  

    async clickToHotPlateAndVerifyLogs(){
        const isConnected = await connectToMachine();
        expect(isConnected).toBeTruthy();
        await debugButtonStatus(this.page);
        await this.page.getByText('Hot plate: ').click();   
        const hopPlateWindowTitle = await this.page.locator(OR.hopPlateWindowTitle).textContent();
        expect(hopPlateWindowTitle).toEqual('Hot Plate Level');  

        const offAtZero = await this.page.locator(OR.hotPlateLevel).first().textContent();
        expect(offAtZero).toEqual('0Off');

        for(let i=1; i<=5; i++){
            await this.page.locator('strong').nth(i).click();
            const heatLevel = await this.map1.get(i)
            console.log("HeatLeavel is: "+heatLevel);
            
            const returnValue = await readUserLogsTable(heatLevel,this.page)
            const clock_24 = await convertTo24HourFormat(returnValue[0]);

            const machineReceivingMessage = mockMachine.getUserMessages();
            console.log("machineReceivingMessage");
            console.log(machineReceivingMessage);
            let j=i-1;
            const value = machineReceivingMessage[j].msg;
                        
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
        await this.page.locator('//span[text()="OK"]').click();
    }
}
module.exports={HotPlatePage};