# Arquitetura e padrões técnicos

Este arquivo descreve as decisões de arquitetura e os padrões técnicos do cliente. A stack canônica está em `raiz/.claude/CLAUDE.md`.

## Tipo de aplicação

- **SPA (Single Page Application)** em React + Vite, sem SSR.
- Roteamento **client-side** com o React Router.
- O backend devolve os tokens de autenticação no **fragment** da URL de callback
  (`#access_token=...`), padrão que casa com um SPA e reforça a escolha por Vite (sem Next.js).

## Sessão e autenticação

Camadas separadas (o "store" reativo e a "persistência" são coisas distintas):

- **`access_token`**: vive **apenas em memória**, num React Context de sessão. Nunca é persistido.
- **`refresh_token`**: persistido no **`localStorage`**, para a sessão sobreviver a recarregamentos
  ("continuar logado").
- No **boot do app**, o Context lê o `refresh_token` do `localStorage` e chama `POST /v1/auth/refresh`
  para reidratar a sessão (obter um `access_token` novo). Sem `refresh_token` válido → estado deslogado.

Fluxo de login (Google, único método):

1. O cliente redireciona para `GET /v1/auth/google?redirect_uri=<callback-do-SPA>`.
2. O backend faz o OAuth com o Google e redireciona de volta ao `redirect_uri` com os tokens no
   **fragment** (`#access_token=...&refresh_token=...&expires_in=...`).
3. A rota de callback do SPA lê o fragment, guarda o `access_token` no Context e o `refresh_token`
   no `localStorage`, e limpa o fragment da URL.

> **Dependência com o backend:** a URL de callback do SPA precisa estar cadastrada na allowlist
> `OAUTH_ALLOWED_REDIRECT_URIS` do backend (match exato), senão `GET /auth/google` retorna 400.

## Gerência de estado

- **Estado de servidor** (feeds, artigos, sources, paginação, `is_read`): **TanStack Query**, por
  cima do Axios. Responsável por cache, estados de loading/erro, refetch e invalidação (ex.: invalidar
  a lista após `PUT /articles/:id/read`).
- **Estado global de cliente**: **React Context**, restrito ao pequeno conjunto de coisas realmente
  globais — **sessão/auth** e **tema (dark/light)**.
- Não usamos Redux/Zustand: com o TanStack Query cuidando do estado de servidor, a superfície de
  estado global de cliente é pequena o suficiente para o Context.

## Comunicação com a API

- Toda requisição passa por uma **instância única do Axios** em `raiz/src/services/api/`.
- **Interceptors** dessa instância:
    - anexam `Authorization: Bearer <access_token>` nas requisições autenticadas;
    - ao receber **401**, tentam `POST /v1/auth/refresh` uma vez e repetem a requisição original;
    - ao receber **503** (guard de manutenção global), acionam a tela de manutenção do app.
- **Um arquivo de serviço por modelo da API** (`auth`, `users`, `sources`, `articles`, `feeds`,
  `system`, `health`), cada um com uma função por endpoint. Tipos/enums espelham `memory/api.md`.
- Os **hooks de TanStack Query** ficam em `raiz/src/hooks/` e consomem esses serviços.

## Variáveis de ambiente (frontend)

- No frontend Vite, variáveis de ambiente são **embutidas no bundle em tempo de build e ficam
  públicas** no navegador. **Não há segredo real no cliente** — o segredo do Google OAuth vive no
  backend. O `.env` do frontend é "configuração pública por ambiente", não cofre de segredos.
- Variáveis expostas ao cliente exigem o prefixo **`VITE_`** (ex.: `VITE_API_URL`).
- A URL/porta da API vêm de `API_URL` / `API_PORT` (expostas ao client via prefixo `VITE_`).

## Datas

- Datas da API são sempre **UTC**. Convertidas para o fuso do usuário na exibição, com **date-fns**
  (+ suporte de timezone).

## Internacionalização

- **react-i18next + i18next**, idiomas **PT e EN**. Todo texto de UI (labels, mensagens, placeholders)
  é externalizado.
- **Exceção:** o conteúdo da notícia vindo da API é exibido no idioma enviado pela API (não é
  internacionalizado pelo cliente). Tradução sob demanda usa `GET /articles/:id/translate/:language`.

## Renderização de HTML

- O conteúdo do artigo vem como **HTML** (já sanitizado no backend). Ao renderizar via
  `dangerouslySetInnerHTML`, aplicamos **DOMPurify** como defesa adicional no cliente.

## Guard de manutenção

- O backend pode entrar em manutenção e responder **503** em toda rota (exceto `GET /v1/health` e
  `PUT /v1/system/app-status`). O cliente trata isso globalmente (interceptor do Axios) exibindo uma
  tela de manutenção.
