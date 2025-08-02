# 📋 Documentación Frontend - Sistema Multiclinica API

## 🎯 **Información General del Proyecto**

**Proyecto:** Sistema de Gestión Multiclinica  
**Backend:** NestJS + TypeScript + PostgreSQL  
**Arquitectura:** REST API con Multitenancy por Clínicas  
**Servidor:** `http://localhost:3000/api/v1`  
**Documentación Swagger:** `http://localhost:3000/api/v1/docs`

---

## 🏗️ **Arquitectura del Sistema**

### **Concepto Principal: Multitenancy por Clínicas**

El sistema permite que:
- **Un paciente puede estar registrado en múltiples clínicas**
- **Cada doctor pertenece a UNA clínica específica**
- **Los datos están completamente aislados entre clínicas**
- **Cada clínica opera de forma independiente**

### **Flujo de Datos:**
```
User → Patient/Doctor → Clinic → Appointments/Records
  ↓
Control de Acceso por Clínica
  ↓  
Aislamiento Total de Datos
```

---

## 🔐 **Autenticación y Autorización**

### **Roles de Usuario:**
```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',  // Acceso total a todas las clínicas
  ADMIN = 'admin',              // Gestión de clínicas asignadas
  DOCTOR = 'doctor',            // Solo su clínica específica
  NURSE = 'nurse',              // Asistencia en clínica asignada
  RECEPTIONIST = 'receptionist', // Recepción de clínica
  PATIENT = 'patient'           // Acceso limitado a sus datos
}
```

### **Headers Requeridos:**
```typescript
// Para endpoints protegidos
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### **Estructura del JWT Payload:**
```typescript
interface JWTPayload {
  id: number;
  email: string;
  role: UserRole;
  doctor?: {
    id: number;
    clinicId: number;  // ← IMPORTANTE: Clínica del doctor
    specialization: string;
  };
  admin?: {
    id: number;
    clinicId?: number;  // Clínica asignada (opcional)
  };
}
```

---

## 🌐 **Endpoints por Módulo**

### **🏥 1. GESTIÓN DE CLÍNICAS**

#### **Listar Clínicas**
```typescript
GET /api/v1/clinics
Response: Clinic[]

interface Clinic {
  id: number;
  clinicCode: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email?: string;
  website?: string;
  status: 'active' | 'inactive' | 'maintenance';
  openingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    // ... otros días
  };
  licenseNumber: string;
  taxId: string;
}
```

#### **Crear Clínica (Solo Admin)**
```typescript
POST /api/v1/clinics
Body: CreateClinicDto

interface CreateClinicDto {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  email?: string;
  website?: string;
  licenseNumber: string;
  taxId: string;
}
```

---

### **👨‍⚕️ 2. GESTIÓN DE DOCTORES**

#### **Listar Doctores por Clínica**
```typescript
GET /api/v1/doctors/clinic/:clinicId
Response: Doctor[]

interface Doctor {
  id: number;
  doctorCode: string;
  medicalLicense: string;
  specialization: string;
  yearsExperience: number;
  status: 'active' | 'inactive' | 'on_leave';
  biography?: string;
  consultationFee: number;
  consultationDuration: number;
  clinicId: number;  // ← Clínica asignada
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  clinic: Clinic;
}
```

#### **Crear Doctor**
```typescript
POST /api/v1/doctors
Body: CreateDoctorDto

interface CreateDoctorDto {
  medicalLicense: string;
  specialization: string;
  yearsExperience: number;
  consultationFee: number;
  consultationDuration?: number;
  userId: number;      // ID del usuario
  clinicId: number;    // ← IMPORTANTE: Clínica asignada
  biography?: string;
}
```

---

### **👥 3. GESTIÓN DE PACIENTES (MULTICLINICA)**

#### **📌 IMPORTANTE: Sistema de Códigos por Clínica**
```typescript
// Mismo paciente en diferentes clínicas:
Clínica A: "Juan Pérez" → Código: CL1-0001
Clínica B: "Juan Pérez" → Código: CL2-0001
```

#### **Registrar Paciente en Clínica Específica**
```typescript
POST /api/v1/patients/clinic/:clinicId
Body: CreatePatientDto

interface CreatePatientDto {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;  // ← Cédula/ID único
  birthDate: string;       // Format: "1990-01-15"
  gender: 'male' | 'female' | 'other';
  address: string;
  phoneNumber: string;
  email?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  medicalHistory?: string;
}

Response: {
  patient: Patient;      // Datos globales del paciente
  patientClinic: {
    id: number;
    patientCodeClinic: string;  // ← Código único por clínica: "CL1-0001"
    registrationDate: string;
    status: 'active' | 'inactive' | 'transferred';
    notes?: string;
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      validUntil: string;
      coverage: string;
    };
  }
}
```

#### **Listar Pacientes por Clínica**
```typescript
GET /api/v1/patients/clinic/:clinicId
Response: Patient[]  // Solo pacientes de esa clínica

// ⚠️ IMPORTANTE: Este endpoint está protegido
// - Doctor solo puede acceder a SU clínica
// - Admin puede acceder a clínicas asignadas
// - Super Admin puede acceder a cualquier clínica
```

#### **Ver Paciente en Clínica Específica**
```typescript
GET /api/v1/patients/clinic/:clinicId/patient/:patientId
Response: {
  patient: Patient;
  patientClinic: PatientClinic;
}
```

#### **Buscar Paciente por Documento (Global)**
```typescript
GET /api/v1/patients/search?documentNumber=12345678
Response: {
  patient: Patient;
  clinics: PatientClinic[];  // Clínicas donde está registrado
}
```

---

### **📅 4. GESTIÓN DE CITAS**

#### **Crear Cita**
```typescript
POST /api/v1/appointments
Body: CreateAppointmentDto

interface CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  appointmentDate: string;     // "2025-07-24"
  appointmentTime: string;     // "10:30"
  durationMinutes?: number;    // Default: 30
  type: 'consultation' | 'follow_up' | 'emergency' | 'procedure' | 'surgery';
  reason?: string;
  notes?: string;
  // clinicId se inyecta automáticamente desde el doctor
}

Response: Appointment
```

#### **Listar Citas por Doctor**
```typescript
GET /api/v1/appointments/doctor/:doctorId
GET /api/v1/appointments/doctor/:doctorId?date=2025-07-24
Response: Appointment[]
```

#### **Listar Citas por Paciente en Clínica**
```typescript
GET /api/v1/appointments/patient/:patientId
Response: Appointment[]  // Solo citas de la clínica del doctor autenticado
```

#### **Estados de Cita**
```typescript
enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}
```

---

### **📋 5. HISTORIALES MÉDICOS**

#### **Crear Registro Médico**
```typescript
POST /api/v1/medical-records
Body: CreateMedicalRecordDto

interface CreateMedicalRecordDto {
  patientId: number;
  doctorId: number;
  appointmentId?: number;
  type: 'consultation' | 'diagnosis' | 'treatment' | 'surgery' | 'lab_result' | 'prescription' | 'note';
  title: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
  };
  followUpDate?: string;
}
```

#### **Listar Historiales por Paciente**
```typescript
GET /api/v1/medical-records/patient/:patientId
Response: MedicalRecord[]  // Solo registros de la clínica del doctor
```

---

### **💰 6. FACTURACIÓN**

#### **Crear Factura**
```typescript
POST /api/v1/billing/invoices
Body: CreateInvoiceDto

interface CreateInvoiceDto {
  patientId: number;
  appointmentId?: number;
  items: InvoiceItem[];
  dueDate: string;
  notes?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}
```

#### **Estados de Factura**
```typescript
enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}
```

---

### **📦 7. INVENTARIO**

#### **Listar Items por Clínica**
```typescript
GET /api/v1/inventory/items
Response: InventoryItem[]  // Solo inventario de la clínica del doctor

interface InventoryItem {
  id: number;
  itemCode: string;
  name: string;
  description?: string;
  category: 'medication' | 'equipment' | 'supply' | 'consumable' | 'instrument';
  brand?: string;
  manufacturer?: string;
  unitOfMeasure: string;
  unitCost: number;
  sellingPrice: number;
  currentStock: number;
  minimumStock: number;
  status: 'active' | 'inactive' | 'discontinued';
  expirationDate?: string;
  requiresPrescription: boolean;
}
```

---

### **🦷 8. ODONTOGRAMA**

#### **Crear Odontograma**
```typescript
POST /api/v1/odontograma
Body: CreateOdontogramDto

interface CreateOdontogramDto {
  patientId: number;
  examinationDate: string;
  generalNotes?: string;
  teeth: ToothRecord[];
}

interface ToothRecord {
  toothNumber: number;  // 1-32 para adultos
  status: 'healthy' | 'caries' | 'filled' | 'crown' | 'extraction' | 'missing' | 'implant' | 'root_canal';
  affectedSurfaces?: ('mesial' | 'distal' | 'occlusal' | 'buccal' | 'lingual' | 'incisal')[];
  notes?: string;
  treatmentRequired: boolean;
  treatmentCompleted: boolean;
}
```

---

## 🔄 **Flujos de Trabajo Frontend**

### **🏥 1. Flujo de Selección de Clínica (Para Super Admin)**

```typescript
// 1. Obtener clínicas disponibles
const clinics = await api.get('/clinics');

// 2. Permitir selección de clínica
const selectedClinicId = userSelection;

// 3. Todos los endpoints subsecuentes usan esta clínica
const patients = await api.get(`/patients/clinic/${selectedClinicId}`);
```

### **👨‍⚕️ 2. Flujo para Doctor (Clínica Automática)**

```typescript
// 1. Al login, obtener información del doctor
const userInfo = decodeJWT(token);
const doctorClinicId = userInfo.doctor.clinicId;

// 2. Todos los endpoints usan automáticamente su clínica
const myPatients = await api.get(`/patients/clinic/${doctorClinicId}`);
const myAppointments = await api.get(`/appointments/doctor/${userInfo.doctor.id}`);
```

### **👥 3. Flujo de Registro de Paciente**

```typescript
// Paso 1: Verificar si el paciente ya existe
const existingPatient = await api.get(`/patients/search?documentNumber=${documentNumber}`);

if (existingPatient) {
  // Paso 2a: Paciente existe, registrar en nueva clínica
  const result = await api.post(`/patients/clinic/${clinicId}`, {
    ...existingPatient.data,
    // Agregar información específica de la clínica
  });
} else {
  // Paso 2b: Paciente nuevo, crear en clínica
  const result = await api.post(`/patients/clinic/${clinicId}`, patientData);
}
```

### **📅 4. Flujo de Agendamiento**

```typescript
// 1. Seleccionar paciente de la clínica
const patients = await api.get(`/patients/clinic/${clinicId}`);

// 2. Seleccionar doctor de la clínica
const doctors = await api.get(`/doctors/clinic/${clinicId}`);

// 3. Crear cita (clinic_id se inyecta automáticamente)
const appointment = await api.post('/appointments', {
  patientId: selectedPatient.id,
  doctorId: selectedDoctor.id,
  appointmentDate: '2025-07-24',
  appointmentTime: '10:30',
  type: 'consultation'
});
```

---

## 🎨 **Consideraciones de UX/UI**

### **🏷️ 1. Mostrar Códigos por Clínica**
```typescript
// En lugar de mostrar solo "Juan Pérez"
// Mostrar: "Juan Pérez (CL1-0001)" para identificar la clínica
const displayName = `${patient.firstName} ${patient.lastName} (${patientClinic.patientCodeClinic})`;
```

### **🏥 2. Indicador de Clínica Activa**
```typescript
// Para doctores, mostrar su clínica
<Header>
  Dr. {doctor.user.firstName} - {doctor.clinic.name}
</Header>

// Para super admin, mostrar clínica seleccionada
<ClinicSelector>
  Clínica Activa: {selectedClinic.name}
</ClinicSelector>
```

### **🔍 3. Búsqueda de Pacientes**
```typescript
// Componente de búsqueda debe mostrar:
interface PatientSearchResult {
  patient: Patient;
  inCurrentClinic: boolean;  // ¿Está en la clínica actual?
  otherClinics: string[];    // Otras clínicas donde está registrado
}
```

### **⚠️ 4. Manejo de Errores de Acceso**
```typescript
// Error 403: Sin acceso a clínica
if (error.status === 403) {
  showError('No tiene acceso a esta clínica');
  redirectToUserClinic();
}
```

---

## 🔧 **Configuración y Variables**

### **Environment Variables:**
```typescript
// .env para desarrollo
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_API_DOCS=http://localhost:3000/api/v1/docs

// .env para producción
REACT_APP_API_URL=https://api.multiclinica.com/api/v1
REACT_APP_API_DOCS=https://api.multiclinica.com/api/v1/docs
```

### **Axios Configuration:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Sin acceso a clínica
      console.error('Access denied to clinic');
    }
    return Promise.reject(error);
  }
);
```

---

## 📱 **Componentes Sugeridos**

### **1. ClinicSelector (Para Super Admin)**
```typescript
interface ClinicSelectorProps {
  onClinicChange: (clinicId: number) => void;
  selectedClinicId?: number;
}

const ClinicSelector: React.FC<ClinicSelectorProps> = ({ onClinicChange, selectedClinicId }) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  
  useEffect(() => {
    api.get('/clinics').then(response => setClinics(response.data));
  }, []);

  return (
    <Select value={selectedClinicId} onChange={onClinicChange}>
      {clinics.map(clinic => (
        <Option key={clinic.id} value={clinic.id}>
          {clinic.name}
        </Option>
      ))}
    </Select>
  );
};
```

### **2. PatientCard (Con Código de Clínica)**
```typescript
interface PatientCardProps {
  patient: Patient;
  patientClinic: PatientClinic;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, patientClinic }) => {
  return (
    <Card>
      <h3>{patient.firstName} {patient.lastName}</h3>
      <p>Código: <strong>{patientClinic.patientCodeClinic}</strong></p>
      <p>Documento: {patient.documentNumber}</p>
      <p>Teléfono: {patient.phoneNumber}</p>
      <Badge status={patientClinic.status}>
        {patientClinic.status}
      </Badge>
    </Card>
  );
};
```

### **3. AppointmentScheduler**
```typescript
interface AppointmentSchedulerProps {
  clinicId: number;
  onAppointmentCreated: (appointment: Appointment) => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ clinicId, onAppointmentCreated }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  
  useEffect(() => {
    // Cargar pacientes y doctores de la clínica
    Promise.all([
      api.get(`/patients/clinic/${clinicId}`),
      api.get(`/doctors/clinic/${clinicId}`)
    ]).then(([patientsRes, doctorsRes]) => {
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    });
  }, [clinicId]);

  const handleSubmit = async (formData: any) => {
    const appointment = await api.post('/appointments', formData);
    onAppointmentCreated(appointment.data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Select name="patientId" placeholder="Seleccionar Paciente">
        {patients.map(patient => (
          <Option key={patient.id} value={patient.id}>
            {patient.firstName} {patient.lastName} ({patient.patientCode})
          </Option>
        ))}
      </Select>
      
      <Select name="doctorId" placeholder="Seleccionar Doctor">
        {doctors.map(doctor => (
          <Option key={doctor.id} value={doctor.id}>
            Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
          </Option>
        ))}
      </Select>
      
      <DatePicker name="appointmentDate" />
      <TimePicker name="appointmentTime" />
      <Button type="submit">Agendar Cita</Button>
    </Form>
  );
};
```

---

## 🧪 **Testing de Endpoints**

### **Ejemplos con cURL:**

```bash
# 1. Crear clínica
curl -X POST http://localhost:3000/api/v1/clinics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "name": "Clínica Cardio Salud",
    "address": "Calle 123 #45-67",
    "city": "Bogotá",
    "state": "Cundinamarca",
    "postalCode": "110111",
    "country": "Colombia",
    "phoneNumber": "+57 1 234-5678",
    "email": "info@cardiosalud.com",
    "licenseNumber": "LIC-001-2025",
    "taxId": "900123456-1"
  }'

# 2. Registrar paciente en clínica
curl -X POST http://localhost:3000/api/v1/patients/clinic/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "firstName": "Juan",
    "lastName": "Pérez",
    "documentType": "CC",
    "documentNumber": "12345678",
    "birthDate": "1990-01-15",
    "gender": "male",
    "address": "Carrera 10 #20-30",
    "phoneNumber": "+57 300 123-4567",
    "email": "juan.perez@email.com",
    "emergencyContactName": "María Pérez",
    "emergencyContactPhone": "+57 300 765-4321"
  }'

# 3. Listar pacientes de clínica
curl -X GET http://localhost:3000/api/v1/patients/clinic/1 \
  -H "Authorization: Bearer {token}"

# 4. Crear cita
curl -X POST http://localhost:3000/api/v1/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "patientId": 1,
    "doctorId": 1,
    "appointmentDate": "2025-07-24",
    "appointmentTime": "10:30",
    "type": "consultation",
    "reason": "Consulta de control"
  }'
```

---

## ⚠️ **Consideraciones Importantes**

### **🔒 1. Seguridad**
- **Siempre validar el token JWT** antes de hacer requests
- **Manejar errores 403** (sin acceso a clínica) apropiadamente
- **No confiar en el frontend** para control de acceso
- **Sanitizar todas las entradas** del usuario

### **🏥 2. Multitenancy**
- **Doctores solo ven su clínica** - el backend lo garantiza automáticamente
- **Super admin debe seleccionar clínica** - implementar selector
- **Códigos de paciente son únicos por clínica** - mostrar siempre el código
- **Filtrar datos por clínica** en todos los listados

### **📱 3. UX/UI**
- **Indicar claramente la clínica activa** en la interfaz
- **Mostrar códigos de paciente por clínica** para identificación
- **Manejar casos de pacientes en múltiples clínicas**
- **Feedback claro en operaciones de registro**

### **🚀 4. Performance**
- **Implementar paginación** en listados grandes
- **Cache de datos de clínicas** (cambian poco)
- **Lazy loading** para historiales médicos
- **Optimistic updates** para mejor UX

---

## 📞 **Soporte y Documentación**

### **🔗 Enlaces Importantes**
- **API Base:** `http://localhost:3000/api/v1`
- **Documentación Swagger:** `http://localhost:3000/api/v1/docs`
- **Postman Collection:** [Solicitar al backend]

### **📧 Contacto**
- **Backend Team:** [Tu email]
- **Issues/Bugs:** [Sistema de tickets]
- **Documentación:** Este documento + Swagger

---

## 🎯 **Checklist de Implementación Frontend**

### **✅ Autenticación**
- [ ] Login/Logout
- [ ] Manejo de JWT tokens
- [ ] Interceptores para requests
- [ ] Manejo de errores de auth

### **✅ Gestión de Clínicas**
- [ ] Selector de clínica (Super Admin)
- [ ] Indicador de clínica activa
- [ ] CRUD de clínicas (Admin)

### **✅ Gestión de Pacientes**
- [ ] Registro en clínica específica
- [ ] Listado por clínica
- [ ] Búsqueda global
- [ ] Manejo de múltiples clínicas
- [ ] Mostrar códigos por clínica

### **✅ Agendamiento**
- [ ] Calendario de citas
- [ ] Filtros por doctor/paciente
- [ ] Estados de citas
- [ ] Confirmación/cancelación

### **✅ Historiales Médicos**
- [ ] Crear registros
- [ ] Visualizar historial
- [ ] Filtros por tipo
- [ ] Adjuntar archivos

### **✅ Facturación**
- [ ] Crear facturas
- [ ] Estados de pago
- [ ] Reportes básicos

### **✅ Otros Módulos**
- [ ] Inventario por clínica
- [ ] Odontograma visual
- [ ] Dashboard por clínica
- [ ] Reportes y estadísticas

---

**¡El sistema multiclinica está listo para integración frontend! 🚀**

*Cualquier duda sobre implementación, contactar al equipo de backend.*
