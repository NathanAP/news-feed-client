# Estrutura

Este arquivo descreve a organização de pastas atual do projeto. Ele é um guia para entender onde cada parte do código deve ser colocada.

Mostramos apenas a hierarquia de pastas com uma descrição em parênteses. Arquivos individuais e arquivos ignorados pelo git (temporários, configuração local, banco local, etc.) não são listados aqui.

> Estrutura-alvo definida na versão `0.1.0.0`. As pastas de código (`src/`, `tests/`, `cmd/`)
> passam a existir de fato a partir da `0.2.0.0` (scaffold do Vite); este mapa é atualizado
> conforme cada pasta é materializada.

```
raiz/
├── .claude/            (contexto do projeto para o Claude)
│   ├── memory/         (resumos de apoio à memória)
│   ├── rules/          (regras e padrões de desenvolvimento)
│   └── versions/       (histórico do que foi feito em cada versão)
├── cmd/                (scripts de execução e de teste)
├── public/             (assets estáticos servidos como estão)
├── src/
│   ├── assets/         (imagens, fontes e ícones importados pelo bundle)
│   ├── components/     (componentes de UI reutilizáveis)
│   ├── contexts/       (React Contexts globais: sessão/auth e tema)
│   ├── hooks/          (hooks customizados reutilizáveis, incl. hooks de TanStack Query)
│   ├── i18n/           (configuração e recursos de internacionalização — PT/EN)
│   ├── pages/          (componentes de página, ligados às rotas)
│   ├── routes/         (definição das rotas do React Router)
│   ├── services/
│   │   └── api/        (instância Axios + um serviço por modelo da API)
│   ├── theme/          (tema do Material UI: dark/light e tokens de design)
│   ├── types/          (tipos e enums compartilhados, espelhando a API)
│   └── utils/          (funções utilitárias: datas, formatação, etc.)
└── tests/              (testes unitários, de integração e end-to-end)
```
