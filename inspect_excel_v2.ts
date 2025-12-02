import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'attached_assets/Hemitech_RAB_1764668067466.xlsx';

try {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  console.log('Sheets:', workbook.SheetNames);

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    // Get first 15 rows as JSON to see headers and data structure
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: null });
    console.log(JSON.stringify(data.slice(0, 15), null, 2));
  });

} catch (error) {
  console.error('Error reading file:', error);
}
