//const {LoginPage} = require('../pageObjects/LoginPage');
const {DashboardPage} = require('../pageObjects/DashboarPage');
const {MixerPage} = require('../pageObjects/MixerPage');
const {SpicesPage} = require('../pageObjects/SpicesPage');
//const {sleep,sleep1Sec } = require('../Resources/Functions/resources');


class POManager{
    constructor(page){
        this.page=page;
        //this.LoginPage=new LoginPage(page);
        this.DashboardPage = new DashboardPage(page);
        this.MixerPage = new MixerPage(page);
        this.SpicesPage = new SpicesPage(page);
       
        }
    
    getLoginPage(){
        return this.LoginPage;
    }

    getDashboardPage(){
        return this.DashboardPage;
    }

    getMixerPage(){
        return this.MixerPage;
    }

    getSpicesPage(){
        return this.SpicesPage;
    }


}

module.exports={POManager};