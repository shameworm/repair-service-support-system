import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';

export const generatePDF = (reportData: any, action: string) => {
  const reportsDir = path.resolve('./src/reports');
  const filePath = path.join(
    reportsDir,
    `${reportData._id.toString()}-${action}.pdf`
  );
  console.log(reportData, action);

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fontSize(20)
    .text(`${action.charAt(0).toUpperCase() + action.slice(1)} Report`, {
      align: 'center'
    })
    .moveDown(1);

  doc
    .fontSize(12)
    .text(`Date: ${reportData.date}`, { align: 'right' })
    .moveDown(1);

  doc.text(`Type: ${reportData.type}`, 50, doc.y - 15, { align: 'left' });

  doc
    .moveDown(2)
    .fontSize(14)
    .text(`Details: ${reportData.details}`, { align: 'center' });

  // Technician - Bottom Right Corner
  doc.fontSize(12).text(`Technician: ${reportData.technician}`, {
    align: 'right',
    continued: false
  });

  doc.moveDown(2);

  createTable(doc, 'Equipment Details', reportData.equipment);
  doc.moveDown(2);
  createTable(doc, 'Maintenance Details', reportData.maintenance);

  doc.end();
  return filePath;
};

const createTable = (doc: PDFKit.PDFDocument, title: string, data: any[]) => {
  if (!Array.isArray(data)) {
    doc
      .fontSize(12)
      .text(`No ${title.toLowerCase()} data available.`, { align: 'left' });
    doc.moveDown();
    return;
  }

  doc.fontSize(16).text(title, { align: 'left' }).moveDown(0.5);

  const startX = 50;
  const startY = doc.y;
  const columnGap = 150;
  const rowHeight = 20;

  doc
    .fontSize(12)
    .text('Field', startX, startY)
    .text('Value', startX + columnGap, startY);

  doc
    .moveTo(startX, startY + 15)
    .lineTo(startX + 400, startY + 15)
    .stroke();

  let y = startY + 20;
  data.forEach((item: { field: string; value: string }) => {
    doc
      .fontSize(10)
      .text(item.field || 'N/A', startX, y)
      .text(item.value || 'N/A', startX + columnGap, y);
    y += rowHeight;
  });

  doc.y = y;
};
