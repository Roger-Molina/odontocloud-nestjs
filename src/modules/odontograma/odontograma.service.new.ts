import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, Not, FindOptionsWhere } from "typeorm";
import {
  Odontogram,
  ToothRecord,
  ToothStatus,
  OdontogramStatus,
} from "./entities/odontogram.entity";
import { CreateOdontogramDto } from "./dto/create-odontogram.dto";
import { UpdateOdontogramDto } from "./dto/update-odontogram.dto";

interface FindAllOptions {
  status?: string;
  clinicId?: number;
  limit?: number;
  offset?: number;
}

@Injectable()
export class OdontogramaService {
  constructor(
    @InjectRepository(Odontogram)
    private odontogramRepository: Repository<Odontogram>,
    @InjectRepository(ToothRecord)
    private toothRecordRepository: Repository<ToothRecord>,
  ) {}

  async create(
    createOdontogramDto: CreateOdontogramDto,
    user?: any,
  ): Promise<Odontogram> {
    try {
      // Validate patient exists and basic data
      await this.validateCreateData(createOdontogramDto);

      // Verificar si ya existe un odontograma para este paciente en esta fecha
      await this.validateUniqueOdontogramPerPatientPerDate(
        createOdontogramDto.patientId,
        new Date(createOdontogramDto.examinationDate),
      );

      // Generate odontogram code
      const odontogramCode = await this.generateOdontogramCode();

      // Validate tooth records
      if (createOdontogramDto.toothRecords?.length > 0) {
        this.validateToothRecords(createOdontogramDto.toothRecords);
      }

      // Calculate statistics from tooth records
      const stats = this.calculateOdontogramStats(
        createOdontogramDto.toothRecords || [],
      );

      const odontogram = this.odontogramRepository.create({
        ...createOdontogramDto,
        examinationDate: new Date(createOdontogramDto.examinationDate),
        odontogramCode,
        status: createOdontogramDto.status || OdontogramStatus.DRAFT,
        urgencyLevel: createOdontogramDto.urgencyLevel || 1,
        totalTeethExamined: stats.totalExamined,
        healthyTeethCount: stats.healthy,
        problematicTeethCount: stats.problematic,
        treatmentRequiredCount: stats.treatmentRequired,
      });

      const savedOdontogram = await this.odontogramRepository.save(odontogram);

      // Create tooth records
      if (createOdontogramDto.toothRecords?.length > 0) {
        const toothRecords = createOdontogramDto.toothRecords.map((record) =>
          this.toothRecordRepository.create({
            ...record,
            odontogramId: savedOdontogram.id,
            priorityLevel: record.priorityLevel || 1,
            lastModifiedBy:
              (user?.email as string) || ("system" as string),
          }),
        );

        await this.toothRecordRepository.save(toothRecords);
      }

      return this.findOne(savedOdontogram.id);
    } catch (error: any) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error && "code" in error && error.code === "23505") {
        throw new ConflictException("Ya existe un odontograma con este código");
      }

      throw new InternalServerErrorException(
        "Error interno del servidor al crear el odontograma",
      );
    }
  }

  async findAll(options?: FindAllOptions): Promise<Odontogram[]> {
    try {
      const whereConditions: FindOptionsWhere<Odontogram> = {};

      if (options?.status) {
        whereConditions.status = options.status as OdontogramStatus;
      }

      const queryBuilder = this.odontogramRepository
        .createQueryBuilder("odontogram")
        .leftJoinAndSelect("odontogram.patient", "patient")
        .where(whereConditions)
        .orderBy("odontogram.examinationDate", "DESC");

      if (options?.limit) {
        queryBuilder.limit(options.limit);
      }

      if (options?.offset) {
        queryBuilder.offset(options.offset);
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        "Error interno del servidor al obtener los odontogramas",
      );
    }
  }

  async findActive(): Promise<Odontogram[]> {
    try {
      return this.odontogramRepository.find({
        where: [
          { status: OdontogramStatus.DRAFT },
          { status: OdontogramStatus.COMPLETED },
          { status: OdontogramStatus.REVIEWED },
        ],
        relations: ["patient"],
        order: { examinationDate: "DESC" },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        "Error interno del servidor al obtener los odontogramas activos",
      );
    }
  }

  async findByCode(code: string): Promise<Odontogram> {
    try {
      if (!code?.trim()) {
        throw new BadRequestException("El código del odontograma es requerido");
      }

      const odontogram = await this.odontogramRepository.findOne({
        where: { odontogramCode: code.trim() },
        relations: ["patient"],
      });

      if (!odontogram) {
        throw new NotFoundException(
          `Odontograma con código ${code} no encontrado`,
        );
      }

      // Load tooth records
      const toothRecords = await this.toothRecordRepository.find({
        where: { odontogramId: odontogram.id },
        order: { toothNumber: "ASC" },
      });

      return { ...odontogram, toothRecords } as Odontogram;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al buscar el odontograma por código",
      );
    }
  }

  async findOne(id: number): Promise<Odontogram> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException("ID del odontograma inválido");
      }

      const odontogram = await this.odontogramRepository.findOne({
        where: { id },
        relations: ["patient"],
      });

      if (!odontogram) {
        throw new NotFoundException(
          `Odontograma con ID ${id} no encontrado`,
        );
      }

      // Load tooth records
      const toothRecords = await this.toothRecordRepository.find({
        where: { odontogramId: id },
        order: { toothNumber: "ASC" },
      });

      return { ...odontogram, toothRecords } as Odontogram;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al obtener el odontograma",
      );
    }
  }

  async findByPatient(patientId: number): Promise<Odontogram[]> {
    try {
      if (!patientId || patientId <= 0) {
        throw new BadRequestException("ID del paciente inválido");
      }

      return this.odontogramRepository.find({
        where: { patientId },
        relations: ["patient"],
        order: { examinationDate: "DESC" },
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al obtener los odontogramas del paciente",
      );
    }
  }

  async findLatestByPatient(patientId: number): Promise<Odontogram | null> {
    try {
      if (!patientId || patientId <= 0) {
        throw new BadRequestException("ID del paciente inválido");
      }

      const odontogram = await this.odontogramRepository.findOne({
        where: { patientId },
        relations: ["patient"],
        order: { examinationDate: "DESC" },
      });

      if (!odontogram) {
        return null;
      }

      // Load tooth records
      const toothRecords = await this.toothRecordRepository.find({
        where: { odontogramId: odontogram.id },
        order: { toothNumber: "ASC" },
      });

      return { ...odontogram, toothRecords } as Odontogram;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error interno del servidor al obtener el último odontograma del paciente",
      );
    }
  }

  async getStatistics(clinicId?: number): Promise<any> {
    try {
      const whereConditions: FindOptionsWhere<Odontogram> = {};

      if (clinicId) {
        // Note: Asumiendo que existe una relación con clínica
        // Ajustar según la estructura real de la base de datos
      }

      const [
        totalOdontograms,
        draftCount,
        completedCount,
        reviewedCount,
        archivedCount,
      ] = await Promise.all([
        this.odontogramRepository.count(
          whereConditions ? { where: whereConditions } : {},
        ),
        this.odontogramRepository.count({
          where: { ...whereConditions, status: OdontogramStatus.DRAFT },
        }),
        this.odontogramRepository.count({
          where: { ...whereConditions, status: OdontogramStatus.COMPLETED },
        }),
        this.odontogramRepository.count({
          where: { ...whereConditions, status: OdontogramStatus.REVIEWED },
        }),
        this.odontogramRepository.count({
          where: { ...whereConditions, status: OdontogramStatus.ARCHIVED },
        }),
      ]);

      return {
        totalOdontograms,
        byStatus: {
          draft: draftCount,
          completed: completedCount,
          reviewed: reviewedCount,
          archived: archivedCount,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        "Error interno del servidor al obtener las estadísticas",
      );
    }
  }

  async update(
    id: number,
    updateOdontogramDto: UpdateOdontogramDto,
    user?: any,
  ): Promise<Odontogram> {
    try {
      const odontogram = await this.findOne(id);

      // Verificar duplicados si se están cambiando paciente o fecha
      if (
        updateOdontogramDto.patientId ||
        updateOdontogramDto.examinationDate
      ) {
        const newPatientId =
          updateOdontogramDto.patientId || odontogram.patientId;
        const newExaminationDate = updateOdontogramDto.examinationDate
          ? new Date(updateOdontogramDto.examinationDate)
          : odontogram.examinationDate;

        // Solo validar si realmente cambió el paciente o la fecha
        const currentExaminationDate = new Date(odontogram.examinationDate);
        if (
          newPatientId !== odontogram.patientId ||
          newExaminationDate.toDateString() !==
            currentExaminationDate.toDateString()
        ) {
          await this.validateUniqueOdontogramPerPatientPerDate(
            newPatientId,
            newExaminationDate,
            id, // Excluir el odontograma actual de la validación
          );
        }
      }

      // Validate tooth records if provided
      if (
        updateOdontogramDto.toothRecords &&
        updateOdontogramDto.toothRecords.length > 0
      ) {
        this.validateToothRecords(updateOdontogramDto.toothRecords);
      }

      // Preparar datos para actualización, convirtiendo fecha si es necesario
      const updateFields = { ...updateOdontogramDto };
      if (updateOdontogramDto.examinationDate) {
        Object.assign(odontogram, updateFields, {
          examinationDate: new Date(updateOdontogramDto.examinationDate),
        });
      } else {
        Object.assign(odontogram, updateFields);
      }

      await this.odontogramRepository.save(odontogram);

      // Update tooth records if provided
      if (
        updateOdontogramDto.toothRecords &&
        updateOdontogramDto.toothRecords.length > 0
      ) {
        await this.updateToothRecords(
          odontogram.id,
          updateOdontogramDto.toothRecords,
          user,
        );

        // Recalculate statistics after updating tooth records
        const updatedToothRecords = await this.toothRecordRepository.find({
          where: { odontogramId: odontogram.id },
        });

        const stats = this.calculateOdontogramStats(updatedToothRecords);

        // Update odontogram statistics
        odontogram.totalTeethExamined = stats.totalExamined;
        odontogram.healthyTeethCount = stats.healthy;
        odontogram.problematicTeethCount = stats.problematic;
        odontogram.treatmentRequiredCount = stats.treatmentRequired;

        await this.odontogramRepository.save(odontogram);
      }

      return this.findOne(id);
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Error interno del servidor al actualizar el odontograma",
      );
    }
  }

  async updateStatus(id: number, status: string): Promise<Odontogram> {
    try {
      if (!Object.values(OdontogramStatus).includes(status as OdontogramStatus)) {
        throw new BadRequestException(`Estado ${status} no válido`);
      }

      const odontogram = await this.findOne(id);

      // Validar transiciones de estado
      this.validateStatusTransition(
        odontogram.status,
        status as OdontogramStatus,
      );

      odontogram.status = status as OdontogramStatus;
      await this.odontogramRepository.save(odontogram);

      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Error interno del servidor al actualizar el estado",
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const odontogram = await this.findOne(id);

      // Validar que se puede eliminar
      if (
        odontogram.status === OdontogramStatus.COMPLETED ||
        odontogram.status === OdontogramStatus.REVIEWED
      ) {
        throw new BadRequestException(
          "No se puede eliminar un odontograma completado o revisado",
        );
      }

      // Delete tooth records first
      await this.toothRecordRepository.delete({ odontogramId: id });

      await this.odontogramRepository.softRemove(odontogram);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Error interno del servidor al eliminar el odontograma",
      );
    }
  }

  private async updateToothRecords(
    odontogramId: number,
    toothRecords: any[],
    user?: any,
  ): Promise<void> {
    // STEP 1: Clean up all existing duplicates first
    const allExistingRecords = await this.toothRecordRepository.find({
      where: { odontogramId },
      order: { createdAt: "ASC", id: "ASC" },
    });

    // Group records by tooth number to identify duplicates
    const recordsByTooth = new Map<number, ToothRecord[]>();
    for (const record of allExistingRecords) {
      if (!recordsByTooth.has(record.toothNumber)) {
        recordsByTooth.set(record.toothNumber, []);
      }
      recordsByTooth.get(record.toothNumber)!.push(record);
    }

    // Remove all duplicate records, keeping only the first one for each tooth
    const recordsToDelete: ToothRecord[] = [];
    const validRecords: ToothRecord[] = [];

    for (const [toothNumber, records] of recordsByTooth) {
      if (records.length > 1) {
        validRecords.push(records[0]); // Keep the first (oldest) record
        recordsToDelete.push(...records.slice(1)); // Mark the rest for deletion
      } else {
        validRecords.push(records[0]); // Single record, keep it
      }
    }

    // Delete all duplicate records
    if (recordsToDelete.length > 0) {
      await this.toothRecordRepository.remove(recordsToDelete);
    }

    // STEP 2: Process the updates with clean data
    // Process each tooth record from the DTO
    for (const recordDto of toothRecords) {
      // Find the existing valid record for this tooth number
      const existingRecord = validRecords.find(
        (existing) => existing.toothNumber === recordDto.toothNumber,
      );

      if (existingRecord) {
        // Update existing record
        existingRecord.status = recordDto.status;
        existingRecord.affectedSurfaces = recordDto.affectedSurfaces || [];
        existingRecord.notes = recordDto.notes || "";
        existingRecord.treatmentRequired = recordDto.treatmentRequired || false;
        existingRecord.treatmentCompleted =
          recordDto.treatmentCompleted || false;
        existingRecord.priorityLevel = recordDto.priorityLevel || 1;
        existingRecord.odontogramId = odontogramId; // Ensure this is set correctly
        existingRecord.lastModifiedBy =
          (user?.email as string) || ("system" as string);

        // Save the updated record
        await this.toothRecordRepository.save(existingRecord);
      } else {
        // Create new record for this tooth
        const newRecord = this.toothRecordRepository.create({
          ...recordDto,
          odontogramId,
          priorityLevel: recordDto.priorityLevel || 1,
          affectedSurfaces: recordDto.affectedSurfaces || [],
          notes: recordDto.notes || "",
          treatmentRequired: recordDto.treatmentRequired || false,
          treatmentCompleted: recordDto.treatmentCompleted || false,
          lastModifiedBy: (user?.email as string) || ("system" as string),
        });

        await this.toothRecordRepository.save(newRecord);
      }
    }

    // STEP 3: Remove tooth records that are no longer in the DTO
    const recordNumbersInDto = toothRecords.map((r) => r.toothNumber);
    const recordsToRemove = validRecords.filter(
      (existing) => !recordNumbersInDto.includes(existing.toothNumber),
    );

    if (recordsToRemove.length > 0) {
      await this.toothRecordRepository.remove(recordsToRemove);
    }
  }

  private async generateOdontogramCode(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const count = await this.odontogramRepository.count();
    const sequence = (count + 1).toString().padStart(4, "0");

    return `ODO${year}${month}${day}${sequence}`;
  }

  private async validateCreateData(
    createOdontogramDto: CreateOdontogramDto,
  ): Promise<void> {
    // Validate patient ID
    if (!createOdontogramDto.patientId || createOdontogramDto.patientId <= 0) {
      throw new BadRequestException("ID del paciente inválido");
    }

    // Validate examination date
    const examinationDate = new Date(createOdontogramDto.examinationDate);
    if (isNaN(examinationDate.getTime())) {
      throw new BadRequestException("Fecha de examinación inválida");
    }

    // Validate examination date is not in the future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (examinationDate > today) {
      throw new BadRequestException(
        "La fecha de examinación no puede ser futura",
      );
    }
  }

  private validateToothRecords(toothRecords: any[]): void {
    const toothNumbers = new Set<number>();

    for (const record of toothRecords) {
      // Check for duplicate tooth numbers
      if (toothNumbers.has(record.toothNumber)) {
        throw new BadRequestException(
          `Diente número ${record.toothNumber} está duplicado`,
        );
      }
      toothNumbers.add(record.toothNumber);

      // Validate tooth number range
      if (record.toothNumber < 1 || record.toothNumber > 32) {
        throw new BadRequestException(
          `Número de diente ${record.toothNumber} fuera del rango válido (1-32)`,
        );
      }

      // Validate status
      if (!Object.values(ToothStatus).includes(record.status)) {
        throw new BadRequestException(
          `Estado del diente ${record.status} no válido`,
        );
      }
    }
  }

  private validateStatusTransition(
    currentStatus: OdontogramStatus,
    newStatus: OdontogramStatus,
  ): void {
    const validTransitions: Record<OdontogramStatus, OdontogramStatus[]> = {
      [OdontogramStatus.DRAFT]: [
        OdontogramStatus.COMPLETED,
        OdontogramStatus.ARCHIVED,
      ],
      [OdontogramStatus.COMPLETED]: [
        OdontogramStatus.REVIEWED,
        OdontogramStatus.DRAFT,
        OdontogramStatus.ARCHIVED,
      ],
      [OdontogramStatus.REVIEWED]: [
        OdontogramStatus.ARCHIVED,
        OdontogramStatus.COMPLETED,
      ],
      [OdontogramStatus.ARCHIVED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transición de estado inválida de ${currentStatus} a ${newStatus}`,
      );
    }
  }

  /**
   * Validates that no odontogram exists for the same patient on the same date
   */
  private async validateUniqueOdontogramPerPatientPerDate(
    patientId: number,
    examinationDate: Date,
    excludeId?: number,
  ): Promise<void> {
    // Normalizar la fecha para comparar solo año, mes y día
    const startOfDay = new Date(examinationDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(examinationDate);
    endOfDay.setHours(23, 59, 59, 999);

    const whereCondition = {
      patientId,
      examinationDate: Between(startOfDay, endOfDay),
      ...(excludeId && { id: Not(excludeId) }),
    };

    const existingOdontogram = await this.odontogramRepository.findOne({
      where: whereCondition,
    });

    if (existingOdontogram) {
      throw new ConflictException(
        `Ya existe un odontograma para este paciente en la fecha ${examinationDate.toLocaleDateString()}. ` +
          `Código existente: ${existingOdontogram.odontogramCode}`,
      );
    }
  }

  private calculateOdontogramStats(
    toothRecords: Array<{
      status: ToothStatus;
      treatmentRequired?: boolean;
    }>,
  ): {
    totalExamined: number;
    healthy: number;
    problematic: number;
    treatmentRequired: number;
  } {
    const totalExamined = toothRecords.length;
    let healthy = 0;
    let problematic = 0;
    let treatmentRequired = 0;

    toothRecords.forEach((record) => {
      if (record.status === ToothStatus.HEALTHY) {
        healthy++;
      } else {
        problematic++;
      }

      if (record.treatmentRequired) {
        treatmentRequired++;
      }
    });

    return {
      totalExamined,
      healthy,
      problematic,
      treatmentRequired,
    };
  }
}
