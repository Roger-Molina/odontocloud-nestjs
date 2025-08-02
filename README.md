# 🏥 Sistema Multiclinica

Sistema de gestión integral para clínicas médicas construido con NestJS, TypeScript, TypeORM y PostgreSQL.

## 🚀 Características

- **Gestión de Usuarios**: Sistema completo de usuarios con roles (Admin, Doctor, Enfermera, Recepcionista, Paciente)
- **Gestión de Pacientes**: Registro completo de pacientes con historias clínicas
- **Gestión de Médicos**: Administración de médicos, especialidades y horarios
- **Sistema de Citas**: Programación y gestión de citas médicas
- **Historias Clínicas**: Registro detallado de consultas y tratamientos
- **Facturación**: Sistema de facturación y pagos
- **Inventario**: Control de medicamentos y equipos médicos
- **Reportes**: Generación de reportes y estadísticas
- **Autenticación JWT**: Sistema seguro de autenticación y autorización

## 🏗️ Arquitectura

El proyecto sigue los principios de arquitectura limpia con:

- **Módulos por funcionalidad**: Cada módulo maneja una funcionalidad específica
- **Separación de responsabilidades**: Controllers, Services, Entities y DTOs
- **Base de datos**: PostgreSQL con TypeORM
- **Documentación API**: Swagger/OpenAPI integrado
- **Validación**: class-validator para validación de datos

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v13 o superior)
- npm o yarn

## ⚙️ Configuración del Proyecto

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd multiclinica-nuevo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
DB_DATABASE=multiclinica

# JWT Configuration
JWT_SECRET=tu-clave-secreta-muy-segura
```

### 4. Configurar la base de datos

Crea la base de datos PostgreSQL:

```sql
CREATE DATABASE multiclinica;
```

### 5. Ejecutar migraciones (cuando estén disponibles)

```bash
npm run migration:run
```

## 🚀 Ejecutar la aplicación

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

La aplicación estará disponible en:
- **API**: http://localhost:3000/api/v1
- **Documentación**: http://localhost:3000/api/v1/docs

## 🧪 Ejecutar pruebas

```bash
# Pruebas unitarias
npm run test

# Pruebas e2e
npm run test:e2e

# Cobertura de pruebas
npm run test:cov
```

## 📁 Estructura del Proyecto

```
src/
├── modules/              # Módulos de funcionalidad
│   ├── auth/            # Autenticación y autorización
│   ├── users/           # Gestión de usuarios
│   ├── patients/        # Gestión de pacientes
│   ├── doctors/         # Gestión de médicos
│   ├── appointments/    # Sistema de citas
│   ├── medical-records/ # Historias clínicas
│   ├── billing/         # Facturación
│   ├── inventory/       # Inventario
│   └── reports/         # Reportes
├── common/              # Utilidades compartidas
│   ├── entities/        # Entidades base
│   ├── guards/          # Guards de autenticación
│   ├── decorators/      # Decoradores personalizados
│   └── filters/         # Filtros de excepción
├── config/              # Configuraciones
└── database/            # Migraciones y seeds
```

## 🔐 Roles de Usuario

- **SUPER_ADMIN**: Acceso completo al sistema
- **ADMIN**: Administración de clínicas
- **DOCTOR**: Gestión de pacientes y citas
- **NURSE**: Asistencia médica
- **RECEPTIONIST**: Gestión de citas y recepción
- **PATIENT**: Acceso limitado a información personal

## 📚 Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript
- **Base de datos**: PostgreSQL, TypeORM
- **Autenticación**: JWT, Passport
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest

## 🤝 Contribuir

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
