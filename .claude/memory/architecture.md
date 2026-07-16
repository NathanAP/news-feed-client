# Arquitetura (resumo)

Resumo de apoio. Fonte canônica: `rules/architecture.md`. Stack: `CLAUDE.md`.

- **Tipo:** SPA React + Vite, roteamento client-side (React Router). Sem SSR, sem Next.js.
- **Auth:** login só via Google. `GET /auth/google?redirect_uri=` → callback com tokens no
  **fragment** (`#access_token&refresh_token&expires_in`). O `redirect_uri` do SPA precisa estar na
  allowlist `OAUTH_ALLOWED_REDIRECT_URIS` do backend.
- **Sessão:** `access_token` só em memória (React Context); `refresh_token` no `localStorage`.
  Boot → `POST /auth/refresh` reidrata. Interceptor do Axios: Bearer + refresh no 401 + tela de
  manutenção no 503.
- **Estado:** TanStack Query para estado de servidor; React Context só para sessão e tema.
- **API:** instância única do Axios em `src/services/api/`, um serviço por modelo; enums espelham a API.
- **Env (frontend):** config pública, prefixo `VITE_`; sem segredos no cliente.
- **Datas:** UTC → fuso do usuário (date-fns). **i18n:** PT/EN (react-i18next); conteúdo da notícia
  no idioma da API. **HTML da notícia:** vem **já sanitizado do backend** (bluemonday, com iframes
  YouTube/Twitch por allowlist) e é renderizado direto — o DOMPurify foi **removido na 0.12.0.0**.
  Reintroduzi-lo como 2ª camada está registrado em ROADMAP → Futuro.
- **Deploy:** Vercel, build estático (`dist`). `vercel.json` faz o rewrite `/(.*)` → `/index.html`;
  sem ele o retorno do OAuth em `/auth/callback` dá 404 e o login não completa (0.16.1.0). Vars
  `VITE_` são embutidas **no build** (mudou → redeploy). Usar o **domínio estável**, não a URL com
  hash do deploy — o `redirect_uri` sai de `window.location.origin`. Detalhes e as **três allowlists**
  do login (backend↔SPA, Google↔backend, CORS) em `PROJECT.md` → "Deploy (Vercel)".
