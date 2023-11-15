const OR = JSON.parse(JSON.stringify(require('../ObjectRepository/ObjectRepository.json')));
class LoginPage{
    constructor(page){
        this.page = page;
        //this.loginButton =this.page.locator('div button');
        
       }

    async goTo(){
        await this.page.goto('http://www.tadka.fun/tadkaui');    
    }

    async signIn(){
        await OR.click();
        await this.page.waitForLoadState('networkidle');
    }

}
module.exports={LoginPage};