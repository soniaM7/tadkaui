/*const {test} = require('@playwright/test');
const {fs}= require('fs');
const {path} = require('path');
const {parse}= require('csv-parse/sync');
*/
import fs from 'fs';
import path from'path';
import {parse} from 'csv-parse/sync';
import { expect } from '@playwright/test';
import { sleep } from './resources';
const mockMachine = require("tadka-machine-mock");
const {OR}=require('../../ObjectRepository/ObjectRepository.json');
//import{parse} from 'exceljs'
//var XLSX = require("xlsx");



////////////////////////////////////////////////////////////////////////
// Function to get Values from Excel Row
////////////////////////////////////////////////////////////////////////


module.exports = {

    
readFile : async function(filePath){
    const records = parse(fs.readFileSync(path.join(__dirname,filePath)),{
        columns:true,
        skip_empty_lines:true
        
    });

    /*for(const record of records){
       // test(`Record reading for logs> ${record.Timestamp}`, async({})=>{
        console.log(`Record reading for logs> ${record.Timestamp}`);
        console.log(record.Timestamp,record.Command,record.Message);
              
    }*/
    return records;
    },

    
////////////////////////////////////////////////////////////////////////
// Function to get file path with current time
////////////////////////////////////////////////////////////////////////


filePath: async function(tableName){
    let d = new Date();
        const filename = d.getHours() + "_" + d.getMinutes();
        const path = `../TadkaMaker/Report/'${tableName}` + '_' + filename + '.csv';
        return path;
},


////////////////////////////////////////////////////////////////////////
// Function to connect mock machine
////////////////////////////////////////////////////////////////////////


connectToMachine: async() =>{
    mockMachine.connect('wss://tadka.fun/tadkaserver');
    await sleep(500);
    //console.log("Is machine Connected:",mockMachine.isConnected());
    const connectMsg = '{"type":"message","timestamp":"-","msg":"Hi", "from":"machine","user":"tadka-1"}'
    mockMachine.sendMessage(connectMsg);
    await sleep(1000);
    const value =mockMachine.isConnected();
    return value;
    },

////////////////////////////////////////////////////////////////////////
// Function to convert 24h clock
////////////////////////////////////////////////////////////////////////

async convertTo24HourFormat(timeString) { 
        const [time, period] = timeString.split(' '); 
        const [hour, minute,second] = time.split(':'); 
        let formattedHour = parseInt(hour); 
      
        if (period === 'PM') { 
            formattedHour += 12; 
        } 
      
        return `${formattedHour}:${minute}:${second}`; 
    } ,

////////////////////////////////////////////////////////////////////////
// Function to delete old reports
////////////////////////////////////////////////////////////////////////


    async deletOldReport(){
        var allfiles = fs.readdirSync('../TadkaMaker/Report/');
        console.log(allfiles);
        for(let i=0; i<allfiles.length;i++){
            const file = allfiles[i];
            const path = "../TadkaMaker/Report/"+file;
            try {
                fs.unlinkSync(path);
              
                console.log("Delete File successfully.");
            } catch (error) {
                console.log(error);
            }
            
        }
    }

}
