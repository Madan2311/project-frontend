# project-frontend

Este repositorio contiene la parte frontend del sistema de gestión logística. La aplicación está desarrollada con React, TypeScript y Material‑UI, e incluye vistas para autenticación, gestión de envíos, seguimiento en tiempo real y reportes interactivos. La comunicación con el backend se realiza mediante API REST y Socket.io para actualizaciones en tiempo real.

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Pasos de Instalación](#instalación-y-configuración)
- [Ejecución](#ejecución)
---

## Descripción

La aplicación frontend es la interfaz de usuario del sistema de gestión logística. Permite a los usuarios autenticados (según su rol) realizar operaciones como:
- Iniciar sesión y registrarse.
- Crear envíos.
- Consultar, asignar y seguir envíos en tiempo real.
- Visualizar reportes interactivos con gráficos y tablas.

La comunicación con el backend se realiza mediante API REST para la mayoría de operaciones y mediante Socket.io para recibir actualizaciones en tiempo real.

---

## Tecnologías

- **React** y **TypeScript**
- **Material‑UI** para los componentes de la interfaz
- **Recharts** para gráficos interactivos
- **React Router** para la navegación entre vistas
- **Context API** para el manejo del estado global (autenticación, etc.)
- **Socket.io-client** para comunicación en tiempo real

---

### Pasos de Instalación

1. **Clona el repositorio:**

   git clone https://github.com/Madan2311/project-frontend.git
   cd project-frontend

2. **Instala dependendias:**
   npm install

### Ejecución
   npm run dev