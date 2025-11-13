/**
 * Ticket Controller
 */

import { Request, Response, NextFunction } from 'express';
import * as ticketService from '../services/ticketService';

export const generateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const { ticketId, pdfBuffer } = await ticketService.generateTicket(bookingId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticketId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const getTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.getTicketById(id);

    res.status(200).json({
      status: 'success',
      data: { ticket },
    });
  } catch (error) {
    next(error);
  }
};
