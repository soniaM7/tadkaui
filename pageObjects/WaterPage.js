const { expect } = require("@playwright/test");
const {sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {connectToMachine,convertTo24HourFormat} = require('../Resources/Functions/helper');
const mockMachine = require("tadka-machine-mock");
const { readUserLogsTable,readMachineLogsTable,debugButtonStatus } = require("./allReusables");



class WaterPage{
    constructor(page){
        this.page=page;
        this.currentWaterValue = 18;
    }

    async printWaterLevelName(){
        await this.page.locator(OR.waterTab).click();
        const items = await this.page.locator(OR.allWaterLevel).textContent();
        console.log("Available Water level are: ",items);
    }

   async calculateWaterPersentage(button){
    console.log(button);
        switch(button){
            case '25 ml': 
                   let constantValue_25ml = 7/20;
                   console.log("25ml Before currentWater value: "+this.currentWaterValue);
                   this.currentWaterValue = this.currentWaterValue-constantValue_25ml;
                   let commandReceivedMessage= '{"type":"message","timestamp":"1:58:06","msg":"w 16.46 '+this.currentWaterValue+'","from":"machine","user":"tadmak"}'
                    mockMachine.sendMessage(commandReceivedMessage);
                    await sleep(1000);
                    console.log("25ml: "+await this.page.locator('[class="ant-progress-text"]').textContent());
                    break;

            case '50 ml':
                    let constantValue_50ml = 7/10;
                    console.log("50ml Before currentWater value: "+this.currentWaterValue);
                    this.currentWaterValue = this.currentWaterValue-constantValue_50ml;
                    let commandReceivedMessage_50ml= '{"type":"message","timestamp":"1:58:06","msg":"w 16.46 '+this.currentWaterValue+'","from":"machine","user":"tadmak"}'
                    mockMachine.sendMessage(commandReceivedMessage_50ml);
                    await sleep(1000);
                    console.log("50ml: "+await this.page.locator('[class="ant-progress-text"]').textContent());
                    break;
            
            case '100 ml': 
                    let constantValue_100ml = 14/10;
                    console.log("100ml Before currentWater value: "+this.currentWaterValue);
                    this.currentWaterValue = this.currentWaterValue-constantValue_100ml;
                    let commandReceivedMessage_100ml= '{"type":"message","timestamp":"1:58:06","msg":"w 16.46 '+this.currentWaterValue+'","from":"machine","user":"tadmak"}'
                    mockMachine.sendMessage(commandReceivedMessage_100ml);
                    await sleep(1000);
                    console.log("100ml: "+await this.page.locator('[class="ant-progress-text"]').textContent());
                    break;

            case '150 ml': 
                    let constantValue_150ml = 21/10;
                    console.log("150ml Before currentWater value: "+this.currentWaterValue);
                    this.currentWaterValue = this.currentWaterValue-constantValue_150ml;
                    let commandReceivedMessage_150ml= '{"type":"message","timestamp":"1:58:06","msg":"w 16.46 '+this.currentWaterValue+'","from":"machine","user":"tadmak"}'
                    mockMachine.sendMessage(commandReceivedMessage_150ml);
                    await sleep(1000);
                    console.log("150ml: "+await this.page.locator('[class="ant-progress-text"]').textContent());
                    break;

            case '200 ml':
                    let constantValue_200ml = 28/10;
                    console.log("200ml Before currentWater value: "+this.currentWaterValue);
                    this.currentWaterValue = this.currentWaterValue-constantValue_200ml; 
                    let commandReceivedMessage_200ml= '{"type":"message","timestamp":"1:58:06","msg":"w 16.46 '+this.currentWaterValue+'","from":"machine","user":"tadmak"}'
                    mockMachine.sendMessage(commandReceivedMessage_200ml);
                    await sleep(1000);
                    console.log("200ml: "+await this.page.locator('[class="ant-progress-text"]').textContent());
                    break;                
        }
    }

    async verifyMachineConnectivity(){
        const isConnected = await connectToMachine();
        expect(isConnected).toBeTruthy();
    }
    async clickToWaterandVerifyLogs(){
        await this.verifyMachineConnectivity();
        await this.printWaterLevelName();

        let commandReceivedMessage= '{"type":"message","timestamp":"1:58:06","msg":"w 16.46 18","from":"machine","user":"tadmak"}'
        mockMachine.sendMessage(commandReceivedMessage);
        await sleep(1000);
        await debugButtonStatus(this.page);
    }

    async machineCommandsReceived(clock_24,i){
            const machineReceivingMessage = mockMachine.getUserMessages();
            //console.log(machineReceivingMessage);
            let j=i;
            const value = machineReceivingMessage[j+1].msg;
            console.log(value);
                        
            //mock Machine Received message
            let commandReceivedMessage= '{"type":"message","timestamp":"'+clock_24+'","msg":"202:'+value+'", "from":"machine","user":"tadka-1"}'
            mockMachine.sendMessage(commandReceivedMessage);
            await sleep(1000);
            return value;
    }

    async testWaterPersentage(){
        const pageObjectMixer = await this.page.locator(OR.eachWaterLevel);
            const count =await pageObjectMixer.count();
            console.log(count); 

        for(let i=0 ; i<count ; i++){
            const buttonName = await this.page.locator(OR.eachWaterLevel).nth(i).textContent();
            console.log("Pressed button: ",buttonName);
            await this.page.locator(OR.eachWaterLevel).nth(i).click();  
            const time = await readUserLogsTable(buttonName,this.page)
            const clock_24 = await convertTo24HourFormat(time);

            let value = await this.machineCommandsReceived(clock_24,i);

            await this.calculateWaterPersentage(buttonName);
            // command is completed and now moc machine can take other command
            const machineCommandCompleted = '{"type":"message","timestamp": "'+clock_24+'","msg":"200:'+value+'", "from":"machine","user":"tadka-1"}'
            mockMachine.sendMessage(machineCommandCompleted);
            await sleep(1000);
            await readMachineLogsTable(this.page);
            
        }
       
    }
}

module.exports={WaterPage};