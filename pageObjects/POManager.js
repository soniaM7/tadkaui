//const {LoginPage} = require('../pageObjects/LoginPage');
const {FoodBoxesPage} = require('../pageObjects/FoodBoxesPage');
const {MixerPage} = require('../pageObjects/MixerPage');
const {SpicesPage} = require('../pageObjects/SpicesPage');
const{Machine_Server_StatusPage} = require('../pageObjects/Machine_Server_StatusPage');
const {CommonFunctionPage} = require('../pageObjects/CommonFunctionPage');
//const {sleep,sleep1Sec } = require('../Resources/Functions/resources');


class POManager{
    constructor(page){
        this.page=page;
        //this.LoginPage=new LoginPage(page);
        this.FoodBoxesPage = new FoodBoxesPage(page);
        this.MixerPage = new MixerPage(page);
        this.SpicesPage = new SpicesPage(page);
        this.Machine_Server_StatusPage = new Machine_Server_StatusPage(page);
       // this.CommonFunctionPage = new CommonFunctionPage(page);
       
        }
    
    getLoginPage(){
        return this.LoginPage;
    }

    getFoodBoxesPage(){
        return this.FoodBoxesPage;
    }

    getMixerPage(){
        return this.MixerPage;
    }

    getSpicesPage(){
        return this.SpicesPage;
    }

    getMachineStatusPage(){
        return this.Machine_Server_StatusPage;
    }

    


}

module.exports={POManager};