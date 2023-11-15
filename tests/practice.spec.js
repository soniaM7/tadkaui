import fs from 'fs';
import path from'path';
import {parse} from 'csv-parse/sync';
const {test} = require('@playwright/test');





/*
const records = parse(fs.readFileSync(path.join(__dirname,'../user_Report/file3.xlsx')),{
    columns:true,
    skip_empty_lines:true
});

console.log("Number of rows are: ",records.length);

for(let i=0; i<=records.length; i++){
  console.log(records[i]);
}*/

/*
for(const record of records){
  test(`Record reading for logs> ${record.Timestamp}`, async({})=>{
      await test.step('reading', () => {
        console.log(record.Timestamp,record.Command,record.Message);
        
   });
      })};*/


      /*  Function to read value from xlsx file.

      const {getExcelRowValues} = require('../Resources/Functions/resources');

      const {test} = require('@playwright/test');

      const filePath = 'C:/Users/Public/recipe.xlsx';

    test('Read', async ()=>{
      const headers = await getExcelRowValues(filePath, 2,"Sheet1");
      headers.shift();
      console.log("Column headers in excel are as follows:",headers);
        
    })*/
