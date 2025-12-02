import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'attached_assets/Hemitech_RAB_1764669277951.xlsx';

try {
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

  console.log('Sheets:', workbook.SheetNames);

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0, defval: null });
    console.log(JSON.stringify(data.slice(0, 5), null, 2));
  });

} catch (error) {
  console.error('Error reading file:', error);
}
