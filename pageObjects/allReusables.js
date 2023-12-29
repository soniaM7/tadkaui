
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
const {sleep } = require('../Resources/Functions/resources');
const {expect} = require('@playwright/test');
module.exports = {
        readUserLogsTable: async(buttonName,page) =>{
            await page.waitForSelector('[class = "ant-table-row ant-table-row-level-0 table-row-light"]');
            const userTable_rows = await page.locator(OR.logTable).first().locator('tr');
            await sleep(1000);
            const userTable_column = await userTable_rows.first().locator('td');
            const logName= await userTable_column.last().textContent();
            console.log("Log box name",logName);
            expect(buttonName).toEqual(logName);

            const time= await userTable_column.first().textContent();
            return [time,logName];

        },
        async readMachineLogsTable(page){
            const machineTable_rows = await page.locator(OR.logTable).last().locator('tr');
            const machineTable_column = await machineTable_rows.first().locator('td');
            const loggName= await machineTable_column.nth(1).textContent();
            console.log(loggName);
            return loggName;
        },
        async compareUserAndMachineLogs(userCommand,machineCommand){
            expect(userCommand).toEqual(machineCommand);

        },
        async debugButtonStatus(page){
            const value = await page.locator(OR.debugButton).nth(1).textContent();
            console.log(value);
            switch(value){
                case "Enable Debug":
                    await page.getByRole('button',{name:"Enable Debug"}).click();
                    await expect(page.locator("text=Clear Logs")).toBeVisible();
                //this.page.on("dialog" , dialog => dialog.accept());
                //await this.clearLogs.nth(2).click();
                case "Disable Debug":
                    await expect(page.locator("text=Clear Logs")).toBeVisible();
            }
        },
        async verifyServerStatusIcon(page){
            expect(await page.locator(OR.server_machine_Status_Icon).last().screenshot({path:'serverStatus.png'})).toMatchSnapshot('serverStatusIcon.png');
        
        },
        async verifyTitle(page){
            console.log("Title of the page is: " , await page.locator(OR.title).textContent());
            expect(await page.locator(OR.title).textContent()).toEqual('Tadka Maker');
            
         }

    }
//module.exports={readUserLogsTable};