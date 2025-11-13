/**
 * PDF Generation Utility
 * Handles ticket PDF generation with QR code (UC10)
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

export interface TicketData {
  ticketId: string;
  bookingCode: string;
  customerName: string;
  movieTitle: string;
  screeningTime: string;
  auditoriumName: string;
  seats: string[];
  totalAmount: number;
  qrCodeData: string;
}

/**
 * Generate ticket PDF with QR code
 * Returns PDF buffer that can be saved or sent via email
 */
export const generateTicketPDF = async (ticketData: TicketData): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate QR code as base64 image
      const qrCodeImage = await QRCode.toDataURL(ticketData.qrCodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks: Buffer[] = [];

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header - Theatre name
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('THEATRE MANAGEMENT SYSTEM', { align: 'center' })
        .moveDown(0.5);

      doc
        .fontSize(18)
        .fillColor('#FF6B6B')
        .text('E-TICKET', { align: 'center' })
        .fillColor('#000000')
        .moveDown(1);

      // Divider line
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Movie details
      doc.fontSize(16).font('Helvetica-Bold').text('Movie Details', { underline: true }).moveDown(0.5);

      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Movie: ${ticketData.movieTitle}`, { continued: false })
        .moveDown(0.3);

      doc.text(`Showtime: ${ticketData.screeningTime}`).moveDown(0.3);
      doc.text(`Screen: ${ticketData.auditoriumName}`).moveDown(0.3);
      doc.text(`Seats: ${ticketData.seats.join(', ')}`).moveDown(1);

      // Customer details
      doc.fontSize(16).font('Helvetica-Bold').text('Booking Details', { underline: true }).moveDown(0.5);

      doc.fontSize(12).font('Helvetica').text(`Name: ${ticketData.customerName}`).moveDown(0.3);

      doc.text(`Booking Code: ${ticketData.bookingCode}`).moveDown(0.3);
      doc.text(`Ticket ID: ${ticketData.ticketId}`).moveDown(0.3);
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text(`Total Amount: ₹${ticketData.totalAmount}`, { underline: true })
        .moveDown(1.5);

      // QR Code
      doc.fontSize(16).font('Helvetica-Bold').text('Scan for Entry', { align: 'center' }).moveDown(0.5);

      // Add QR code image (base64)
      const qrBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
      doc.image(qrBuffer, {
        fit: [200, 200],
        align: 'center',
      });
      doc.moveDown(2);

      // Footer - Important information
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica').fillColor('#666666').text('Important Information:', { underline: true });

      doc.fontSize(9).text('• Please arrive 15 minutes before showtime', { indent: 10 });
      doc.text('• Carry a valid ID proof along with this ticket', { indent: 10 });
      doc.text('• Food and beverages from outside are not allowed', { indent: 10 });
      doc.text('• This ticket is non-refundable and non-transferable', { indent: 10 });
      doc.moveDown(1);

      doc.fontSize(8).fillColor('#999999').text('Generated on: ' + new Date().toLocaleString(), { align: 'center' });

      doc
        .fontSize(8)
        .text('For queries, contact: support@theatre.com | +91-1234567890', { align: 'center' })
        .moveDown(0.5);

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate QR code as data URL (for storage in database)
 */
export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};
