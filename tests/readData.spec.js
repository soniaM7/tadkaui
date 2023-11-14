const {test} =require('@playwright/test');
const ExcelJS = require('exceljs');


test("reading data",async ()=>{
    const workbook = new ExcelJS.Workbook();
    const workbook1 = await workbook.xlsx.readFile('../user_Report/');
    const worksheet = workbook1.getWorksheet('recipe.csv');
    const cellValue = worksheet.getCell('A1').value;
    console.log(cellValue);


})