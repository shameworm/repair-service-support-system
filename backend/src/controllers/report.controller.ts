import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/custom';
import { HttpError } from '../models/http-error';
import { Report } from '../models/report.schema';
import { Equipment } from '../models/equipment.schema';
import { Technician } from '../models/technician.schema';
import { generatePDF, deletePDF } from '../utils/reports.file.management';

export const getReports = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.user?.isAdmin ? {} : { technician: req.user?._id };
    const reports = await Report.find(query)
      .populate('maintenance')
      .populate('equipment')
      .populate('technician');
    res.json(reports);
  } catch (error: any) {
    return next(
      new HttpError('Failed to fetch reports: ' + error.message, 500)
    );
  }
};

export const createReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, type, details, maintenanceId, equipmentId } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return next(new HttpError('Equipment not found', 404));
    }

    let finalTechnicianId = req.user?._id;

    if (req.user?.isAdmin && req.body.technicianId) {
      const technician = await Technician.findById(req.body.technicianId);
      if (!technician) {
        return next(new HttpError('Technician not found', 404));
      }
      finalTechnicianId = req.body.technicianId;
    }

    const newReport = new Report({
      date,
      type,
      details,
      maintenance: maintenanceId,
      equipment: equipmentId,
      technician: finalTechnicianId
    });

    await newReport.save();

    const populatedReport = await Report.populate(
      newReport,
      'maintenance equipment technician'
    );
    await generatePDF(populatedReport, `report-${populatedReport._id}.pdf`);

    res.status(201).json(populatedReport);
  } catch (error: any) {
    return next(
      new HttpError('Failed to create report: ' + error.message, 500)
    );
  }
};

export const updateReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { date, type, details, maintenanceId, equipmentId } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return next(new HttpError('Report not found', 404));
    }

    if (
      !req.user?.isAdmin &&
      report.technician.toString() !== req.user?._id.toString()
    ) {
      return next(new HttpError('Not authorized to update this report', 403));
    }

    if (equipmentId) {
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return next(new HttpError('Equipment not found', 404));
      }
      report.equipment = equipmentId;
    }

    report.date = date || report.date;
    report.type = type || report.type;
    report.details = details || report.details;

    await report.save();

    await generatePDF(report, `report-${report._id}.pdf`);
    const updatedReport = await Report.populate(
      report,
      'maintance equipment technician'
    );

    res.json(updatedReport);
  } catch (error: any) {
    return next(
      new HttpError('Failed to update report: ' + error.message, 500)
    );
  }
};

export const deleteReport = async (
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

    if (
      !req.user?.isAdmin &&
      report.technician.toString() !== req.user?._id.toString()
    ) {
      return next(new HttpError('Not authorized to delete this report', 403));
    }

    await report.deleteOne();

    await deletePDF(`report-${report._id}.pdf`);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    return next(
      new HttpError('Failed to delete report: ' + error.message, 500)
    );
  }
};
