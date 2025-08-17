import { Injectable } from "@nestjs/common";
import { Budget } from "../../modules/budgets/budget.entity";
import * as PDFDocument from "pdfkit";

@Injectable()
export class PdfService {
  constructor() {
    console.log("[PdfService] PDFKit service initialized successfully");
  }

  async generateBudgetPdf(budget: Budget): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        console.log("[PdfService] Starting PDF generation for budget:", budget.id);
        
        // Crear un nuevo documento PDF
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
        });

        const chunks: Buffer[] = [];
        
        // Capturar los datos del PDF
        doc.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        doc.on("end", () => {
          const result = Buffer.concat(chunks);
          console.log("[PdfService] PDF generated successfully, size:", result.length, "bytes");
          resolve(result);
        });

        doc.on("error", (error: Error) => {
          console.error("[PdfService] PDF generation error:", error);
          reject(error);
        });

        // Generar el contenido del PDF
        this.generatePdfContent(doc, budget, "PRESUPUESTO");
        
        // Finalizar el documento
        doc.end();
        
      } catch (error) {
        console.error("[PdfService] Error creating PDF:", error);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  async generateInvoicePdf(invoice: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        console.log("[PdfService] Starting PDF generation for invoice:", invoice.id);
        
        // Crear un nuevo documento PDF
        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
        });

        const chunks: Buffer[] = [];
        
        // Capturar los datos del PDF
        doc.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        doc.on("end", () => {
          const result = Buffer.concat(chunks);
          console.log("[PdfService] Invoice PDF generated successfully, size:", result.length, "bytes");
          resolve(result);
        });

        doc.on("error", (error: Error) => {
          console.error("[PdfService] Invoice PDF generation error:", error);
          reject(error);
        });

        // Generar el contenido del PDF
        this.generatePdfContent(doc, invoice, "FACTURA");
        
        // Finalizar el documento
        doc.end();
        
      } catch (error) {
        console.error("[PdfService] Error creating invoice PDF:", error);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private generatePdfContent(doc: PDFKit.PDFDocument, document: any, documentType: string = "PRESUPUESTO"): void {
    const pageWidth = doc.page.width - 100; // Considering margins
    
    // Header
    doc.fontSize(20)
       .font("Helvetica-Bold")
       .text(documentType, 50, 50, { align: "center" });

    // Document info
    doc.fontSize(12)
       .font("Helvetica")
       .text(`Número: ${document.budgetNumber || document.invoiceNumber || "N/A"}`, 50, 100)
       .text(`Fecha: ${new Date(document.createdAt).toLocaleDateString("es-ES")}`, 50, 115);

    // Solo mostrar "Válido hasta" para presupuestos
    let currentY = 130;
    if (documentType === "PRESUPUESTO" && document.validUntil) {
      doc.text(`Válido hasta: ${new Date(document.validUntil).toLocaleDateString("es-ES")}`, 50, currentY);
      currentY += 15;
    }

    // Patient info
    if (document.patient) {
      doc.fontSize(14)
         .font("Helvetica-Bold")
         .text("INFORMACIÓN DEL PACIENTE", 50, currentY + 30);
      
      currentY += 50;
      doc.fontSize(11)
         .font("Helvetica")
         .text(`Nombre: ${document.patient.firstName} ${document.patient.firstLastName} ${document.patient.secondLastName || ""}`, 50, currentY)
         .text(`Documento: ${document.patient.documentNumber}`, 50, currentY + 15)
         .text(`Teléfono: ${document.patient.phoneNumber || "N/A"}`, 50, currentY + 30);
      
      currentY += 45;
    }

    // Title and description
    if (document.title) {
      doc.fontSize(14)
         .font("Helvetica-Bold")
         .text("DESCRIPCIÓN", 50, currentY + 20);
      
      currentY += 40;
      doc.fontSize(11)
         .font("Helvetica")
         .text(`Título: ${document.title}`, 50, currentY);
      
      currentY += 15;
      if (document.description) {
        doc.text(`Descripción: ${document.description}`, 50, currentY);
        currentY += 15;
      }
    }

    // Items table
    let yPosition = currentY + 30;
    
    if (document.items && document.items.length > 0) {
      doc.fontSize(14)
         .font("Helvetica-Bold")
         .text("TRATAMIENTOS", 50, yPosition);
      
      yPosition += 25;

      // Table headers
      doc.fontSize(10)
         .font("Helvetica-Bold")
         .text("Tratamiento", 50, yPosition)
         .text("Cant.", 250, yPosition)
         .text("Precio Unit.", 300, yPosition)
         .text("Desc.", 380, yPosition)
         .text("Total", 430, yPosition);

      yPosition += 20;

      // Draw header line
      doc.moveTo(50, yPosition - 5)
         .lineTo(500, yPosition - 5)
         .stroke();

      // Items
      doc.font("Helvetica");
      document.items.forEach((item) => {
        const treatmentName = item.description || "N/A";
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unitPrice) || 0;
        const discountAmount = Number(item.discountAmount) || 0;
        const total = Number(item.totalPrice) || 0;

        // Calcular el porcentaje de descuento si hay descuento
        const discountPercent = unitPrice > 0 && discountAmount > 0 
          ? ((discountAmount / (unitPrice * quantity)) * 100).toFixed(1)
          : "0";

        doc.text(treatmentName.substring(0, 30), 50, yPosition)
           .text(quantity.toString(), 250, yPosition)
           .text(`L. ${unitPrice.toFixed(2)}`, 300, yPosition)
           .text(`${discountPercent}%`, 380, yPosition)
           .text(`L. ${total.toFixed(2)}`, 430, yPosition);

        yPosition += 20;

        // Check if we need a new page
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
      });

      // Draw line before totals
      yPosition += 10;
      doc.moveTo(300, yPosition)
         .lineTo(500, yPosition)
         .stroke();

      yPosition += 20;

      // Totals
      const subtotal = Number(document.subtotal) || 0;
      const discountAmount = Number(document.discountAmount) || 0;
      const taxAmount = Number(document.taxAmount) || 0;
      const finalTotal = Number(document.totalAmount) || 0;

      doc.fontSize(11)
         .font("Helvetica")
         .text("Subtotal:", 350, yPosition)
         .text(`L. ${subtotal.toFixed(2)}`, 430, yPosition);

      if (discountAmount > 0) {
        yPosition += 15;
        doc.text("Descuento:", 350, yPosition)
           .text(`-L. ${discountAmount.toFixed(2)}`, 430, yPosition);
      }

      if (taxAmount > 0) {
        yPosition += 15;
        doc.text("Impuestos:", 350, yPosition)
           .text(`L. ${taxAmount.toFixed(2)}`, 430, yPosition);
      }

      yPosition += 15;
      doc.fontSize(12)
         .font("Helvetica-Bold")
         .text("TOTAL:", 350, yPosition)
         .text(`L. ${finalTotal.toFixed(2)}`, 430, yPosition);
    }

    // Notes
    if (document.notes) {
      yPosition += 40;
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }

      doc.fontSize(12)
         .font("Helvetica-Bold")
         .text("NOTAS:", 50, yPosition);

      yPosition += 20;
      doc.fontSize(10)
         .font("Helvetica")
         .text(document.notes, 50, yPosition, {
           width: pageWidth,
           align: "left",
         });
    }

    // Footer
    const footerY = doc.page.height - 100;
    doc.fontSize(8)
       .font("Helvetica");
    
    if (documentType === "PRESUPUESTO") {
      doc.text("Este presupuesto es válido por 30 días desde la fecha de emisión.", 50, footerY, {
        align: "center",
        width: pageWidth,
      });
    } else {
      doc.text("Factura generada el " + new Date().toLocaleDateString("es-ES"), 50, footerY, {
        align: "center",
        width: pageWidth,
      });
    }
  }
}
