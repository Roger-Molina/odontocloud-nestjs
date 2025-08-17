#!/bin/bash

# =====================================================
# SCRIPT MAESTRO PARA CARGAR TODOS LOS CATÁLOGOS
# =====================================================
# Este script ejecuta todos los archivos de semillas en el orden correcto
# Asegúrate de tener las variables de entorno configuradas o modifica las credenciales

# Configuración de base de datos
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5433}
DB_NAME=${DB_NAME:-multiclinica}
DB_USER=${DB_USER:-my_user}
DB_PASSWORD=${DB_PASSWORD:-my_password}

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Iniciando carga de catálogos del sistema multiclinica...${NC}"
echo "=============================================="

# Función para ejecutar un archivo SQL
execute_sql_file() {
    local file=$1
    local description=$2
    
    echo -e "${YELLOW}📄 Ejecutando: $description${NC}"
    
    if [ -f "$file" ]; then
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $description - COMPLETADO${NC}"
        else
            echo -e "${RED}❌ $description - ERROR${NC}"
            echo "Archivo: $file"
            return 1
        fi
    else
        echo -e "${RED}❌ Archivo no encontrado: $file${NC}"
        return 1
    fi
    
    echo ""
}

# Directorio de seeds
SEEDS_DIR="./database/seeds"

echo -e "${YELLOW}🏥 Cargando catálogos básicos...${NC}"

# 1. Especialidades (independiente)
execute_sql_file "$SEEDS_DIR/01-specialties-seed.sql" "Especialidades médicas"

# 2. Métodos de pago (independiente)
execute_sql_file "$SEEDS_DIR/02-payment-methods-seed.sql" "Métodos de pago"

# 3. Catálogos de facturación (independientes)
execute_sql_file "$SEEDS_DIR/03-billing-catalogs-seed.sql" "Catálogos de facturación"

# 4. Catálogos de gastos (independientes)
execute_sql_file "$SEEDS_DIR/04-expense-catalogs-seed.sql" "Catálogos de gastos"

# 5. Diagnósticos (puede depender de clínicas)
execute_sql_file "$SEEDS_DIR/diagnoses-seed.sql" "Diagnósticos médicos"

# 6. Tratamientos (independiente)
execute_sql_file "$SEEDS_DIR/treatments-seed.sql" "Tratamientos dentales"

echo -e "${GREEN}🎉 ¡Carga de catálogos completada!${NC}"
echo "=============================================="

# Mostrar estadísticas finales
echo -e "${YELLOW}📊 Estadísticas de carga:${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
SELECT 
    'Especialidades' as catalogo, COUNT(*) as registros FROM specialties
UNION ALL
SELECT 
    'Métodos de Pago' as catalogo, COUNT(*) as registros FROM payment_methods
UNION ALL
SELECT 
    'Estados de Factura' as catalogo, COUNT(*) as registros FROM invoice_status
UNION ALL
SELECT 
    'Tipos de Factura' as catalogo, COUNT(*) as registros FROM invoice_type
UNION ALL
SELECT 
    'Estados de Pago' as catalogo, COUNT(*) as registros FROM payment_status
UNION ALL
SELECT 
    'Tipos de Descuento' as catalogo, COUNT(*) as registros FROM discount_type
UNION ALL
SELECT 
    'Categorías de Gasto' as catalogo, COUNT(*) as registros FROM expense_category
UNION ALL
SELECT 
    'Estados de Gasto' as catalogo, COUNT(*) as registros FROM expense_status
UNION ALL
SELECT 
    'Diagnósticos' as catalogo, COUNT(*) as registros FROM diagnoses
UNION ALL
SELECT 
    'Tratamientos' as catalogo, COUNT(*) as registros FROM treatments
ORDER BY catalogo;
"

echo -e "${GREEN}✨ Todos los catálogos han sido cargados exitosamente.${NC}"
