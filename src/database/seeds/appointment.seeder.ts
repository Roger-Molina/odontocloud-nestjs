import { DataSource } from "typeorm";
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from "../../modules/appointments/entities/appointment.entity";
import { Patient } from "../../modules/patients/entities/patient.entity";
import { Doctor } from "../../modules/doctors/entities/doctor.entity";
import { Clinic } from "../../modules/clinics/entities/clinic.entity";

export async function seedAppointments(dataSource: DataSource) {
  const appointmentRepository = dataSource.getRepository(Appointment);
  const patientRepository = dataSource.getRepository(Patient);
  const doctorRepository = dataSource.getRepository(Doctor);
  const clinicRepository = dataSource.getRepository(Clinic);

  // Verificar si ya existen citas
  const existingAppointments = await appointmentRepository.count();
  if (existingAppointments > 0) {
    console.log("Las citas ya existen, saltando seeder...");
    return;
  }

  // Obtener clínicas, doctores y pacientes existentes
  const clinics = await clinicRepository.find();
  const doctors = await doctorRepository.find({ relations: ["clinic"] });
  const patients = await patientRepository.find({ relations: ["clinic"] });

  if (clinics.length === 0 || doctors.length === 0 || patients.length === 0) {
    console.log(
      "No hay datos suficientes para crear citas. Ejecuta primero los seeders de clínicas, doctores y pacientes.",
    );
    return;
  }

  const appointments: Partial<Appointment>[] = [];

  // Generar citas para cada clínica
  for (const clinic of clinics) {
    const clinicDoctors = doctors.filter((d) => d.clinicId === clinic.id);
    const clinicPatients = patients.filter((p) => p.clinicId === clinic.id);

    if (clinicDoctors.length === 0 || clinicPatients.length === 0) {
      continue;
    }

    // Crear citas para los próximos 30 días
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + i);

      // Evitar fines de semana
      if (appointmentDate.getDay() === 0 || appointmentDate.getDay() === 6) {
        continue;
      }

      // Generar varias citas por día
      const appointmentsPerDay = Math.floor(Math.random() * 5) + 3; // 3-7 citas por día

      for (let j = 0; j < appointmentsPerDay; j++) {
        const doctor =
          clinicDoctors[Math.floor(Math.random() * clinicDoctors.length)];
        const patient =
          clinicPatients[Math.floor(Math.random() * clinicPatients.length)];

        // Horarios entre 8:00 AM y 6:00 PM
        const hour = Math.floor(Math.random() * 10) + 8; // 8-17
        const minute = [0, 30][Math.floor(Math.random() * 2)]; // :00 o :30
        const appointmentTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        const appointmentTypes = Object.values(AppointmentType);
        const type =
          appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)];

        const statuses = [
          AppointmentStatus.SCHEDULED,
          AppointmentStatus.CONFIRMED,
          AppointmentStatus.COMPLETED,
          AppointmentStatus.CANCELLED,
        ];

        let status: AppointmentStatus;
        if (i < 0) {
          // Citas del pasado
          status = [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED][
            Math.floor(Math.random() * 2)
          ];
        } else if (i === 0) {
          // Citas de hoy
          status = [AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS][
            Math.floor(Math.random() * 2)
          ];
        } else {
          // Citas futuras
          status = [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED][
            Math.floor(Math.random() * 2)
          ];
        }

        const reasons = [
          "Consulta general",
          "Control de rutina",
          "Limpieza dental",
          "Dolor de muelas",
          "Extracción dental",
          "Consulta de urgencia",
          "Revisión post-tratamiento",
          "Ortodoncia",
          "Endodoncia",
          "Implante dental",
        ];

        const consultationFees = [50, 75, 100, 120, 150, 200];

        appointments.push({
          appointmentCode: await generateAppointmentCode(
            appointmentRepository,
            appointmentDate,
          ),
          appointmentDate,
          appointmentTime,
          durationMinutes: [30, 45, 60][Math.floor(Math.random() * 3)],
          status,
          type,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          notes:
            Math.random() > 0.7
              ? `Notas adicionales para la cita del paciente ${patient.firstLastName}`
              : undefined,
          consultationFee:
            consultationFees[
              Math.floor(Math.random() * consultationFees.length)
            ],
          patientId: patient.id,
          doctorId: doctor.id,
          clinicId: clinic.id,
          confirmedAt:
            status === AppointmentStatus.CONFIRMED ? new Date() : undefined,
          cancelledAt:
            status === AppointmentStatus.CANCELLED ? new Date() : undefined,
          cancellationReason:
            status === AppointmentStatus.CANCELLED
              ? "Cancelado por el paciente"
              : undefined,
        });
      }
    }
  }

  // Guardar todas las citas
  for (const appointmentData of appointments) {
    const appointment = appointmentRepository.create(appointmentData);
    await appointmentRepository.save(appointment);
  }

  console.log(`✅ Se crearon ${appointments.length} citas de ejemplo`);
}

async function generateAppointmentCode(
  appointmentRepository: any,
  date: Date,
): Promise<string> {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const count = await appointmentRepository.count();
  const sequence = (count + 1).toString().padStart(4, "0");

  return `APT${year}${month}${day}${sequence}`;
}
