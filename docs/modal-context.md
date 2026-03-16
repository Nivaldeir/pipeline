# Modal Context - Documentação

Sistema completo de gerenciamento de modais para React/Next.js com suporte a múltiplos modais empilhados, diferentes posições, animações e callbacks.

## 📋 Índice

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso Básico](#uso-básico)
- [API Reference](#api-reference)
- [Tipos](#tipos)
- [Opções de Modal](#opções-de-modal)
- [Posições](#posições)
- [Tamanhos](#tamanhos)
- [Modais Empilhados](#modais-empilhados)
- [Exemplos](#exemplos)

## 🚀 Instalação

O sistema já está configurado no projeto. Certifique-se de que o `ModalProvider` está envolvendo sua aplicação.

## ⚙️ Configuração

### 1. Adicionar o Provider no Layout

```tsx
import { ModalProvider } from "@/shared/contexts/modal-context";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
```

## 📖 Uso Básico

### Criar um Componente de Modal

```tsx
"use client";

import { ModalProps } from "@/shared/types/modal";

interface MeuModalData {
  title: string;
  message: string;
}

export function MeuModal({ isOpen, onClose, data }: ModalProps<MeuModalData>) {
  if (!data) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{data.title}</h2>
      <p>{data.message}</p>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}
```

### Abrir um Modal

```tsx
"use client";

import { useModal } from "@/shared/contexts/modal-context";
import { MeuModal } from "@/components/modals/meu-modal";

export function MeuComponente() {
  const { openModal } = useModal();

  const handleOpen = () => {
    openModal(
      "meu-modal-id",
      MeuModal,
      {
        title: "Título do Modal",
        message: "Mensagem do modal",
      },
      {
        size: "md",
        position: "center",
      }
    );
  };

  return <button onClick={handleOpen}>Abrir Modal</button>;
}
```

## 📚 API Reference

### `useModal()`

Hook para acessar as funções do contexto de modal.

**Retorna:**
- `openModal` - Função para abrir um modal
- `closeModal` - Função para fechar um modal
- `closeAllModals` - Função para fechar todos os modais
- `isModalOpen` - Função para verificar se um modal está aberto
- `getModalData` - Função para obter os dados de um modal

### `openModal<T>(id, component, props?, options?)`

Abre um novo modal.

**Parâmetros:**
- `id: ModalId` - Identificador único do modal (string ou number)
- `component: React.ComponentType<ModalProps<T>>` - Componente do modal
- `props?: T` - Propriedades a serem passadas para o modal (opcional)
- `options?: ModalOptions` - Opções de configuração do modal (opcional)

**Exemplo:**
```tsx
openModal(
  "modal-1",
  MeuModal,
  { title: "Título", message: "Mensagem" },
  {
    size: "md",
    position: "center",
    onOpen: () => console.log("Aberto!"),
    onClose: () => console.log("Fechado!"),
  }
);
```

### `closeModal(id)`

Fecha um modal específico.

**Parâmetros:**
- `id: ModalId` - ID do modal a ser fechado

**Exemplo:**
```tsx
closeModal("modal-1");
```

### `closeAllModals()`

Fecha todos os modais abertos.

**Exemplo:**
```tsx
closeAllModals();
```

### `isModalOpen(id)`

Verifica se um modal está aberto.

**Parâmetros:**
- `id: ModalId` - ID do modal

**Retorna:** `boolean`

**Exemplo:**
```tsx
if (isModalOpen("modal-1")) {
  console.log("Modal está aberto!");
}
```

### `getModalData<T>(id)`

Obtém os dados (props) de um modal.

**Parâmetros:**
- `id: ModalId` - ID do modal

**Retorna:** `T | undefined`

**Exemplo:**
```tsx
const data = getModalData<MeuModalData>("modal-1");
```

## 🔷 Tipos

### `ModalProps<T>`

Props que são passadas para o componente do modal.

```tsx
interface ModalProps<T = unknown> {
  isOpen: boolean;      // Indica se o modal está aberto
  onClose: () => void;  // Função para fechar o modal
  data?: T;            // Dados passados via props
}
```

### `ModalOptions`

Opções de configuração do modal.

```tsx
interface ModalOptions {
  closeOnOverlayClick?: boolean;  // Fechar ao clicar no overlay (padrão: true)
  closeOnEscape?: boolean;        // Fechar ao pressionar ESC (padrão: true)
  showCloseButton?: boolean;      // Mostrar botão de fechar (padrão: true)
  size?: "sm" | "md" | "lg" | "xl" | "full";  // Tamanho do modal
  position?: "center" | "left" | "right" | "top" | "bottom";  // Posição
  className?: string;             // Classes CSS customizadas
  overlayClassName?: string;      // Classes CSS para o overlay
  onOpen?: () => void;            // Callback quando o modal abre
  onClose?: () => void;           // Callback quando o modal fecha
}
```

## 🎯 Opções de Modal

### `closeOnOverlayClick`

Controla se o modal fecha ao clicar no overlay (fundo escuro).

```tsx
openModal("modal-1", MeuModal, {}, {
  closeOnOverlayClick: false, // Não fecha ao clicar no overlay
});
```

### `closeOnEscape`

Controla se o modal fecha ao pressionar a tecla ESC.

```tsx
openModal("modal-1", MeuModal, {}, {
  closeOnEscape: false, // Não fecha ao pressionar ESC
});
```

### `showCloseButton`

Controla a exibição do botão de fechar (X) no canto superior direito.

```tsx
openModal("modal-1", MeuModal, {}, {
  showCloseButton: false, // Oculta o botão de fechar
});
```

### `onOpen` e `onClose`

Callbacks executados quando o modal abre ou fecha.

```tsx
openModal("modal-1", MeuModal, {}, {
  onOpen: () => {
    console.log("Modal aberto!");
    // Executar ações quando o modal abrir
  },
  onClose: () => {
    console.log("Modal fechado!");
    // Executar ações quando o modal fechar
  },
});
```

## 📍 Posições

O sistema suporta 5 posições diferentes:

### `center` (Padrão)
Modal centralizado na tela.

```tsx
openModal("modal-1", MeuModal, {}, {
  position: "center",
});
```

### `left`
Drawer que desliza da esquerda.

```tsx
openModal("modal-1", MeuModal, {}, {
  position: "left",
  size: "md", // Largura do drawer
});
```

### `right`
Drawer que desliza da direita.

```tsx
openModal("modal-1", MeuModal, {}, {
  position: "right",
  size: "lg",
});
```

### `top`
Drawer que desliza de cima.

```tsx
openModal("modal-1", MeuModal, {}, {
  position: "top",
  size: "md", // Altura do drawer
});
```

### `bottom`
Drawer que desliza de baixo.

```tsx
openModal("modal-1", MeuModal, {}, {
  position: "bottom",
  size: "md",
});
```

## 📏 Tamanhos

### Para Modais Centrais

- `sm` - 384px (max-w-sm)
- `md` - 448px (max-w-md) - **Padrão**
- `lg` - 512px (max-w-lg)
- `xl` - 576px (max-w-xl)
- `full` - Largura total com margens

### Para Drawers Laterais (left/right)

- `sm` - 320px (w-80)
- `md` - 384px (w-96)
- `lg` - 512px (w-[32rem])
- `xl` - 640px (w-[40rem])
- `full` - Largura total

### Para Drawers Verticais (top/bottom)

- `sm` - 320px (h-80)
- `md` - 384px (h-96)
- `lg` - 512px (h-[32rem])
- `xl` - 640px (h-[40rem])
- `full` - Altura total

## 🎴 Modais Empilhados

O sistema suporta múltiplos modais abertos simultaneamente. Cada modal empilhado recebe automaticamente um z-index maior.

### Exemplo: Modal que abre outro modal

```tsx
"use client";

import { ModalProps } from "@/shared/types/modal";
import { useModal } from "@/shared/contexts/modal-context";

interface NestedModalData {
  level: number;
  title: string;
}

export function NestedModal({ isOpen, onClose, data }: ModalProps<NestedModalData>) {
  const { openModal } = useModal();

  const handleOpenNested = () => {
    // Abre outro modal em cima deste
    openModal(
      `nested-${data.level + 1}`,
      NestedModal,
      {
        level: data.level + 1,
        title: `Modal Nível ${data.level + 1}`,
      },
      {
        size: "md",
      }
    );
  };

  return (
    <div className="p-6">
      <h2>{data.title}</h2>
      <button onClick={handleOpenNested}>Abrir Modal em Cima</button>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
}
```

### Z-Index Automático

- Primeiro modal: z-index 50
- Segundo modal: z-index 60
- Terceiro modal: z-index 70
- E assim por diante...

## 💡 Exemplos

### Exemplo 1: Modal Simples

```tsx
const { openModal } = useModal();

openModal(
  "simple-modal",
  SimpleModal,
  {
    title: "Título",
    message: "Mensagem",
  }
);
```

### Exemplo 2: Modal com Callbacks

```tsx
openModal(
  "callback-modal",
  CallbackModal,
  { data: "algum dado" },
  {
    onOpen: () => {
      console.log("Modal aberto!");
      // Executar lógica quando abrir
    },
    onClose: () => {
      console.log("Modal fechado!");
      // Executar lógica quando fechar
    },
  }
);
```

### Exemplo 3: Drawer Lateral

```tsx
openModal(
  "side-drawer",
  SideDrawer,
  {
    title: "Menu Lateral",
    content: "Conteúdo do drawer",
  },
  {
    position: "right",
    size: "lg",
    closeOnOverlayClick: true,
  }
);
```

### Exemplo 4: Modal de Confirmação com Sucesso

```tsx
const { openModal } = useModal();

const handleConfirm = () => {
  openModal(
    "confirmation",
    ConfirmationModal,
    {
      title: "Confirmar Ação",
      message: "Tem certeza?",
      onConfirm: () => {
        // Executar ação
        console.log("Confirmado!");
        
        // Abrir modal de sucesso
        openModal(
          "success",
          SuccessModal,
          { message: "Sucesso!" },
          { size: "sm" }
        );
      },
    }
  );
};
```

### Exemplo 5: Modal Customizado com Classes

```tsx
openModal(
  "custom-modal",
  CustomModal,
  {},
  {
    size: "lg",
    className: "border-2 border-blue-500",
    overlayClassName: "bg-black/70",
  }
);
```

### Exemplo 6: Verificar se Modal está Aberto

```tsx
const { isModalOpen, closeModal } = useModal();

if (isModalOpen("meu-modal")) {
  // Fazer algo se o modal estiver aberto
  console.log("Modal está aberto!");
  
  // Fechar o modal
  closeModal("meu-modal");
}
```

## 🎨 Animações

O sistema inclui animações automáticas:

- **Modais Centrais**: Fade + Scale + Translate
- **Drawers Laterais**: Slide horizontal
- **Drawers Verticais**: Slide vertical
- **Overlay**: Fade com blur

Todas as animações têm duração de 300ms.

## 🔒 Comportamentos Automáticos

1. **Scroll Bloqueado**: Quando um modal está aberto, o scroll do body é bloqueado automaticamente
2. **ESC para Fechar**: Pressionar ESC fecha o último modal aberto
3. **Overlay Click**: Clicar no overlay fecha o modal (se `closeOnOverlayClick` for true)
4. **Z-Index Dinâmico**: Modais empilhados recebem z-index crescente automaticamente

## 🐛 Troubleshooting

### Modal não aparece

- Verifique se o `ModalProvider` está envolvendo sua aplicação
- Confirme que está usando `"use client"` no componente que chama `useModal()`

### Modal não fecha

- Verifique se o `onClose` está sendo chamado corretamente
- Confirme que `closeOnOverlayClick` não está como `false`

### Múltiplos modais não empilham

- Certifique-se de usar IDs únicos para cada modal
- O z-index é gerenciado automaticamente, não é necessário configurar manualmente

## 📝 Notas Importantes

1. **IDs Únicos**: Sempre use IDs únicos para cada modal
2. **Client Components**: Componentes que usam `useModal()` devem ser Client Components (`"use client"`)
3. **TypeScript**: O sistema é totalmente tipado, aproveite o autocomplete
4. **Performance**: Múltiplos modais são gerenciados eficientemente com Map

## 🔗 Arquivos Relacionados

- `src/shared/contexts/modal-context.tsx` - Contexto e Provider
- `src/shared/types/modal.ts` - Tipos TypeScript
- `src/shared/components/modals/` - Exemplos de modais

