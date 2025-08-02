import { DataSource } from "typeorm";
import {
  Treatment,
  TreatmentCategory,
} from "../../modules/treatments/entities/treatment.entity";
import {
  Diagnosis,
  DiagnosisCategory,
  DiagnosisSeverity,
} from "../../modules/diagnoses/entities/diagnosis.entity";

export class SeedTreatmentsAndDiagnoses {
  public async run(dataSource: DataSource): Promise<void> {
    const treatmentRepository = dataSource.getRepository(Treatment);
    const diagnosisRepository = dataSource.getRepository(Diagnosis);

    // Seed Treatments
    const treatments = [
      // Preventivo
      {
        treatmentCode: "PREV001",
        name: "Limpieza Dental Profesional",
        description: "Remoción de placa bacteriana y sarro",
        category: TreatmentCategory.PREVENTIVE,
        baseCost: 150.0,
        estimatedDuration: 45,
        requiresAnesthesia: false,
        toothSpecific: false,
        clinicId: 1,
      },
      {
        treatmentCode: "PREV002",
        name: "Aplicación de Flúor",
        description: "Aplicación tópica de flúor para prevenir caries",
        category: TreatmentCategory.PREVENTIVE,
        baseCost: 80.0,
        estimatedDuration: 20,
        requiresAnesthesia: false,
        toothSpecific: false,
        clinicId: 1,
      },
      {
        treatmentCode: "PREV003",
        name: "Selladores de Fosas y Fisuras",
        description: "Aplicación de selladores en molares para prevenir caries",
        category: TreatmentCategory.PREVENTIVE,
        baseCost: 120.0,
        estimatedDuration: 30,
        requiresAnesthesia: false,
        toothSpecific: true,
        clinicId: 1,
      },

      // Restaurativo
      {
        treatmentCode: "REST001",
        name: "Resina Compuesta (Empaste)",
        description: "Restauración dental con resina compuesta",
        category: TreatmentCategory.RESTORATIVE,
        baseCost: 200.0,
        estimatedDuration: 60,
        requiresAnesthesia: true,
        toothSpecific: true,
        clinicId: 1,
      },
      {
        treatmentCode: "REST002",
        name: "Corona Dental",
        description: "Colocación de corona de porcelana o zirconio",
        category: TreatmentCategory.RESTORATIVE,
        baseCost: 800.0,
        estimatedDuration: 120,
        requiresAnesthesia: true,
        toothSpecific: true,
        clinicId: 1,
      },

      // Endodoncia
      {
        treatmentCode: "ENDO001",
        name: "Tratamiento de Conducto",
        description: "Endodoncia completa con obturación",
        category: TreatmentCategory.ENDODONTIC,
        baseCost: 600.0,
        estimatedDuration: 90,
        requiresAnesthesia: true,
        toothSpecific: true,
        clinicId: 1,
      },

      // Periodoncia
      {
        treatmentCode: "PERIO001",
        name: "Raspado y Alisado Radicular",
        description: "Tratamiento periodontal no quirúrgico",
        category: TreatmentCategory.PERIODONTIC,
        baseCost: 300.0,
        estimatedDuration: 60,
        requiresAnesthesia: true,
        toothSpecific: false,
        clinicId: 1,
      },

      // Cirugía Oral
      {
        treatmentCode: "SURG001",
        name: "Extracción Simple",
        description: "Extracción dental simple",
        category: TreatmentCategory.ORAL_SURGERY,
        baseCost: 180.0,
        estimatedDuration: 30,
        requiresAnesthesia: true,
        toothSpecific: true,
        clinicId: 1,
      },
      {
        treatmentCode: "SURG002",
        name: "Extracción Quirúrgica",
        description: "Extracción dental compleja con cirugía",
        category: TreatmentCategory.ORAL_SURGERY,
        baseCost: 350.0,
        estimatedDuration: 60,
        requiresAnesthesia: true,
        toothSpecific: true,
        clinicId: 1,
      },
    ];

    // Seed Diagnoses
    const diagnoses = [
      // Caries
      {
        diagnosisCode: "K02.9",
        name: "Caries Dental",
        description: "Destrucción localizada del tejido dental",
        category: DiagnosisCategory.CARIES,
        severity: DiagnosisSeverity.MILD,
        isChronic: false,
        requiresImmediateAttention: false,
        toothSpecific: true,
        clinicId: 1,
      },
      {
        diagnosisCode: "K02.1",
        name: "Caries de Dentina",
        description: "Caries que ha alcanzado la dentina",
        category: DiagnosisCategory.CARIES,
        severity: DiagnosisSeverity.MODERATE,
        isChronic: false,
        requiresImmediateAttention: true,
        toothSpecific: true,
        clinicId: 1,
      },

      // Periodontal
      {
        diagnosisCode: "K05.1",
        name: "Gingivitis",
        description: "Inflamación de las encías",
        category: DiagnosisCategory.PERIODONTAL,
        severity: DiagnosisSeverity.MILD,
        isChronic: false,
        requiresImmediateAttention: false,
        toothSpecific: false,
        clinicId: 1,
      },
      {
        diagnosisCode: "K05.3",
        name: "Periodontitis",
        description: "Inflamación de los tejidos de soporte dental",
        category: DiagnosisCategory.PERIODONTAL,
        severity: DiagnosisSeverity.SEVERE,
        isChronic: true,
        requiresImmediateAttention: true,
        toothSpecific: false,
        clinicId: 1,
      },

      // Endodoncia
      {
        diagnosisCode: "K04.1",
        name: "Pulpitis",
        description: "Inflamación de la pulpa dental",
        category: DiagnosisCategory.ENDODONTIC,
        severity: DiagnosisSeverity.SEVERE,
        isChronic: false,
        requiresImmediateAttention: true,
        toothSpecific: true,
        clinicId: 1,
      },
      {
        diagnosisCode: "K04.5",
        name: "Necrosis Pulpar",
        description: "Muerte del tejido pulpar",
        category: DiagnosisCategory.ENDODONTIC,
        severity: DiagnosisSeverity.CRITICAL,
        isChronic: false,
        requiresImmediateAttention: true,
        toothSpecific: true,
        clinicId: 1,
      },

      // Trauma
      {
        diagnosisCode: "S02.5",
        name: "Fractura Dental",
        description: "Rotura del tejido dental",
        category: DiagnosisCategory.TRAUMA,
        severity: DiagnosisSeverity.MODERATE,
        isChronic: false,
        requiresImmediateAttention: true,
        toothSpecific: true,
        clinicId: 1,
      },
    ];

    // Insert treatments
    for (const treatmentData of treatments) {
      const existingTreatment = await treatmentRepository.findOne({
        where: { treatmentCode: treatmentData.treatmentCode },
      });

      if (!existingTreatment) {
        const treatment = treatmentRepository.create(treatmentData);
        await treatmentRepository.save(treatment);
        console.log(`Created treatment: ${treatmentData.name}`);
      }
    }

    // Insert diagnoses
    for (const diagnosisData of diagnoses) {
      const existingDiagnosis = await diagnosisRepository.findOne({
        where: { diagnosisCode: diagnosisData.diagnosisCode },
      });

      if (!existingDiagnosis) {
        const diagnosis = diagnosisRepository.create(diagnosisData);
        await diagnosisRepository.save(diagnosis);
        console.log(`Created diagnosis: ${diagnosisData.name}`);
      }
    }

    console.log("Treatments and diagnoses seeded successfully!");
  }
}
