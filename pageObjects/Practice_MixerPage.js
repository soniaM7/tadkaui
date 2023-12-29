const { debugButtonStatus, readUserLogsTable, readMachineLogsTable,compareUserAndMachineLogs} = require("./allReusables");
const {connectToMachine,convertTo24HourFormat} = require('../Resources/Functions/helper');
const{expect}= require('@playwright/test');
const mockMachine = require("tadka-machine-mock");
const {sleep } = require('../Resources/Functions/resources');

class Practice_MixerPage{
    constructor(page){
        this.page = page;
    }

  /*  async readUserLogs(){
       // const machineTable_rows = await page.locator(OR.logTable).last().locator('tr');
        await this.page.pause;
        const table = await this.page.locator("div .ant-table-tbody");
        const tableRow = await table.first().locator("tr");
        const tableColumn = await tableRow.locator("td");
        const tableLogName = await tableColumn.nth(2).textContent();
        return tableLogName;
        
    }*/
    async verifyMachineConnectivity(){
        const isConnected = await connectToMachine();
        expect(isConnected).toBeTruthy();
    }

    async clickToMixer(){
       const menueList= await this.page.locator("div .ant-tabs-nav-list");
       console.log(await menueList.textContent());
       await this.page.getByText("Mixer").click();

       const mixerMenueList = await this.page.locator("#rc-tabs-0-panel-3 .actionButton");
       const count = await mixerMenueList.count();
       return count;
       
    }
    async clickToMixerAndVerifyLogs(){
        const count = await this.clickToMixer();
        console.log("Total Mixing options are:" +count);
        const mixerMenueList = await this.page.locator("#rc-tabs-0-panel-3 .actionButton");

        for(let i=0; i<count; i++){
            let buttonName = await mixerMenueList.nth(i).textContent();
            console.log("buttonPressed is:", buttonName);
            await mixerMenueList.nth(i).click();

            await debugButtonStatus(this.page);
            
            const returnValue = await readUserLogsTable(buttonName,this.page)
            const clock_24 = await convertTo24HourFormat(returnValue[0]);
            
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

            const machineLog= await readMachineLogsTable(this.page);

            const x = await machineLog.split(': ');
            const machineLogName= await x[1];
            await compareUserAndMachineLogs(returnValue[1],machineLogName);
            //break;
     
            }
         }
       
}
module.exports={Practice_MixerPage};