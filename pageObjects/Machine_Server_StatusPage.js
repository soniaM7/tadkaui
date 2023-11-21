const {expect}= require('@playwright/test');
const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));

class Machine_Server_StatusPage{
    constructor(page){
        this.page=page;
    }

    async verifyServerStatusIcon(){
        expect(await this.page.locator(OR.server_machine_Status_Icon).screenshot({path:'serverStatus.png'})).toMatchSnapshot('serverStatusIcon.png');
    }

    async verifyServerStatus(){
        let re_connect_button = await this.page.getByRole('button',{name:"Re-connect"}).isVisible();
        if(re_connect_button === true){
            await this.page.getByRole('button',{name:"Re-connect"}).click();
            let re_connect_button = await this.page.getByRole('button',{name:"Re-connect"}).isVisible();
            if(re_connect_button==true){
                console.log("server is down");
                throw "server is down"
            }
          
        }
        else{
            return;
        }
}
}
module.exports={Machine_Server_StatusPage};

