class LoginPage{
    constructor(page){
        this.page = page;
        this.page.getByRole('button').click();
        this.loginButton =this.page.locator('div button');
        
       }

    async goTo(){
        await this.page.goto('http://www.tadka.fun/tadkaui');    
    }

    async signIn(){
        await this.loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

}
module.exports={LoginPage};