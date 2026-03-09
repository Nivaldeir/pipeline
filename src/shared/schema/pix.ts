import { z } from "zod";

// Tipos de chave PIX
export const pixKeyTypeSchema = z.enum([
  "cpf",
  "cnpj",
  "email",
  "telefone",
  "aleatoria",
]);

export type PixKeyType = z.infer<typeof pixKeyTypeSchema>;

// Validacao de CPF
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;

// Validacao de CNPJ
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;

// Validacao de telefone
const telefoneRegex = /^\+55\d{10,11}$|^\d{10,11}$/;

// Schema da chave PIX
export const pixKeySchema = z.object({
  tipo: pixKeyTypeSchema,
  chave: z.string().min(1, "Chave PIX e obrigatoria"),
}).refine((data) => {
  switch (data.tipo) {
    case "cpf":
      return cpfRegex.test(data.chave);
    case "cnpj":
      return cnpjRegex.test(data.chave);
    case "email":
      return z.string().email().safeParse(data.chave).success;
    case "telefone":
      return telefoneRegex.test(data.chave);
    case "aleatoria":
      return data.chave.length === 32 || data.chave.length === 36;
    default:
      return true;
  }
}, {
  message: "Chave PIX invalida para o tipo selecionado",
  path: ["chave"],
});

export type PixKey = z.infer<typeof pixKeySchema>;

// Status da transacao PIX
export const pixTransactionStatusSchema = z.enum([
  "pendente",
  "processando",
  "concluido",
  "falhou",
  "cancelado",
  "devolvido",
]);

export type PixTransactionStatus = z.infer<typeof pixTransactionStatusSchema>;

// Tipo de transacao
export const pixTransactionTypeSchema = z.enum([
  "envio",
  "recebimento",
  "devolucao",
]);

export type PixTransactionType = z.infer<typeof pixTransactionTypeSchema>;

// Schema do pagador/recebedor
export const pixParticipantSchema = z.object({
  nome: z.string().min(1, "Nome e obrigatorio"),
  documento: z.string().min(11, "CPF/CNPJ invalido").max(18),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  tipoConta: z.enum(["corrente", "poupanca", "pagamento"]).optional(),
  chave: pixKeySchema.optional(),
});

export type PixParticipant = z.infer<typeof pixParticipantSchema>;

// Schema de cobranca PIX (QR Code)
export const pixCobrancaSchema = z.object({
  id: z.string().uuid().optional(),
  txid: z.string().min(26).max(35).optional(), // ID unico da transacao
  revisao: z.number().int().min(0).default(0),
  
  // Dados do recebedor
  recebedor: pixParticipantSchema,
  
  // Valor
  valor: z.object({
    original: z.string().regex(/^\d+\.\d{2}$/, "Formato invalido. Use: 0.00"),
    modalidadeAlteracao: z.enum(["0", "1"]).default("0"), // 0 = nao permite, 1 = permite
    retirada: z.object({
      saque: z.object({
        valor: z.string().optional(),
        modalidadeAlteracao: z.enum(["0", "1"]).optional(),
        prestadorDoServicoDeSaque: z.string().optional(),
      }).optional(),
      troco: z.object({
        valor: z.string().optional(),
        modalidadeAlteracao: z.enum(["0", "1"]).optional(),
        prestadorDoServicoDeSaque: z.string().optional(),
      }).optional(),
    }).optional(),
  }),
  
  // Chave PIX do recebedor
  chave: z.string().min(1, "Chave PIX e obrigatoria"),
  
  // Informacoes adicionais
  solicitacaoPagador: z.string().max(140).optional(),
  infoAdicionais: z.array(z.object({
    nome: z.string().max(50),
    valor: z.string().max(200),
  })).max(50).optional(),
  
  // Expiracao
  calendario: z.object({
    criacao: z.string().datetime().optional(),
    expiracao: z.number().int().min(0).default(3600), // segundos
    dataDeVencimento: z.string().optional(), // YYYY-MM-DD
    validadeAposVencimento: z.number().int().min(0).optional(), // dias
  }).optional(),
  
  // Desconto
  desconto: z.object({
    modalidade: z.enum(["1", "2", "3", "4", "5", "6"]).optional(),
    descontoDataFixa: z.array(z.object({
      data: z.string(), // YYYY-MM-DD
      valorPerc: z.string(),
    })).optional(),
  }).optional(),
  
  // Juros
  juros: z.object({
    modalidade: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]).optional(),
    valorPerc: z.string().optional(),
  }).optional(),
  
  // Multa
  multa: z.object({
    modalidade: z.enum(["1", "2"]).optional(),
    valorPerc: z.string().optional(),
  }).optional(),
  
  // Abatimento
  abatimento: z.object({
    modalidade: z.enum(["1", "2"]).optional(),
    valorPerc: z.string().optional(),
  }).optional(),
  
  // Status
  status: z.enum(["ATIVA", "CONCLUIDA", "REMOVIDA_PELO_USUARIO_RECEBEDOR", "REMOVIDA_PELO_PSP"]).default("ATIVA"),
  
  // Localizacao do payload
  location: z.string().url().optional(),
  
  // QR Code
  pixCopiaECola: z.string().optional(), // Payload para copia e cola
  qrcode: z.string().optional(), // Base64 do QR Code
});

export type PixCobranca = z.infer<typeof pixCobrancaSchema>;

// Schema de transacao PIX
export const pixTransactionSchema = z.object({
  id: z.string().uuid(),
  endToEndId: z.string().min(32).max(32).optional(), // ID E2E do BACEN
  txid: z.string().optional(),
  
  // Tipo e status
  tipo: pixTransactionTypeSchema,
  status: pixTransactionStatusSchema,
  
  // Participantes
  pagador: pixParticipantSchema,
  recebedor: pixParticipantSchema,
  
  // Valores
  valor: z.number().positive("Valor deve ser positivo"),
  valorOriginal: z.number().positive().optional(),
  desconto: z.number().min(0).optional(),
  juros: z.number().min(0).optional(),
  multa: z.number().min(0).optional(),
  abatimento: z.number().min(0).optional(),
  
  // Descricao
  descricao: z.string().max(140).optional(),
  
  // Informacoes adicionais
  infoPagador: z.string().max(140).optional(),
  
  // Datas
  dataCriacao: z.string().datetime(),
  dataEfetivacao: z.string().datetime().optional(),
  
  // Devolucao
  devolucoes: z.array(z.object({
    id: z.string(),
    rtrId: z.string().optional(), // ID de retorno
    valor: z.number().positive(),
    natureza: z.enum(["ORIGINAL", "RETIRADA"]).optional(),
    descricao: z.string().max(140).optional(),
    horario: z.object({
      solicitacao: z.string().datetime(),
      liquidacao: z.string().datetime().optional(),
    }),
    status: z.enum(["EM_PROCESSAMENTO", "DEVOLVIDO", "NAO_REALIZADO"]),
    motivo: z.string().optional(),
  })).optional(),
});

export type PixTransaction = z.infer<typeof pixTransactionSchema>;

// Schema para criar cobranca PIX simples
export const createPixCobrancaSchema = z.object({
  chave: z.string().min(1, "Chave PIX e obrigatoria"),
  valor: z.string().regex(/^\d+\.\d{2}$/, "Formato invalido. Use: 0.00"),
  descricao: z.string().max(140).optional(),
  nomeRecebedor: z.string().min(1, "Nome do recebedor e obrigatorio"),
  cidadeRecebedor: z.string().min(1, "Cidade do recebedor e obrigatoria"),
  expiracao: z.number().int().min(60).default(3600), // segundos, minimo 1 min
  identificador: z.string().max(25).optional(), // txid simplificado
});

export type CreatePixCobranca = z.infer<typeof createPixCobrancaSchema>;

// Schema para enviar PIX
export const sendPixSchema = z.object({
  chaveDestino: z.string().min(1, "Chave PIX de destino e obrigatoria"),
  valor: z.number().positive("Valor deve ser positivo"),
  descricao: z.string().max(140).optional(),
});

export type SendPix = z.infer<typeof sendPixSchema>;

// Schema para devolucao PIX
export const pixRefundSchema = z.object({
  endToEndId: z.string().min(32).max(32),
  valor: z.number().positive("Valor deve ser positivo"),
  natureza: z.enum(["ORIGINAL", "RETIRADA"]).optional(),
  descricao: z.string().max(140).optional(),
});

export type PixRefund = z.infer<typeof pixRefundSchema>;

// Labels para exibicao
export const PIX_KEY_TYPE_LABELS: Record<PixKeyType, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  email: "E-mail",
  telefone: "Telefone",
  aleatoria: "Chave Aleatoria",
};

export const PIX_STATUS_LABELS: Record<PixTransactionStatus, string> = {
  pendente: "Pendente",
  processando: "Processando",
  concluido: "Concluido",
  falhou: "Falhou",
  cancelado: "Cancelado",
  devolvido: "Devolvido",
};

export const PIX_STATUS_COLORS: Record<PixTransactionStatus, string> = {
  pendente: "bg-yellow-500/20 text-yellow-500",
  processando: "bg-blue-500/20 text-blue-500",
  concluido: "bg-emerald-500/20 text-emerald-500",
  falhou: "bg-destructive/20 text-destructive",
  cancelado: "bg-muted text-muted-foreground",
  devolvido: "bg-purple-500/20 text-purple-500",
};
