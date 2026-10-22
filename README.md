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
- **Datos de prueba:** incluye cuatro profesores de ejemplo en `src/data/mockData.js`.

> **Alcance actual:** la aplicación es una interfaz de demostración. Las evaluaciones y el mensaje de confirmación se gestionan en el estado del cliente; todavía no se guardan en una base de datos ni se envían a un servicio externo.

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
│   └── utils.ts                # Utilidades compartidas
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
- npm, o pnpm si se desea usar el gestor configurado en el proyecto.

### Clonar e instalar

```bash
git clone https://github.com/Andreaport3/evaluacion-educativa.git
cd evaluacion-educativa
```

El repositorio incluye `pnpm-lock.yaml` y declara pnpm como gestor recomendado:

```bash
corepack enable
pnpm install
pnpm dev
```

Como alternativa, con npm:

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador para ver la aplicación.

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
