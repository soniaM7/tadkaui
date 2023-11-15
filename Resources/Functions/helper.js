/*const {test} = require('@playwright/test');
const {fs}= require('fs');
const {path} = require('path');
const {parse}= require('csv-parse/sync');
*/
import fs from 'fs';
import path from'path';
import {parse} from 'csv-parse/sync';
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

filePath: async function(){
    let d = new Date();
        const filename = d.getHours() + "_" + d.getMinutes();
        const path = '../TadkaMaker/user_Report/report'+filename+'.csv';
        return path;
}

}

/*

getExcelRowValues: async function (filePath, rowNumber,sheetName) {
    const workbook = new ExcelJS.Workbook();
    console.log("creator :" + workbook.creator)
    return workbook.xlsx.readFile(filePath)
        .then(async function () {
            const worksheet = workbook.getWorksheet(sheetName);
            console.log("sheet :" + worksheet)
            const row = worksheet.getRow(rowNumber);
            const values = row.values;
            return values;
        });
}*/