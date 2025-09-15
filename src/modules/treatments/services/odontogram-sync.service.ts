import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BudgetItem } from "../../budgets/budget-item.entity";
import { InvoiceItem } from "../../billing/entities/billing.entity";
import { ToothRecord } from "../../odontograma/entities/odontogram.entity";
import { ClinicTreatmentPrice } from "../entities/clinic-treatment-price.entity";

@Injectable()
export class OdontogramSyncService {
  constructor(
    @InjectRepository(BudgetItem)
    private budgetItemRepository: Repository<BudgetItem>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(ToothRecord)
    private toothRecordRepository: Repository<ToothRecord>,
    @InjectRepository(ClinicTreatmentPrice)
    private clinicTreatmentPriceRepository: Repository<ClinicTreatmentPrice>,
  ) {}

  /**
   * Crear item de presupuesto desde registro de odontograma
   */
  async createBudgetItemFromToothRecord(
    toothRecordId: number,
    budgetId: number,
  ): Promise<BudgetItem> {
    const toothRecord = await this.toothRecordRepository.findOne({
      where: { id: toothRecordId },
      relations: ["treatment", "odontogram"],
    });

    if (!toothRecord) {
      throw new NotFoundException("Registro de diente no encontrado");
    }

    // Buscar precio de la clínica para el tratamiento
    const clinicTreatmentPrice =
      await this.clinicTreatmentPriceRepository.findOne({
        where: {
          clinicId: toothRecord.odontogram.patient.id, // Asumir que el paciente tiene clinicId
          treatmentId: toothRecord.treatmentId,
          isActive: true,
        },
      });

    const unitPrice = clinicTreatmentPrice?.basePrice || toothRecord.costEstimate || 0;

    const budgetItem = this.budgetItemRepository.create({
      budgetId,
      treatmentId: toothRecord.treatmentId,
      treatmentName: toothRecord.treatment?.name || "Tratamiento",
      description: toothRecord.notes || "",
      quantity: 1,
      unitPrice,
      total: unitPrice,
      toothNumbers: [toothRecord.toothNumber],
      toothSurfaces: toothRecord.affectedSurfaces || [],
      odontogramToothRecordId: toothRecord.id,
      clinicTreatmentPriceId: clinicTreatmentPrice?.id,
      sessionsRequired: clinicTreatmentPrice?.estimatedSessions || 1,
      priorityLevel: toothRecord.priorityLevel,
      requiresAnesthesia: clinicTreatmentPrice?.requiresAnesthesia || false,
      treatmentNotes: toothRecord.notes,
    });

    return this.budgetItemRepository.save(budgetItem);
  }

  /**
   * Crear item de factura desde item de presupuesto
   */
  async createInvoiceItemFromBudgetItem(
    budgetItemId: number,
    invoiceId: number,
  ): Promise<InvoiceItem> {
    const budgetItem = await this.budgetItemRepository.findOne({
      where: { id: budgetItemId },
      relations: ["treatment", "clinicTreatmentPrice"],
    });

    if (!budgetItem) {
      throw new NotFoundException("Item de presupuesto no encontrado");
    }

    const invoiceItem = this.invoiceItemRepository.create({
      invoiceId,
      description: budgetItem.treatmentName,
      quantity: budgetItem.sessionsCompleted || 1,
      unitPrice: budgetItem.unitPrice,
      totalPrice: budgetItem.total,
      treatmentId: budgetItem.treatmentId,
      toothNumbers: budgetItem.toothNumbers?.map(String) || [],
      toothSurfaces: budgetItem.toothSurfaces || [],
      budgetItemId: budgetItem.id,
      odontogramToothRecordId: budgetItem.odontogramToothRecordId,
      clinicTreatmentPriceId: budgetItem.clinicTreatmentPriceId,
      sessionsBilled: budgetItem.sessionsCompleted || 1,
      anesthesiaUsed: budgetItem.requiresAnesthesia,
      anesthesiaCost: budgetItem.clinicTreatmentPrice?.anesthesiaCost || 0,
      materialCost: budgetItem.clinicTreatmentPrice?.materialCost || 0,
    });

    return this.invoiceItemRepository.save(invoiceItem);
  }

  /**
   * Sincronizar estado de tratamiento entre odontograma, presupuesto y facturación
   */
  async syncTreatmentStatus(
    toothRecordId: number,
    status: "pending" | "in_progress" | "completed" | "cancelled",
  ): Promise<void> {
    // Actualizar estado en tooth record
    await this.toothRecordRepository.update(toothRecordId, {
      treatmentStatus: status,
      treatmentCompletionDate: status === "completed" ? new Date() : undefined,
    });

    // Encontrar budget items relacionados
    const budgetItems = await this.budgetItemRepository.find({
      where: { odontogramToothRecordId: toothRecordId },
    });

    // Actualizar sesiones completadas si el tratamiento está completo
    if (status === "completed") {
      for (const budgetItem of budgetItems) {
        await this.budgetItemRepository.update(budgetItem.id, {
          sessionsCompleted: budgetItem.sessionsRequired,
        });
      }
    }
  }

  /**
   * Obtener resumen de sincronización para un paciente
   */
  async getSyncSummaryForPatient(patientId: number) {
    const toothRecords = await this.toothRecordRepository
      .createQueryBuilder("tr")
      .leftJoin("tr.odontogram", "o")
      .leftJoin("o.patient", "p")
      .leftJoinAndSelect("tr.treatment", "t")
      .where("p.id = :patientId", { patientId })
      .getMany();

    const budgetItems = await this.budgetItemRepository
      .createQueryBuilder("bi")
      .leftJoin("bi.budget", "b")
      .leftJoin("b.patient", "p")
      .where("p.id = :patientId", { patientId })
      .getMany();

    const invoiceItems = await this.invoiceItemRepository
      .createQueryBuilder("ii")
      .leftJoin("ii.invoice", "i")
      .leftJoin("i.patient", "p")
      .where("p.id = :patientId", { patientId })
      .getMany();

    return {
      toothRecords: toothRecords.length,
      pendingTreatments: toothRecords.filter(
        (tr) => tr.treatmentStatus === "pending",
      ).length,
      completedTreatments: toothRecords.filter(
        (tr) => tr.treatmentStatus === "completed",
      ).length,
      budgetItems: budgetItems.length,
      invoiceItems: invoiceItems.length,
      syncedRecords: toothRecords.filter((tr) => tr.budgetItemId).length,
    };
  }
}
