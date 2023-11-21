const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
class LoginPage{
    constructor(page){
        this.page = page;
        //this.loginButton =this.page.locator('div button');
        
       }

    async verifyServerStatus(){
        await this.page.locator('[style="margin: 1em;"] path').first().screenshot();
    }

}
module.exports={LoginPage};