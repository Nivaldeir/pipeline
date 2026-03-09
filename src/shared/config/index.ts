export const APP_CONFIG = {
  name: "ProjectFlow",
  description: "Sistema de Gestão de Projetos",
  version: "1.0.0",
};

export const ROUTES = {
  home: "/",
  login: "/login",
  client: {
    dashboard: "/cliente",
  },
  developer: {
    dashboard: "/desenvolvedor",
  },
  admin: {
    dashboard: "/admin",
    requests: "/admin/solicitacoes",
    users: "/admin/usuarios",
  },
};
