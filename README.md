# Gestor de Gastos - Sistema de Gestión de Gastos Corporativos

Sistema web desarrollado con Next.js para la gestión y seguimiento de gastos corporativos con autenticación por dominio y generación de reportes.

## 🚀 Características

- **Autenticación Segura**: Registro y login restringido al dominio @pueblaequipo.com.ar
- **Gestión de Gastos**: Registro completo de gastos con detalles, montos y documentación
- **Carga de Documentos**: Integración con Supabase para almacenar facturas y comprobantes
- **Panel de Administración**: Dashboard completo para administradores
- **Generación de Reportes**: Exportación de reportes detallados en formato HTML
- **Responsive Design**: Interfaz adaptativa para escritorio y móviles

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Almacenamiento**: Supabase Storage
- **Autenticación**: Sistema personalizado con verificación por dominio
- **Despliegue**: Preparado para Vercel

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm
- PostgreSQL (puede usar CloudClusters u otro proveedor)
- Cuenta de Supabase para almacenamiento de archivos

### 1. Clonar el repositorio

```bash
git clone https://github.com/[tu-usuario]/gestor-gastos.git
cd gestor-gastos
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# Database
DATABASE_URL="postgresql://usuario:password@host:puerto/nombre_db?schema=public"

# Código de verificación único
VERIFICATION_CODE="tu-codigo-verificacion"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"

# Next Auth (opcional para futuras expansiones)
NEXTAUTH_SECRET="tu-secret-muy-seguro"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy
```

### 5. Ejecutar en modo desarrollo

```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📊 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── api/               # Rutas de API
│   ├── admin/             # Panel de administración
│   ├── expenses/          # Gestión de gastos
│   └── globals.css        # Estilos globales
├── components/            # Componentes React reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── expense-form.tsx   # Formularios específicos
├── lib/                   # Utilidades y configuraciones
│   ├── auth.ts           # Autenticación
│   ├── types.ts          # Tipos TypeScript
│   └── utils.ts          # Funciones utilitarias
├── prisma/               # Esquema y migraciones de base de datos
└── public/               # Archivos estáticos
```

## 🔑 Funcionalidades Principales

### Autenticación
- Registro restringido a emails del dominio @pueblaequipo.com.ar
- Código de verificación obligatorio durante el registro
- Sesiones persistentes con localStorage

### Gestión de Gastos
- Formulario completo para registro de gastos
- Campos: razón, detalle, monto, moneda, tipo de cambio
- Canal de pago y gestión de cuotas
- Carga de documentos (imágenes y PDFs)

### Panel de Administración
- Vista de todos los usuarios registrados
- Generación de reportes por usuario
- Estadísticas de gastos por período
- Exportación de reportes en formato HTML

## 🚀 Despliegue

### Despliegue en Vercel

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Variables de entorno para producción

Asegúrate de configurar todas las variables de entorno necesarias:
- `DATABASE_URL`: URL de tu base de datos PostgreSQL
- `VERIFICATION_CODE`: Código de verificación para nuevos usuarios
- `NEXT_PUBLIC_SUPABASE_URL` y keys de Supabase
- `NEXTAUTH_SECRET` y `NEXTAUTH_URL` para producción

## 📝 Uso

1. **Registro**: Los usuarios deben registrarse con email @pueblaequipo.com.ar y el código de verificación
2. **Login**: Acceso con email y contraseña
3. **Cargar Gastos**: Completar formulario con todos los detalles del gasto
4. **Administración**: Los administradores pueden generar reportes y gestionar usuarios

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte o consultas, contacta a [tu-email@pueblaequipo.com.ar](mailto:tu-email@pueblaequipo.com.ar)# Deployment sync 12/04/2025 13:45:53
