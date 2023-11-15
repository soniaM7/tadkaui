//const {LoginPage} = require('../pageObjects/LoginPage');
const {FoodBoxesPage} = require('../pageObjects/FoodBoxesPage');
const {MixerPage} = require('../pageObjects/MixerPage');
const {SpicesPage} = require('../pageObjects/SpicesPage');
//const {sleep,sleep1Sec } = require('../Resources/Functions/resources');


class POManager{
    constructor(page){
        this.page=page;
        //this.LoginPage=new LoginPage(page);
        this.FoodBoxesPage = new FoodBoxesPage(page);
        this.MixerPage = new MixerPage(page);
        this.SpicesPage = new SpicesPage(page);
       
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


}

module.exports={POManager};