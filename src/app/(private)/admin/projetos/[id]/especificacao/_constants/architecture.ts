export const SOLUTION_TYPES = [
  { value: "rpa", label: "RPA" },
  { value: "api", label: "API" },
  { value: "ia-ocr", label: "IA/OCR" },
  { value: "power-platform", label: "Power Platform" },
  { value: "python", label: "Python" },
  { value: "integracao", label: "Integração" },
  { value: "dashboard", label: "Dashboard" },
  { value: "outro", label: "Outro" },
] as const;

export const MAIN_TOOLS = [
  { value: "python", label: "Python" },
  { value: "rocketbot", label: "Rocketbot" },
  { value: "automation-anywhere", label: "Automation Anywhere" },
  { value: "power-automate", label: "Power Automate" },
  { value: "power-apps", label: "Power Apps" },
  { value: "outro", label: "Outro" },
] as const;

export const EXECUTION_STRATEGIES = [
  { value: "agendada", label: "Agendada" },
  { value: "manual", label: "Manual" },
  { value: "trigger-email", label: "Trigger por e-mail" },
  { value: "trigger-api", label: "Trigger por API" },
  { value: "tempo-real", label: "Tempo real" },
] as const;
