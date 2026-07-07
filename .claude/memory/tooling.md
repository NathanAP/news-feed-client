# Tooling / Bootstrap (resumo)

Estado a partir da versão `0.2.0.0`. Fonte: `versions/20260707150000_0.2.0.0.md`.

- **Stack instalada (latest):** React 19.2, Vite 8.1, TypeScript 6.0, `@vitejs/plugin-react` 6.
  ESLint 10 (flat config) + `typescript-eslint` 8 + `react-hooks` 7 + `react-refresh` +
  `eslint-config-prettier`; Prettier 3.
- **Scripts npm:** `dev`, `build` (`tsc -b && vite build`), `preview`, `lint`, `lint:fix`,
  `format`, `format:check`.
- **TypeScript:** `strict: true` adicionado manualmente em `tsconfig.app.json` e
  `tsconfig.node.json` (o template novo do Vite não traz por padrão).
- **Linter:** o template do Vite agora vem com **oxlint**; foi **removido** em favor da stack
  documentada (ESLint + Prettier).
- **Env:** só `VITE_`-prefixadas chegam ao cliente. `.env.example` versionado; `.env`/`.env.*`
  ignorados (com `!.env.example`). `VITE_API_URL` = base da API (com `/v1`).
- **package.json version:** semver 3 partes (`0.2.0`), separado do esquema 4 partes do projeto.

## Gotchas

- `eslint-plugin-react-hooks` v7 moveu os configs flat para `.configs.flat`. Use
  `reactHooks.configs.flat['recommended-latest']` — o `configs['recommended-latest']` é legado
  (`plugins` como array) e quebra no ESLint 10.
- `create-vite <caminho-absoluto>` trata o argumento como **nome** (remove `:` e `\`) e cria a
  pasta relativa ao CWD. Faça o scaffold com um nome simples dentro do diretório-alvo.
