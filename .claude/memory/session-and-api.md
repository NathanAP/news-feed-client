# Sessão e camada de API (resumo)

Implementado na `0.3.0.0`. Fonte: `versions/20260707170000_0.3.0.0.md`. Detalhes de fluxo: `PROJECT.md`.

- **Router**: `createBrowserRouter` em `src/routes/`. `paths.ts` (objeto `as const`), guardas
  `ProtectedRoute`/`PublicRoute`, `RootLayout`, páginas em `src/pages/`. O callback OAuth
  (`/auth/callback`) fica fora das guardas.
- **Camada de API** (`src/services/api/`, classes): `ApiClient` (Axios único + interceptors:
  Bearer, refresh no 401 single-flight, 503→manutenção), `AuthService` (google login-url, refresh
  via Axios cru, logout), `UsersService` (`getMe`). Singletons em `index.ts`. Serviços mapeiam
  snake_case (DTO) → camelCase (domínio).
- **Sessão** (`src/contexts/SessionProvider.tsx`): `access_token` em memória (via ref p/ interceptor),
  `refresh_token` no `localStorage` (chave `nfc.refresh_token`). Boot reidrata via `/auth/refresh`.
  Registra handlers no `ApiClient` com `setAuthHandlers` (sem dep circular).
- **Estado de servidor**: TanStack Query. Hook `useCurrentUser` (`['currentUser']` = `/users/me`).
  Devtools só em dev.

## Regras/gotchas a lembrar

- `react-hooks` v7: proibido `setState` síncrono em `useEffect`. Use inicializador do `useState`
  ou IIFE async (setState após `await`).
- Enums: usar objeto `as const` + união (não `enum`), por causa de `erasableSyntaxOnly`.
- Avatar do Google 429 → `referrerPolicy="no-referrer"` no `<img>`.
