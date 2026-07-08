# Estrutura

Este arquivo descreve a organização de pastas atual do projeto. Ele é um guia para entender onde cada parte do código deve ser colocada.

Mostramos apenas a hierarquia de pastas com uma descrição em parênteses. Arquivos individuais e arquivos ignorados pelo git (temporários, configuração local, banco local, etc.) não são listados aqui.

> Estrutura-alvo definida na versão `0.1.0.0`, materializada incrementalmente: `0.2.0.0` trouxe
> `public/` e a base de `src/`; `0.3.0.0` criou `src/{routes,pages,contexts,hooks,services/api,config,types}`;
> `0.4.0.0` criou `src/{components,theme,i18n,data}`; `0.4.1.0` criou `src/utils/`; `0.5.0.0` removeu
> `src/data/` (dados de placeholder substituídos por dados reais da API). As pastas `tests/`, `cmd/`
> e `src/assets/` ainda não existem — passam a existir conforme cada versão as exige. Este mapa é
> atualizado a cada materialização.

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
│   ├── config/         (configuração: env, QueryClient)
│   ├── contexts/       (React Contexts globais: sessão/auth)
│   ├── hooks/          (hooks customizados reutilizáveis, incl. hooks de TanStack Query)
│   ├── i18n/           (configuração e recursos de internacionalização — PT/EN)
│   ├── pages/          (componentes de página, ligados às rotas)
│   ├── routes/         (definição das rotas do React Router)
│   ├── services/
│   │   └── api/        (instância Axios + um serviço por modelo da API)
│   ├── theme/          (tema do Material UI: dark/light e tokens de design)
│   ├── types/          (tipos e enums compartilhados, espelhando a API)
│   └── utils/          (funções utilitárias: datas relativas/formatação, etc.)
└── tests/              (testes unitários, de integração e end-to-end)
```
