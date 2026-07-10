# Projeto: cliente de feed de notícias personalizado

## Foco deste projeto

- Frontend utilizando TypeScript e React.

## Ideia geral

Um feed de notícias hiper personalizado que coleta e filtra notícias baseado nas preferências do usuário.

## Características

- SPA (Single Page Application) em React + Vite, sem SSR.
- Login exclusivo através do Google.
- Layout limpo, polido e fluido.
- Livre de anúncios.
- Possui modo dark e light.

## Referências

Aqui estão algumas referências de sites bem sucedidos que servem como base de características que podemos utilizar quando pensamos em nossa aplicação.

### Threads

O Threads é uma rede social com foco em opiniões e diversidade que é muito recente e por isso se tornou nossa principal referência de design.

#### Similaridades

- Permite criar diversos feeds: é possível criar diversos feed de atualizações.
- Feed particular: cada feed do usuário pertence apenas a ele e o algoritmo decide o que aparece.
- UI e design simples: a simplicidade da rede social é notávelmente uma ótima referência visual.

#### Dissemelhança

- Posts livres: cada post do feed existe por conta de uma atualização de notícias.
- Feeds podem acabar sendo iguais: através das palavras-chave é possível que hajam feeds idênticos.
- Interação entre usuários: apesar de estar nos planos, atualmente não pensamos em fazer usuários poder interagir uns com os outros.

## Variáveis de ambiente

- No frontend Vite, variáveis de ambiente são embutidas no bundle em tempo de build e ficam públicas no navegador.
- Não há segredo real no cliente: o segredo do Google OAuth vive no backend. O `.env` do frontend é "configuração pública por ambiente", não cofre de segredos.
- Variáveis expostas ao cliente exigem o prefixo `VITE_` (exemplo: `VITE_API_URL`).

## Sessão e autenticação

Camadas separadas (o "store" reativo e a "persistência" são coisas distintas):

- `access_token`: vive apenas em memória, num React Context de sessão e nunca é persistido.
- `refresh_token`: persistido no `localStorage`, para a sessão sobreviver a recarregamentos ("continuar logado").
- Ao iniciar a aplicação o Context lê o `refresh_token` do `localStorage` e chama `POST /v1/auth/refresh` para reidratar a sessão (obter um `access_token` novo). Sem `refresh_token` válido a aplicação fica em estado de deslogado.

### Fluxo de login:

1. O cliente redireciona para `GET /v1/auth/google?redirect_uri={callback-do-SPA}`.
2. O backend faz o OAuth com o Google e redireciona de volta ao `redirect_uri` com os tokens no `fragment` (`#access_token=...&refresh_token=...&expires_in=...`).
3. A rota de callback do SPA lê o `fragment`, guarda o `access_token` no Context e o `refresh_token` no `localStorage`, e limpa o `fragment` da URL.

Lembrete: a URL de callback do SPA precisa estar cadastrada na allowlist.

## Gerência de estado

- Estado de servidor (feeds, notícias, fontes de notícias, paginação, `is_read`): utiliza-se o TanStack Query por cima do Axios. Responsável por cache, estados de loading/erro, refetch e invalidação (exemplo: invalidar a lista após `PUT /articles/:id/read`).
- Estado global de cliente: React Context, restrito ao pequeno conjunto de coisas realmente globais como sessão/auth e tema (dark/light). O tema é gerido pelo color scheme do MUI, mas a **preferência de tema do backend é a fonte da verdade**: o toggle persiste via `PUT /users/me/preferences` e o boot aplica o tema salvo (`useThemeSync`).
- Não usamos Redux/Zustand: com o TanStack Query cuidando do estado de servidor, a superfície de estado global de cliente é pequena o suficiente para o Context.
- O cache do TanStack Query vive em memória (RAM da aba), não em storage persistente: some no reload e é reconstruído buscando na API. Contrasta com o `refresh_token` no `localStorage`, que persiste e reidrata a sessão no boot. Em desenvolvimento, o React Query Devtools (só em `import.meta.env.DEV`) permite inspecionar esse cache.

## Comunicação com a API

- Toda requisição passa por uma instância única do Axios em `raiz/src/services/api/`.
- Interceptors dessa instância:
    - anexam `Authorization: Bearer <access_token>` nas requisições autenticadas;
    - ao receber 401, tentam `POST /v1/auth/refresh` uma vez e repetem a requisição original;
    - ao receber 503 (guard de manutenção global), acionam a tela de manutenção do app.
- Um arquivo de serviço por modelo da API (`auth`, `users`, `sources`, `articles`, `feeds`, `system`, `health`), cada um com uma função por endpoint. Tipos/enums espelham `memory/api.md`.
- Os hooks de TanStack Query ficam em `raiz/src/hooks/` e consomem esses serviços.

## Datas

- Datas da API são sempre UTC e devem ser convertidas para o fuso do usuário na exibição com date-fns e suporte de timezone.

## Internacionalização

- Segue as regras conforme o arquiv `raiz/.claude/rules/conventions.md`.
- A única exceção é o conteúdo da notícia vindo da API é exibido no idioma enviado pela API (não é internacionalizado pelo cliente).
- Uma rota de tradução de notícias sob demanda existe em `GET /articles/{id}/translate/{language}`.

## Renderização de HTML

- O conteúdo do artigo vem como HTML (já sanitizado no backend). Ao renderizar via `dangerouslySetInnerHTML`, aplicamos `DOMPurify` como defesa adicional no cliente.

## Guard de manutenção

- O backend pode entrar em manutenção e responder 503 em toda rota (exceto `GET /v1/health` e `PUT /v1/system/app-status`). O cliente trata isso globalmente (interceptor do Axios) exibindo uma tela de manutenção.
