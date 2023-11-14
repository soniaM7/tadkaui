const ExcelJS = require('exceljs');
const assert = require("assert");

////////////////////////////////////////////////////////////////////////
// Imports and declarations
////////////////////////////////////////////////////////////////////////

//const {global} = require("../../Resources/constantUtils");


//const { Document, Packer, Paragraph, TextRun, Table, TableOfContents }  = require("docx");
module.exports = {

////////////////////////////////////////////////////////////////////////
// Function to sleep the execution for specified time
//////////////////////////////////////////////////////////////////////// 
    sleep : function(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
    },
////////////////////////////////////////////////////////////////////////
// Function to sleep the execution for 1 sec
//////////////////////////////////////////////////////////////////////// 
    sleep1Sec : function() {
        return new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      },
////////////////////////////////////////////////////////////////////////
// Function to get Values from Excel Row
////////////////////////////////////////////////////////////////////////
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
}
}
