
const PROJECT_TYPES = [
  // Contabilidade
  { value: "contabil-fiscal", label: "Contabilidade - Gestao Fiscal" },
  { value: "contabil-folha", label: "Contabilidade - Folha de Pagamento" },
  { value: "contabil-balanco", label: "Contabilidade - Balanco e DRE" },
  { value: "contabil-obrigacoes", label: "Contabilidade - Obrigacoes Acessorias" },
  { value: "contabil-consultoria", label: "Contabilidade - Consultoria" },
  // RPA
  { value: "rpa-automacao", label: "RPA - Automacao de Processos" },
  { value: "rpa-integracao", label: "RPA - Integracao de Sistemas" },
  { value: "rpa-extracao", label: "RPA - Extracao de Dados" },
  { value: "rpa-relatorios", label: "RPA - Geracao de Relatorios" },
  { value: "rpa-validacao", label: "RPA - Validacao e Conferencia" },
  // Desenvolvimento
  { value: "dev-sistema-web", label: "Desenvolvimento - Sistema Web / SaaS" },
  { value: "dev-app-mobile", label: "Desenvolvimento - Aplicativo Mobile" },
  { value: "dev-api", label: "Desenvolvimento - API / Backend" },
  { value: "dev-website", label: "Desenvolvimento - Website / Landing Page" },
  { value: "dev-portal", label: "Desenvolvimento - Portal / Intranet" },
  { value: "dev-manutencao", label: "Desenvolvimento - Manutencao / Melhorias" },
  { value: "dev-integracao", label: "Desenvolvimento - Integracao de Sistemas" },
  // Outros
  { value: "consultoria", label: "Consultoria Tecnica" },
  { value: "outro", label: "Outro" },
];

const PLATFORMS = [
  { value: "web", label: "Web (Desktop e Mobile)" },
  { value: "ios", label: "iOS (iPhone/iPad)" },
  { value: "android", label: "Android" },
  { value: "ambos-mobile", label: "iOS e Android" },
  { value: "desktop", label: "Desktop (Windows/Mac)" },
  { value: "todas", label: "Todas as plataformas" },
];

const URGENCY_LEVELS = [
  { value: "baixa", label: "Baixa - Sem pressa definida" },
  { value: "media", label: "Média - Próximos 2-3 meses" },
  { value: "alta", label: "Alta - Próximo mês" },
  { value: "urgente", label: "Urgente - O mais rápido possível" },
];

const TARGET_AUDIENCES = [
  { value: "b2b", label: "Empresas (B2B)" },
  { value: "b2c", label: "Consumidores finais (B2C)" },
  { value: "interno", label: "Uso interno da empresa" },
  { value: "ambos", label: "Empresas e consumidores" },
];

const FEATURE_SUGGESTIONS = [
  // Contabilidade
  "Emissao de notas fiscais",
  "Calculo de impostos automatico",
  "Conciliacao bancaria",
  "Controle de contas a pagar/receber",
  "Geracao de guias (DARF, GPS, DAS)",
  "Balancete e DRE automatizado",
  // RPA
  "Leitura de XMLs/NFes",
  "Preenchimento automatico de sistemas",
  "Extracao de dados de PDFs",
  "Envio automatico de emails",
  "Validacao de cadastros",
  "Integracao com ERP",
  // Desenvolvimento
  "Login / Cadastro de usuarios",
  "Dashboard / Painel administrativo",
  "Relatorios e graficos",
  "Notificacoes (email/push)",
  "Upload de arquivos",
  "Integracao com APIs externas",
  "Exportacao de dados (PDF/Excel)",
  "Controle de permissoes/usuarios",
];

export { PROJECT_TYPES, PLATFORMS, URGENCY_LEVELS, TARGET_AUDIENCES, FEATURE_SUGGESTIONS };