# Dashy_ - Dashboard Profissional de Analytics & Inventário

Dashy_ é um dashboard de análise de alto desempenho e interface de gerenciamento de produtos, construído com **React 18** e **TypeScript**. Projetado com uma estética futurista e clean, ele oferece insights em tempo real sobre a "saúde do ecossistema" e ferramentas avançadas para gestão de inventário global.

---

## Stack Tecnológica

- **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Gerenciamento de Estado**: [Redux Toolkit](https://redux-toolkit.js.org/) (Async Thunks, Slices)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) (Design System customizado, Classes utilitárias)
- **Animações**: [Framer Motion](https://www.framer.com/motion/) (Transições de layout, Interações de UI)
- **Gráficos**: [Recharts](https://recharts.org/) (Visualização de dados interativa)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Networking**: [Axios](https://axios-http.com/) (Consumo da [DummyJSON API](https://dummyjson.com/))
- **Utilitários**: [CLSx](https://github.com/lukeed/clsx), [Tailwind Merge](https://github.com/dcastil/tailwind-merge)

---

## Funcionalidades

- **📊 Analytics Dinâmico**: Dashboard com cartões de KPI em tempo real (Usuários Ativos, Ativos em Inventário, Valor de Mercado, Velocidade de Crescimento).
- **📈 Visualizações Interativas**: Gráficos de barras para distribuição por setor e gráficos de área para dinâmica de preços com tooltips customizados.
- **🔍 Sistema Avançado de Inventário**:
  - Funcionalidade de busca global.
  - Filtros de categoria com scroll horizontal.
  - Ordenação por preço (Menor/Maior) e avaliação.
  - Cards de produto interativos com funcionalidade "Analisar Especificações".
- **💎 Visão Detalhada de Ativos**:
  - Galeria de múltiplas imagens com gerenciamento de estado ativo.
  - Manifesto técnico e especificações detalhadas.
  - Simulação de status de implantação (Deployment).
- **🌓 Tema Adaptativo**: Integração total de modo Escuro/Claro com armazenamento persistente (localStorage).
- **📱 UI Responsiva**: Design mobile-first que se adapta perfeitamente a todos os tamanhos de tela.
- **🌀 UX Fluida**: Estados de carregamento otimizados usando componentes Skeleton e transições via Framer Motion.

---

## Instalação & Execução Local

Siga estes passos para configurar o Dashy_ em sua máquina local:

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/dashy.git
   cd dashy
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Abra no seu navegador**:
   Acesse `http://localhost:5173` (ou a porta especificada no seu terminal).

---

## 📂 Estrutura do Projeto

```text
src/
├── components/      # Componentes de UI compartilhados (Cards, Badges, Skeleton)
│   └── layout/      # Estrutura principal de layout (Sidebar, Header, Layout)
├── features/        # Slices do Redux e Lógica de Negócio (Products, Users, UI)
├── hooks/           # Hooks React customizados (storeHook)
├── pages/           # Componentes de nível de rota (Dashboard, Products, Details)
├── services/        # Configurações de API e instância do Axios
├── store/           # Configuração da store do Redux
├── types/           # Interfaces globais do TypeScript
└── utils/           # Funções auxiliares (utilitário cn)
```

---

## Autor

**Lucas Joakinson**
- Portfólio: https://joakinson-dev.vercel.app.com
- LinkedIn: https://linkedin.com/in/lucasjoakinson

---

*Dashy_ - Feito com uma coquinha e muito Código.*
