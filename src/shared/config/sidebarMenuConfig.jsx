export const MENUS_POR_ROL = {
  inquilino: {
    titulo: 'Mi Cuenta',
    seccionInicial: 'contacto',
    grupos: [
      {
        subtitulo: 'Mi Cuenta',
        items: [
          {
            id: 'contacto',
            label: 'Información de contacto',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
          },
          {
            id: 'favoritos',
            label: 'Mis Favoritos',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={color} viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ),
          },
          {
            id: 'citas',
            label: 'Mis Citas',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
          },
          {
            id: 'alertas',
            label: 'Alertas de precio',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            ),
          },
        ],
      },
      {
        subtitulo: 'Inmuebles',
        items: [
          {
            id: 'asignados',
            label: 'Inmuebles Asignados',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            ),
          },
          {
            id: 'seguridad',
            label: 'Seguridad',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ),
          },
        ],
      },
    ],
  },

  propietario: {
    titulo: 'Panel Propietario',
    seccionInicial: 'metricas',
    grupos: [
      {
        subtitulo: 'Mi Cuenta',
        items: [
          {
            id: 'contacto',
            label: 'Información de contacto',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
          },
          {
            id: 'seguridad',
            label: 'Seguridad',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ),
          },
        ],
      },
      {
        subtitulo: 'Gestión Inmobiliaria',
        items: [
          {
            id: 'metricas',
            label: 'Métricas y Rendimiento',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            ),
          },
          {
            id: 'propiedades',
            label: 'Mis Propiedades',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            ),
          },
        ],
      },
    ],
  },

  agente: {
    titulo: 'Panel Agente',
    seccionInicial: 'cartera',
    grupos: [
      {
        subtitulo: 'Mi Cuenta',
        items: [
          {
            id: 'perfil',
            label: 'Mi Perfil de Agente',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            ),
          },
          {
            id: 'seguridad',
            label: 'Seguridad',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ),
          },
        ],
      },
      {
        subtitulo: 'Operaciones',
        items: [
          {
            id: 'cartera',
            label: 'Cartera de Propiedades',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            ),
          },
          {
            id: 'citas',
            label: 'Agenda de Citas',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
          },
          {
            id: 'clientes',
            label: 'Clientes e Interesados',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            id: 'consultas',
            label: 'Consultas y Mensajes',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            ),
          },
        ],
      },
    ],
  },

  admin: {
    titulo: 'Panel Administrador',
    seccionInicial: 'dashboard',
    grupos: [
      {
        subtitulo: 'General',
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard / Métricas',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            ),
          },
          {
            id: 'configuracion',
            label: 'Configuración',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            ),
          },
        ],
      },
      {
        subtitulo: 'Gestión Global',
        items: [
          {
            id: 'usuarios',
            label: 'Usuarios y Roles',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            id: 'inmuebles',
            label: 'Todos los Inmuebles',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            ),
          },
          {
            id: 'contratos',
            label: 'Contratos y Operaciones',
            icon: (color) => (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            ),
          }
        ],
      },
    ],
  },
}
