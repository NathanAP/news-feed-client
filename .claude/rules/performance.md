# Convenções de performance

Regras para manter a aplicação leve e responsiva. Focadas em tamanho de bundle e volume de
requisições — os dois problemas mais comuns num SPA React + Vite.

## Code splitting (divisão de bundle)

A forma correta de dividir o bundle em React + Vite é o **`import()` dinâmico**, que o Vite
(Rollup/Rolldown) transforma automaticamente num chunk separado. No React isso é exposto por
**`React.lazy` + `Suspense`** (e pela propriedade `lazy` de rota do React Router). Não usar
workarounds como aumentar `chunkSizeWarningLimit` (esconde o problema) ou carregadores manuais.

### Regras

- **Rota é a fronteira primária de split.** Toda página (componente ligado a uma rota) deve ser carregada via `React.lazy`. Ver `src/routes/lazyPages.ts` (os `lazy(() => import(...))`) consumidos por `src/routes/router.tsx`. Peças estruturais sempre necessárias (layouts, guardas) ficam **eager**.
- **Componentes pesados e condicionais também podem ser lazy** — diálogos/modais, editores, etc., especialmente quando puxam dependências grandes. Exemplo: `FeedFormDialog` e `PreferencesDialog` carregam `react-hook-form` + `zod`, então são embrulhados por `LazyFeedFormDialog` / `LazyPreferencesDialog`, que só renderizam quando `open` — assim o chunk do formulário só baixa ao abrir. Para o chunk realmente ser adiado, o componente lazy **não pode ser montado antes** do gatilho (renderizar `null` enquanto fechado).
- **Não sobre-fragmentar.** Dividir cada componentezinho gera overhead de requisições e _waterfalls_. O ponto ideal é: rota + alguns componentes pesados. Na dúvida, meça (`npm run build` mostra o tamanho de cada chunk) antes de dividir.
- **Sempre haver um `Suspense`** acima de qualquer componente lazy, com um fallback adequado (`PageLoader` para rotas; `null` é aceitável para diálogos, que já têm sua própria transição de abertura).
- **Named exports + `lazy`:** como os componentes são _named exports_, o padrão é `lazy(() => import('./X').then((m) => ({ default: m.X })))`.

### Convenção de arquivos

- Constantes/funções e os `lazy(...)` **não** podem coabitar um arquivo de componente (regra ESLint `react-refresh/only-export-components`). Extrair para um módulo `.ts` próprio (ex.: `lazyPages.ts`, `keywords.ts`).

## Requisições

- Preferir uma requisição em lote a N requisições (ex.: `GET /feeds/check-for-new-articles` para as contagens de não-lidas, em vez de uma por feed).
- Usar o cache/invalidations do TanStack Query em vez de refazer buscas manualmente; evitar polling agressivo (usar `refetchInterval` com pausa em aba oculta quando aplicável).
