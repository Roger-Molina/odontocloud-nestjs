import { DataSource } from "typeorm";
import { InvoiceStatus } from "../../modules/billing/entities/invoice-status.entity";
import { PaymentMethod } from "../../modules/billing/entities/payment-method.entity";
import { InvoiceType } from "../../modules/billing/entities/invoice-type.entity";
import { PaymentStatus } from "../../modules/billing/entities/payment-status.entity";
import { DiscountType } from "../../modules/billing/entities/discount-type.entity";

export class SeedBillingCatalogs {
  public async run(dataSource: DataSource): Promise<void> {
    // Seed Invoice Statuses
    const invoiceStatusRepository = dataSource.getRepository(InvoiceStatus);
    const invoiceStatuses = [
      {
        code: "DRAFT",
        name: "Borrador",
        description: "Factura en borrador, aún no enviada",
        colorHex: "#6c757d",
        displayOrder: 1,
        isFinal: false,
        requiresPayment: false,
      },
      {
        code: "PENDING",
        name: "Pendiente",
        description: "Factura enviada, pendiente de pago",
        colorHex: "#ffc107",
        displayOrder: 2,
        isFinal: false,
        requiresPayment: true,
      },
      {
        code: "PARTIALLY_PAID",
        name: "Parcialmente Pagada",
        description: "Factura con pago parcial",
        colorHex: "#17a2b8",
        displayOrder: 3,
        isFinal: false,
        requiresPayment: true,
      },
      {
        code: "PAID",
        name: "Pagada",
        description: "Factura completamente pagada",
        colorHex: "#28a745",
        displayOrder: 4,
        isFinal: true,
        requiresPayment: false,
      },
      {
        code: "OVERDUE",
        name: "Vencida",
        description: "Factura vencida sin pago",
        colorHex: "#dc3545",
        displayOrder: 5,
        isFinal: false,
        requiresPayment: true,
      },
      {
        code: "CANCELLED",
        name: "Cancelada",
        description: "Factura cancelada",
        colorHex: "#6c757d",
        displayOrder: 6,
        isFinal: true,
        requiresPayment: false,
      },
      {
        code: "REFUNDED",
        name: "Reembolsada",
        description: "Factura reembolsada",
        colorHex: "#fd7e14",
        displayOrder: 7,
        isFinal: true,
        requiresPayment: false,
      },
    ];

    for (const status of invoiceStatuses) {
      const existingStatus = await invoiceStatusRepository.findOne({
        where: { code: status.code },
      });
      if (!existingStatus) {
        await invoiceStatusRepository.save(status);
        console.log(`✅ Invoice Status created: ${status.name}`);
      }
    }

    // Seed Payment Methods
    const paymentMethodRepository = dataSource.getRepository(PaymentMethod);
    const paymentMethods = [
      {
        code: "CASH",
        name: "Efectivo",
        description: "Pago en efectivo",
        displayOrder: 1,
        requiresAuthorization: false,
        requiresReference: false,
        processingFeePercentage: 0,
        processingFeeFixed: 0,
        iconClass: "pi pi-money-bill",
      },
      {
        code: "CREDIT_CARD",
        name: "Tarjeta de Crédito",
        description: "Pago con tarjeta de crédito",
        displayOrder: 2,
        requiresAuthorization: true,
        requiresReference: true,
        processingFeePercentage: 3.5,
        processingFeeFixed: 0,
        iconClass: "pi pi-credit-card",
      },
      {
        code: "DEBIT_CARD",
        name: "Tarjeta de Débito",
        description: "Pago con tarjeta de débito",
        displayOrder: 3,
        requiresAuthorization: true,
        requiresReference: true,
        processingFeePercentage: 2.0,
        processingFeeFixed: 0,
        iconClass: "pi pi-credit-card",
      },
      {
        code: "BANK_TRANSFER",
        name: "Transferencia Bancaria",
        description: "Transferencia bancaria",
        displayOrder: 4,
        requiresAuthorization: false,
        requiresReference: true,
        processingFeePercentage: 0,
        processingFeeFixed: 50,
        iconClass: "pi pi-building",
      },
      {
        code: "INSURANCE",
        name: "Seguro Médico",
        description: "Pago a través de seguro médico",
        displayOrder: 5,
        requiresAuthorization: true,
        requiresReference: true,
        processingFeePercentage: 0,
        processingFeeFixed: 0,
        iconClass: "pi pi-shield",
      },
      {
        code: "CHECK",
        name: "Cheque",
        description: "Pago con cheque",
        displayOrder: 6,
        requiresAuthorization: false,
        requiresReference: true,
        processingFeePercentage: 0,
        processingFeeFixed: 0,
        iconClass: "pi pi-file",
      },
      {
        code: "PAYMENT_PLAN",
        name: "Plan de Pagos",
        description: "Pago mediante plan de cuotas",
        displayOrder: 7,
        requiresAuthorization: true,
        requiresReference: false,
        processingFeePercentage: 0,
        processingFeeFixed: 0,
        iconClass: "pi pi-calendar",
      },
    ];

    for (const method of paymentMethods) {
      const existingMethod = await paymentMethodRepository.findOne({
        where: { code: method.code },
      });
      if (!existingMethod) {
        await paymentMethodRepository.save(method);
        console.log(`✅ Payment Method created: ${method.name}`);
      }
    }

    // Seed Invoice Types
    const invoiceTypeRepository = dataSource.getRepository(InvoiceType);
    const invoiceTypes = [
      {
        code: "TREATMENT",
        name: "Tratamiento",
        description: "Factura por tratamiento odontológico",
        displayOrder: 1,
        defaultTaxRate: 19.0,
        requiresAppointment: true,
        colorHex: "#007bff",
        iconClass: "pi pi-heart",
      },
      {
        code: "CONSULTATION",
        name: "Consulta",
        description: "Factura por consulta médica",
        displayOrder: 2,
        defaultTaxRate: 19.0,
        requiresAppointment: true,
        colorHex: "#28a745",
        iconClass: "pi pi-user-plus",
      },
      {
        code: "EMERGENCY",
        name: "Emergencia",
        description: "Factura por atención de emergencia",
        displayOrder: 3,
        defaultTaxRate: 19.0,
        requiresAppointment: false,
        colorHex: "#dc3545",
        iconClass: "pi pi-exclamation-triangle",
      },
      {
        code: "PREVENTIVE",
        name: "Preventivo",
        description: "Factura por tratamiento preventivo",
        displayOrder: 4,
        defaultTaxRate: 19.0,
        requiresAppointment: true,
        colorHex: "#17a2b8",
        iconClass: "pi pi-shield",
      },
      {
        code: "AESTHETIC",
        name: "Estético",
        description: "Factura por tratamiento estético",
        displayOrder: 5,
        defaultTaxRate: 19.0,
        requiresAppointment: true,
        colorHex: "#6f42c1",
        iconClass: "pi pi-star",
      },
      {
        code: "ORTHODONTICS",
        name: "Ortodoncia",
        description: "Factura por tratamiento de ortodoncia",
        displayOrder: 6,
        defaultTaxRate: 19.0,
        requiresAppointment: true,
        colorHex: "#fd7e14",
        iconClass: "pi pi-cog",
      },
      {
        code: "SURGERY",
        name: "Cirugía",
        description: "Factura por procedimiento quirúrgico",
        displayOrder: 7,
        defaultTaxRate: 19.0,
        requiresAppointment: true,
        colorHex: "#e83e8c",
        iconClass: "pi pi-plus",
      },
    ];

    for (const type of invoiceTypes) {
      const existingType = await invoiceTypeRepository.findOne({
        where: { code: type.code },
      });
      if (!existingType) {
        await invoiceTypeRepository.save(type);
        console.log(`✅ Invoice Type created: ${type.name}`);
      }
    }

    // Seed Payment Statuses
    const paymentStatusRepository = dataSource.getRepository(PaymentStatus);
    const paymentStatuses = [
      {
        code: "PENDING",
        name: "Pendiente",
        description: "Pago pendiente de procesamiento",
        colorHex: "#ffc107",
        displayOrder: 1,
        isFinal: false,
        allowsRefund: false,
      },
      {
        code: "COMPLETED",
        name: "Completado",
        description: "Pago procesado exitosamente",
        colorHex: "#28a745",
        displayOrder: 2,
        isFinal: true,
        allowsRefund: true,
      },
      {
        code: "FAILED",
        name: "Fallido",
        description: "Pago falló en el procesamiento",
        colorHex: "#dc3545",
        displayOrder: 3,
        isFinal: true,
        allowsRefund: false,
      },
      {
        code: "CANCELLED",
        name: "Cancelado",
        description: "Pago cancelado por el usuario",
        colorHex: "#6c757d",
        displayOrder: 4,
        isFinal: true,
        allowsRefund: false,
      },
      {
        code: "REFUNDED",
        name: "Reembolsado",
        description: "Pago reembolsado al cliente",
        colorHex: "#fd7e14",
        displayOrder: 5,
        isFinal: true,
        allowsRefund: false,
      },
    ];

    for (const status of paymentStatuses) {
      const existingStatus = await paymentStatusRepository.findOne({
        where: { code: status.code },
      });
      if (!existingStatus) {
        await paymentStatusRepository.save(status);
        console.log(`✅ Payment Status created: ${status.name}`);
      }
    }

    // Seed Discount Types
    const discountTypeRepository = dataSource.getRepository(DiscountType);
    const discountTypes = [
      {
        code: "PERCENTAGE",
        name: "Descuento Porcentual",
        description: "Descuento basado en porcentaje",
        displayOrder: 1,
        isPercentage: true,
        maxDiscountPercentage: 50.0,
        requiresApproval: true,
        colorHex: "#28a745",
        iconClass: "pi pi-percentage",
      },
      {
        code: "FIXED_AMOUNT",
        name: "Descuento Fijo",
        description: "Descuento por monto fijo",
        displayOrder: 2,
        isPercentage: false,
        maxDiscountAmount: 50000.0,
        requiresApproval: true,
        colorHex: "#17a2b8",
        iconClass: "pi pi-dollar",
      },
      {
        code: "INSURANCE_COVERAGE",
        name: "Cobertura de Seguro",
        description: "Descuento por cobertura de seguro médico",
        displayOrder: 3,
        isPercentage: true,
        maxDiscountPercentage: 100.0,
        requiresApproval: false,
        colorHex: "#6f42c1",
        iconClass: "pi pi-shield",
      },
      {
        code: "FAMILY_DISCOUNT",
        name: "Descuento Familiar",
        description: "Descuento para grupos familiares",
        displayOrder: 4,
        isPercentage: true,
        maxDiscountPercentage: 15.0,
        requiresApproval: false,
        colorHex: "#fd7e14",
        iconClass: "pi pi-users",
      },
      {
        code: "EMPLOYEE_DISCOUNT",
        name: "Descuento de Empleado",
        description: "Descuento para empleados de la clínica",
        displayOrder: 5,
        isPercentage: true,
        maxDiscountPercentage: 25.0,
        requiresApproval: false,
        colorHex: "#20c997",
        iconClass: "pi pi-id-card",
      },
      {
        code: "SENIOR_DISCOUNT",
        name: "Descuento Tercera Edad",
        description: "Descuento para adultos mayores",
        displayOrder: 6,
        isPercentage: true,
        maxDiscountPercentage: 10.0,
        requiresApproval: false,
        colorHex: "#6c757d",
        iconClass: "pi pi-heart",
      },
    ];

    for (const discount of discountTypes) {
      const existingDiscount = await discountTypeRepository.findOne({
        where: { code: discount.code },
      });
      if (!existingDiscount) {
        await discountTypeRepository.save(discount);
        console.log(`✅ Discount Type created: ${discount.name}`);
      }
    }

    console.log("🎉 Billing catalogs seeded successfully!");
  }
}
