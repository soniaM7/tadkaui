//const {LoginPage} = require('../pageObjects/LoginPage');
const {FoodBoxesPage} = require('../pageObjects/FoodBoxesPage');
const {MixerPage} = require('../pageObjects/MixerPage');
const {SpicesPage} = require('../pageObjects/SpicesPage');
const {WaterPage} = require('../pageObjects/WaterPage');
const{Machine_Server_StatusPage} = require('../pageObjects/Machine_Server_StatusPage');
const{HotPlatePage} = require('../pageObjects/HotPlatePage');
const{MixContiniousPage}  = require('../pageObjects/MixContiniousPage');
const{Practice_MixerPage} = require('../pageObjects/Practice_MixerPage');
//const {sleep,sleep1Sec } = require('../Resources/Functions/resources');


class POManager{
    constructor(page){
        this.page=page;
        //this.LoginPage=new LoginPage(page);
        this.FoodBoxesPage = new FoodBoxesPage(page);
        this.MixerPage = new MixerPage(page);
        this.SpicesPage = new SpicesPage(page);
        this.Machine_Server_StatusPage = new Machine_Server_StatusPage(page);
        this.WaterPage = new WaterPage(page);
        this.HotPlatePage = new HotPlatePage(page);
        this.MixContiniousPage = new MixContiniousPage(page);
        this.Practice_MixerPage = new Practice_MixerPage(page);
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
    getWaterPage(){
        return this.WaterPage;
    }
    getHotPlatePage(){
        return this.HotPlatePage;
    }
    getMixContiniousPage(){
        return this.MixContiniousPage;
    }
    getPractice_MixerPage(){
        return this.Practice_MixerPage;
    }


}

module.exports={POManager};