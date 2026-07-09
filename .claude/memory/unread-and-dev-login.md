# Indicador de não-lido por aba + dev-login (resumo)

Implementado na `0.7.0.0`. Fonte: `versions/20260709140000_0.7.0.0.md`.

## Dev-login

- Flag `VITE_DEV_LOGIN_ENABLED` (default off) → `DEV_LOGIN_ENABLED` em `config/env.ts`. Gate do botão
  na `LoginPage`. Nunca vaza em produção mesmo que a rota exista.
- `AuthService.devLogin()` → `POST /users/dev-login` (rota só existe no backend em
  `ENVIRONMENT=development`). Usa Axios cru (bypass de interceptors), igual ao `refresh`. Retorna
  `AuthTokens`; o botão chama `useSession().login(tokens)`.

## Indicador de não-lido por aba

- `GET /feeds/check-for-new-articles` → objeto plano `{ [feedId]: unreadCount }` (feeds sem não-lidas
  ficam ausentes → default 0). Tipo `UnreadCountsResponse` em `types/feed.ts`;
  `FeedsService.checkForNewArticles()`.
- `hooks/useUnreadCounts.ts`: polling via **`refetchInterval` (60s)** do TanStack Query — não usar
  `setInterval`/`useEffect` manual. `refetchIntervalInBackground: false` (pausa com aba oculta);
  `enabled` só quando os feeds carregaram.
- `FeedTabs`: contagem como **pílula inline** (Box `primary.main` após o nome), não `Badge` flutuante
  — o Badge posicionado absolutamente transbordava e era cortado pelo scroller da aba (pior com zoom).
  Corte em **"9+"** via `MAX_UNREAD_DISPLAY`. `aria-label` i18n `feed.unreadCount` (pluralizada, com a
  contagem exata mesmo exibindo "9+").
- Query key `['unreadCounts']`. Marcar como lido invalida essa key **além** de `['feedArticles', ...]`
  (em `NewsCard`) / `['feedArticles']` (em `ArticleDetailPage`) para o badge cair na hora.
- Futuro: virar SSE/WebSocket para tempo real.

## Gotchas

- **CORS × porta**: o backend só libera a origem do frontend que estiver em `CORS_ALLOWED_ORIGINS`
  (tipicamente `http://localhost:5173`). Rodar o Vite em outra porta (ex.: preview em 5199) faz toda
  chamada à API dar `Failed to fetch`. Para verificar no browser, use a origem 5173.
- Existem duas contagens de não-lidas: a leve por-aba (`['unreadCounts']`, este endpoint) e a do
  cabeçalho "X novas" por feed (`useFeedUnreadCount`, `is_read=false&page_size=1`). Candidata futura:
  o cabeçalho reusar `check-for-new-articles` e eliminar a requisição extra por feed.
