# UI, tema e i18n (resumo)

Implementado na `0.4.0.0`. Fonte: `versions/20260707190000_0.4.0.0.md`.

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
