# Code splitting / bundle (resumo)

Implementado na `0.10.0.0`. Fonte: `versions/20260709220000_0.10.0.0.md`. Convenção completa em
`rules/performance.md`.

## Como está dividido

- **Rotas**: `routes/lazyPages.ts` define os 6 componentes de página via `React.lazy`; consumidos por
  `routes/router.tsx`. Layouts/guardas seguem eager. `Suspense` em `AppLayout` (header estável) e
  `RootLayout` (rotas públicas); fallback `components/PageLoader.tsx`.
- **Diálogos de form**: `LazyFeedFormDialog` (`components/feeds/`) e `LazyPreferencesDialog`
  (`components/user/`) embrulham os diálogos com `React.lazy`; só renderizam quando `open`, então o
  chunk de `react-hook-form`+`zod` só baixa ao abrir. `ProfileDialog` seguiu eager (leve).

## Padrões a seguir

- Named export + lazy: `lazy(() => import('./X').then((m) => ({ default: m.X })))`.
- Os `lazy(...)` não podem coabitar arquivo de componente (regra `react-refresh/only-export-components`)
  → módulo `.ts` próprio.
- Para o chunk realmente adiar, o componente lazy não pode montar antes do gatilho (render `null`
  enquanto fechado). Trade-off: sem fade-out ao fechar (reabrir é instantâneo, módulo cacheado).
- Não sobre-fragmentar: rota + alguns componentes pesados. Medir com `npm run build`.

## Números

- Chunk principal 935 kB → **488 kB** (gzip 295 → **153 kB**); aviso de chunk do Vite sumiu. `MUI`
  core continua no base (usado na casca toda). `Alert` (~142 kB) e DOMPurify saíram do caminho inicial.
