import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { Report } from '../models/report.schema';
import { AuthRequest } from '../types/custom';
import { NextFunction, Response } from 'express';
import { HttpError } from '../models/http-error';

const REPORTS_DIR = path.resolve(__dirname, '../../public/files/reports');

export const generatePDF = (reportData: any, filename: string) => {
  // Переконайтесь, що файл має розширення .pdf
  if (!filename.endsWith('.pdf')) {
    filename += '.pdf';
  }

  const filePath = path.join(REPORTS_DIR, filename);
  const formattedDate = new Intl.DateTimeFormat('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(reportData.date));

  // Перевірка, чи не є файл директорією
  if (!fs.existsSync(filePath)) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  const doc = new PDFDocument({ margin: 50 });

  const fontPath = path.resolve('./src/fonts/Roboto-Regular.ttf');
  console.log(fontPath);
  doc.registerFont('Roboto', fontPath);
  doc.font('Roboto');

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Звіт', { align: 'center' }).moveDown(1);

  doc
    .fontSize(12)
    .text(`Дата: ${formattedDate}`, { align: 'right' })
    .moveDown(1);

  doc.moveDown(2).fontSize(14).text(`${reportData.details}`, { align: 'left' });

  doc.moveDown(2);

  createTable(doc, 'Деталі Обладнання', [
    { field: 'Назва', value: reportData.equipment?.name || 'N/A' },
    { field: 'Тип', value: reportData.equipment?.type || 'N/A' },
    { field: 'Статус', value: reportData.equipment?.status || 'N/A' }
  ]);

  createTable(doc, 'Деталі Обслуговування', [
    { field: 'Дата', value: reportData.maintenance?.date || 'N/A' },
    { field: 'Тип', value: reportData.maintenance?.type || 'N/A' },
    { field: 'Статус', value: reportData.maintenance?.status || 'N/A' }
  ]);

  doc
    .moveTo(50, doc.page.height - 100)
    .fontSize(12)
    .text(
      `Технік: ${reportData.technician?.name || 'Н/Д'}\n` +
        `${reportData.technician?.specialization || 'Н/Д'}\n` +
        `${reportData.technician?.contactInfo || 'Н/Д'}`,
      50,
      doc.page.height - 100,
      { align: 'left' }
    );
  doc.text(`Тип: ${reportData.type}`, 50, doc.y - 15, { align: 'right' });

  doc.end();
  return filePath;
};

const createTable = (doc: PDFKit.PDFDocument, title: string, data: any[]) => {
  doc.fontSize(16).text(title, { align: 'left' }).moveDown(0.5);

  const startX = 50;
  const startY = doc.y;
  const columnGap = 150;
  const rowHeight = 20;

  doc
    .fontSize(12)
    .text('Поле', startX, startY)
    .text('Значення', startX + columnGap, startY);

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

export const deletePDF = async (filename: string) => {
  const filePath = path.join(REPORTS_DIR, filename);

  try {
    fs.unlink(filePath, () => {});
    console.log(`PDF deleted: ${filePath}`);
  } catch (error: any) {
    console.error(`Failed to delete PDF: ${filePath} - ${error.message}`);
  }
};

export const getPdfReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);

    if (!report) {
      return next(new HttpError('Report not found', 404));
    }

    const filename = `report-${report._id}.pdf`;
    const filePath = path.join(REPORTS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return next(new HttpError('PDF not found', 404));
    }

    const isDownload = req.query.download === 'true';

    if (isDownload) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );
      res.setHeader('Content-Type', 'application/pdf');
    } else {
      res.setHeader('Content-Type', 'application/pdf');
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    return next(new HttpError('Failed to fetch PDF: ' + error.message, 500));
  }
};
