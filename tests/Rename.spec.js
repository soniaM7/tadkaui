const {test,expect} = require('@playwright/test');
const mockMachine = require("tadka-machine-mock");
const { sleep } = require('../Resources/Functions/resources');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {connectToMachine} = require('../Resources/Functions/helper');

test.beforeEach(async ({ page }) => {
    await page.goto('http://www.tadka.fun/tadkaui');
    const loginButtonStatus =await page.locator(OR.loginButton).isVisible();
   console.log(loginButtonStatus);

   if(loginButtonStatus == false){
     await page.reload();
     await page.locator(OR.loginButton).click();
   }
    else{
        await page.locator(OR.loginButton).click();
    }
    
  });

test.describe.configure({mode:"serial"});
test("CheckTadkaMockStatus", async ({})=>{
    console.log("Hello");
    expect(mockMachine.sayHello()).toEqual('Hello');
})

test("Connect and Check Status", async ({})=>{
    mockMachine.connect('wss://tadka.fun/tadkaserver');
    await sleep(1000);
    expect(mockMachine.isConnected()).toBeTruthy;
})

test("Connect and say Hello", async ({})=>{
    mockMachine.connect('wss://tadka.fun/tadkaserver');
    await sleep(500);
    console.log("Is machine Connected:",mockMachine.isConnected());
    const connectMsg = '{"type":"message","timestamp":"-","msg":"Hi", "from":"machine","user":"tadka-1"}'
    mockMachine.sendMessage(connectMsg);
})

test.only("Connect and Press food", async ({page})=>{
    
    await connectToMachine();
    expect(await page.locator(OR.server_machine_Status).nth(1).screenshot({path:'MachineStatus.png'})).toMatchSnapshot('MachineStatusIcon.png');
        
    await page.locator(OR.foodTab).click();
    const items = await page.locator(OR.allFoodBoxes).textContent();
    console.log("Food Boxes name: ",items);
    await page.getByRole('button',{name:"Enable Debug"}).click();
    expect(page.locator(OR.clearLogs)).toBeVisible();
    
    const buttonName = await page.locator(OR.foodBox).first().textContent();
    console.log("Pressed box: ",buttonName);
    await page.locator(OR.foodBox).first().click();
    await sleep(2000);
    const machineValue = mockMachine.getUserMessages();
    console.log(machineValue);
    console.log(machineValue[0].msg);
})

test.skip("Disconnect and Check Status", async ({})=>{
    mockMachine.disconnect('wss://tadka.fun/tadkaserver');
    await sleep(1000);
    console.log(mockMachine.isConnected());
    expect(mockMachine.isConnected()).toBeFalsy;
})