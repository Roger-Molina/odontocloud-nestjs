# Sistema Multiclinica - Relaciones entre Entidades

## Resumen del Alcance del Sistema

El sistema multiclinica es una plataforma integral de gestión médica que incluye:

### Módulos Principales
1. **Autenticación y Usuarios** - Control de acceso y gestión de usuarios
2. **Clínicas** - Gestión de múltiples centros médicos
3. **Pacientes** - Registro y administración de pacientes
4. **Médicos** - Gestión del personal médico
5. **Citas** - Sistema de agendamiento de citas médicas
6. **Historias Clínicas** - Registros médicos completos
7. **Facturación** - Sistema de facturación y pagos
8. **Inventario** - Control de medicamentos y suministros médicos
9. **Odontograma** - Sistema especializado para odontología
10. **Reportes** - Generación de reportes y estadísticas

## Diagrama de Relaciones de Entidades

```
                    ┌─────────────┐
                    │    User     │ (Central - Autenticación)
                    │ roles, auth │
                    └─────┬───────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
   ┌──────────┐    ┌─────────────┐   ┌──────────┐
   │ Patient  │    │   Doctor    │   │  Clinic  │
   │ (1:1)    │    │   (1:1)     │   │(Independ)│
   └────┬─────┘    └─────┬───────┘   └──────────┘
        │                │
        │                │
        └────────┬───────┘
                 │
                 ▼
        ┌─────────────────┐
        │   Appointment   │ (Citas médicas)
        │  Patient + Doc  │
        └─────────┬───────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
┌─────────────┐ ┌──────────┐ ┌─────────────┐
│MedicalRecord│ │ Invoice  │ │ Odontogram  │
│   (1:N)     │ │  (1:N)   │ │   (1:N)     │
└─────────────┘ └────┬─────┘ └─────┬───────┘
                     │             │
                     ▼             ▼
               ┌──────────┐  ┌─────────────┐
               │ Payment  │  │ToothRecord  │
               │ (1:N)    │  │   (1:N)     │
               └──────────┘  └─────────────┘

        ┌─────────────────┐
        │   Inventory     │ (Sistema independiente)
        │ Items + Movs    │
        └─────────────────┘
```

## Entidades y Sus Relaciones Detalladas

### 1. User (Usuario Central)
**Tipo:** Entidad central de autenticación
**Campos clave:** 
- `email` (único), `password`, `role`, `status`
- Roles: SUPER_ADMIN, ADMIN, DOCTOR, NURSE, RECEPTIONIST, PATIENT

**Relaciones:**
- **1:1 con Patient** (opcional) - Un usuario puede ser un paciente
- **1:1 con Doctor** (requerido para doctores) - Un usuario doctor debe tener perfil médico

### 2. Patient (Paciente)
**Tipo:** Perfil extendido de paciente
**Campos clave:** 
- `patientCode` (único), datos personales, información médica básica
- `bloodType`, `allergies`, `medicalHistory`

**Relaciones:**
- **N:1 con User** (opcional) - Referencia al usuario si el paciente tiene cuenta
- **1:N con Appointment** - Un paciente puede tener múltiples citas
- **1:N con MedicalRecord** - Historial médico completo
- **1:N con Invoice** - Facturas asociadas
- **1:N con Odontogram** - Registros odontológicos

### 3. Doctor (Médico)
**Tipo:** Perfil profesional médico
**Campos clave:** 
- `doctorCode`, `medicalLicense` (únicos), `specialization`
- `consultationFee`, `consultationDuration`

**Relaciones:**
- **N:1 con User** (requerido) - Todo doctor debe tener usuario
- **1:N con Appointment** - Citas asignadas al doctor
- **1:N con MedicalRecord** - Registros médicos creados

### 4. Clinic (Clínica)
**Tipo:** Entidad independiente para múltiples centros
**Campos clave:** 
- `clinicCode`, `name`, ubicación completa
- `openingHours` (JSON), `licenseNumber`, `taxId`

**Relaciones:**
- **Independiente** - No tiene relaciones directas (preparado para futuras expansiones)

### 5. Appointment (Cita Médica)
**Tipo:** Entidad central de agendamiento
**Campos clave:** 
- `appointmentCode`, fecha/hora, duración, estado, tipo
- Estados: SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

**Relaciones:**
- **N:1 con Patient** (requerido) - Cada cita pertenece a un paciente
- **N:1 con Doctor** (requerido) - Cada cita es atendida por un doctor
- **1:N con MedicalRecord** (opcional) - Registros médicos generados
- **1:1 con Invoice** (opcional) - Factura asociada

### 6. MedicalRecord (Historia Clínica)
**Tipo:** Registro médico completo
**Campos clave:** 
- `recordCode`, tipo de registro, diagnóstico, tratamiento
- `vitalSigns` (JSON), `labResults` (JSON), `attachments` (JSON)

**Relaciones:**
- **N:1 con Patient** (requerido) - Pertenece a un paciente
- **N:1 con Doctor** (requerido) - Creado por un doctor
- **N:1 con Appointment** (opcional) - Puede estar asociado a una cita

### 7. Billing (Facturación)
**Tipo:** Sistema completo de facturación
**Entidades:** `Invoice`, `InvoiceItem`, `Payment`

#### Invoice (Factura)
**Campos clave:** 
- `invoiceNumber`, fechas, montos, estado de pago
- Estados: DRAFT, PENDING, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED

**Relaciones:**
- **N:1 con Patient** (requerido) - Factura dirigida al paciente
- **N:1 con Appointment** (opcional) - Factura por servicios de cita
- **1:N con InvoiceItem** - Detalles de la factura
- **1:N con Payment** - Pagos realizados

#### InvoiceItem (Detalle de Factura)
**Relaciones:**
- **N:1 con Invoice** - Pertenece a una factura

#### Payment (Pago)
**Relaciones:**
- **N:1 con Invoice** - Pago aplicado a una factura

### 8. Inventory (Inventario Médico)
**Tipo:** Sistema independiente de gestión de inventario
**Entidades:** `InventoryItem`, `InventoryMovement`

#### InventoryItem (Artículo de Inventario)
**Campos clave:** 
- `itemCode`, categoría, stock actual/mínimo/máximo
- Categorías: MEDICATION, EQUIPMENT, SUPPLY, CONSUMABLE, INSTRUMENT

**Relaciones:**
- **1:N con InventoryMovement** - Movimientos del artículo

#### InventoryMovement (Movimiento de Inventario)
**Relaciones:**
- **N:1 con InventoryItem** - Movimiento de un artículo específico

### 9. Odontogram (Sistema Odontológico)
**Tipo:** Sistema especializado para odontología
**Entidades:** `Odontogram`, `ToothRecord`

#### Odontogram (Odontograma)
**Relaciones:**
- **N:1 con Patient** - Odontograma de un paciente
- **1:N con ToothRecord** - Registros de dientes individuales

#### ToothRecord (Registro de Diente)
**Campos clave:** 
- `toothNumber`, estado del diente, superficies afectadas
- Estados: HEALTHY, CARIES, FILLED, CROWN, EXTRACTION, MISSING, IMPLANT, ROOT_CANAL

**Relaciones:**
- **N:1 con Odontogram** - Pertenece a un odontograma

## Flujos de Trabajo Principales

### 1. Flujo de Cita Médica
```
Patient → Appointment → Doctor
    ↓
MedicalRecord (durante/después de la cita)
    ↓
Invoice (facturación del servicio)
    ↓
Payment (pago de la factura)
```

### 2. Flujo de Usuario
```
User (registro) → Patient/Doctor (perfil específico)
    ↓
Appointment (agendamiento)
    ↓
MedicalRecord (atención médica)
```

### 3. Flujo Odontológico
```
Patient → Odontogram (examen dental)
    ↓
ToothRecord × N (registro por diente)
```

### 4. Flujo de Inventario
```
InventoryItem (artículo médico)
    ↓
InventoryMovement (entrada/salida/ajustes)
```

## Características Técnicas Implementadas

### Base Entity
Todas las entidades extienden `BaseEntity` que incluye:
- `id` (PK autoincremental)
- `createdAt` (timestamp de creación)
- `updatedAt` (timestamp de actualización)
- `deletedAt` (soft delete)

### Validaciones y Constraints
- Códigos únicos para todas las entidades principales
- Validaciones de enum para estados y categorías
- Campos obligatorios vs opcionales bien definidos
- Relaciones con foreign keys apropiadas

### Flexibilidad del Sistema
- Campos JSON para datos complejos (signos vitales, resultados de laboratorio)
- Enums extensibles para estados y categorías
- Relaciones opcionales para casos especiales
- Sistema preparado para múltiples clínicas

## Conclusión

El sistema multiclinica implementa una arquitectura robusta y escalable que permite:

1. **Gestión integral de pacientes** - Desde registro hasta historial completo
2. **Agendamiento eficiente** - Control completo de citas médicas
3. **Registro médico completo** - Historias clínicas detalladas
4. **Facturación integrada** - Sistema completo de billing y pagos
5. **Control de inventario** - Gestión de medicamentos y suministros
6. **Especialización odontológica** - Sistema específico para odontología
7. **Arquitectura modular** - Fácil mantenimiento y extensión
8. **Preparado para múltiples clínicas** - Escalabilidad horizontal

Todas las relaciones están correctamente implementadas con TypeORM y el sistema está listo para producción con endpoints REST completamente funcionales.
