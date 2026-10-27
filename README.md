# Mis Profesores

Aplicación web para explorar profesores universitarios y compartir evaluaciones de forma sencilla. Incluye un dashboard con búsqueda y tarjetas de profesores, además de un formulario interactivo de evaluación.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide-F24E1E?logo=lucide&logoColor=white)](https://lucide.dev/)

## Características principales

- **Búsqueda interactiva:** filtra profesores por nombre, materia o universidad.
- **Dashboard de profesores:** presenta nombre, universidad, materia, puntuación promedio de 1 a 5 estrellas y número de evaluaciones.
- **Formulario de evaluación:** cada tarjeta incluye un botón **Evaluar** que abre un modal.
- **Cuatro criterios calificables:** Calidad de la clase, Actitud, Puntualidad y Dominio del tema, cada uno con una escala interactiva de 1 a 5 estrellas.
- **Comentario y privacidad:** permite añadir un comentario breve y elegir si la evaluación es anónima.
- **Estados de interfaz:** el formulario valida que todos los criterios tengan una puntuación antes de habilitar el envío y muestra una confirmación al completarlo.
- **Datos iniciales:** incluye un seed idempotente para cargar cuatro profesores, sus universidades y materias en PostgreSQL.
- **Moderación:** las evaluaciones se guardan con estado `PENDING_REVIEW`; no se publican ni actualizan promedios en esta etapa.

> **Alcance actual:** los datos iniciales y las evaluaciones se guardan en PostgreSQL. El panel de moderación y la lectura dinámica de los datos para el dashboard pertenecen a la siguiente fase.

## Tech Stack

- ⚛️ **React 19** — componentes y estado de la interfaz.
- ▲ **Next.js 16 (App Router)** — framework y entorno de desarrollo.
- 🎨 **Tailwind CSS 4** — estilos y diseño adaptable.
- ✨ **Lucide React** — iconografía SVG.
- 📘 **TypeScript** — tipos para componentes y utilidades.
- 📦 **pnpm** — gestor indicado por el proyecto y su archivo de bloqueo.

## Estructura del proyecto

```text
.
├── app/
│   ├── globals.css             # Estilos globales y entrada de Tailwind
│   ├── layout.tsx              # Layout raíz y metadatos
│   └── page.tsx                # Dashboard y modal de evaluación
├── components/
│   └── ui/
│       └── button.tsx          # Componente Button reutilizable
├── lib/
│   ├── prisma.ts               # Singleton de Prisma Client
│   └── utils.ts                # Utilidades compartidas
├── prisma/
│   ├── schema.prisma           # Modelos y estados de evaluación
│   └── seed.ts                 # Carga de universidades, materias y profesores
├── src/
│   ├── components/
│   │   └── TeacherAvatar.tsx   # Avatar del profesor
│   ├── data/
│   │   └── mockData.js         # Datos iniciales de cuatro profesores
│   └── utils/
│       └── teacher.ts          # Criterios y utilidades de profesores
├── public/                     # Iconos e imágenes estáticas
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
└── postcss.config.mjs
```

## Instalación y configuración

### Requisitos previos

- Node.js compatible con la versión instalada de Next.js.
- pnpm, gestor configurado por el proyecto.

### Clonar e instalar

```bash
git clone https://github.com/Andreaport3/evaluacion-educativa.git
cd evaluacion-educativa
```

El repositorio incluye `pnpm-lock.yaml` y declara pnpm como gestor recomendado:

```bash
corepack enable
pnpm install
docker compose up -d database
pnpm db:migrate
pnpm db:generate
pnpm exec prisma db seed
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador para ver la aplicación.

Las evaluaciones nuevas se guardan con sus cuatro calificaciones, comentario opcional y preferencia de anonimato. Todas quedan en `PENDING_REVIEW` hasta que se implemente y utilice el flujo administrativo; la confirmación del formulario indica que la evaluación debe ser revisada antes de publicarse.

### Otros comandos

```bash
pnpm build   # Genera la versión de producción
pnpm start   # Sirve la versión de producción después de compilar
```

## Vista previa / Capturas

Añade las capturas de pantalla del proyecto en `docs/images/` y actualiza las rutas si eliges otra ubicación.

### Dashboard principal

![Placeholder de captura del dashboard principal](docs/images/dashboard.png)

### Modal de evaluación

![Placeholder de captura del modal de evaluación](docs/images/modal-evaluacion.png)

## Licencia y contacto

**Licencia:** aún no especificada en el repositorio. Añade un archivo `LICENSE` y actualiza esta sección antes de distribuir el proyecto.

**Contacto:** para preguntas o sugerencias, abre una incidencia en el [repositorio de GitHub](https://github.com/Andreaport3/evaluacion-educativa/issues).
