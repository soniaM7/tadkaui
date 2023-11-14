//const {LoginPage} = require('../pageObjects/LoginPage');
const {DashboardPage} = require('../pageObjects/DashboarPage');

//const {sleep,sleep1Sec } = require('../Resources/Functions/resources');


class POManager{
    constructor(page){
        this.page=page;
      //  this.LoginPage=new LoginPage(page);
        this.DashboardPage = new DashboardPage(page);
       
        }
    
 /*   getLoginPage(){
        return this.LoginPage;
    }*/

    getDashboardPage(){
        return this.DashboardPage;
    }


}

module.exports={POManager};