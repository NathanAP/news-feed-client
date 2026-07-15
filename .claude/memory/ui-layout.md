# UI, tema e i18n (resumo)

Implementado na `0.4.0.0`. Fonte: `versions/20260707190000_0.4.0.0.md`.

> **0.14.0.0 (marca + login)**: nome do app é **ChronoFeed** (`app.name` no i18n). O dourado da marca
> virou o token de paleta `brand` em `theme/theme.ts` (dark `#c8a04a`, light `#8a6a1f`; `brandGold`
> exportado p/ `alpha()` decorativo). Consumir via `brand.main` — não hardcodar. É **acento**, não o
> `primary` (azul). `LoginPage` é um hero descritivo (logo/wordmark dourado, tagline, 3 destaques,
> card de login); cópia em `landing.*` + `app.tagline`. Detalhes: `versions/…_0.14.0.0.md`.
> Gotchas MUI v9: `Stack` não tem `alignItems`/`justifyContent` como props (vão no `sx`); no modo
> `cssVariables`, `alpha(theme.palette.x)` quebra — usar hex bruto, `*Channel` ou `action.hover`.

- **Material UI**: `ThemeProvider` (`defaultMode="dark"`) + `CssBaseline` em `App.tsx`. Tema em
  `theme/theme.ts` — `cssVariables` + `colorSchemes` (light/dark), **dark-first grafite azulado**
  (`#14161b` fundo, `#1b1e25` paper, primary `#6b9bff`). Toggle via `useColorScheme` (persiste).
- **i18n** (`i18n/`): react-i18next + LanguageDetector (localStorage + navigator), `en`/`pt`,
  namespace `common`. Chrome todo via `t(...)`; `resolveJsonModule` ligado no tsconfig.
  Switcher PT/EN no menu do avatar (client-side, `i18n.changeLanguage`). **Distinto** da preferência
  `language` do backend (6 idiomas, para tradução de conteúdo — sincronizar fica p/ 0.5+).
- **Casca** (`components/layout/`): `AppLayout` (header + `Container maxWidth="sm"`), `AppHeader`
  (`AppBar` transparente + blur), `FeedTabs` (placeholder + "+"), `ThemeToggle`, `UserMenu`
  (perfil/config/idioma/sair). Área autenticada passa por `AppLayout`.
- **Notícia** (`components/news/`): `NewsCard` (título + tempo, corpo, rodapé data + fonte; clamp de
  **2 linhas** em título e corpo; ponto de não-lido) + `NewsList`. View-model `types/news.ts`
  (`NewsCardItem`); dados em `data/placeholderNews.ts` (placeholder até a 0.5).

## Gotchas

- MUI `Typography` não aceita `fontWeight` como prop direta nesta versão — usar `sx={{ fontWeight }}`.
- Ícone: é `@mui/icons-material/PersonOutlined` (com "d"), não `PersonOutline`.
- Avatar: `slotProps={{ img: { referrerPolicy: 'no-referrer' } }}` (fix do 429 do Google).
- Cuidado com dados de placeholder pré-formatados como texto: `timeAgo` estava hardcoded em PT e
  não reagia ao switcher de idioma (bug da `0.4.1.0`). Fix: guardar o dado bruto (`minutesAgo`) e
  formatar na renderização com `Intl.RelativeTimeFormat(i18n.language)` — ver `utils/relativeTime.ts`.
- Transbordo de texto longo (bugfix `0.7.1.0`): `line-clamp` limita linhas mas **não** quebra
  palavras — um token longo sem espaços (URL) precisa de `overflowWrap: 'anywhere'`. Onde aplicar:
  `clamp2` do `NewsCard`, título `h5` e Box de conteúdo HTML da `ArticleDetailPage` (+ `pre/code`
  com `pre-wrap`; senão a tela de detalhe ganha scroll horizontal de página). Nome de feed no
  `FeedTabs` trunca com `maxWidth` + `text-overflow: ellipsis`; nome de fonte no card usa `noWrap`.
- Verificação de transbordo: injete uma palavra longa sem espaços via devtools e cheque
  `documentElement.scrollWidth > clientWidth` — mas confirme `clientWidth !== 0` antes (o preview do
  harness às vezes colapsa o viewport e falseia a medição). A origem precisa ser a liberada no CORS
  (hoje `localhost:5173`).
