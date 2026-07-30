# Projeto: cliente de feed de notícias personalizado

## Foco deste projeto

- Frontend utilizando TypeScript e React.

## Ideia geral

Um feed de notícias hiper personalizado que coleta e filtra notícias baseado nas preferências do usuário.

## Características

- Nome do aplicativo é ChronoFeed.
    - Chrono vem de "tempo".
    - Feed vem da ideia de timeline, feed de redes sociais, etc.
- SPA (Single Page Application) em React + Vite, sem SSR.
- Login exclusivo através do Google.
- Layout limpo, polido e fluido.
- Livre de anúncios.
- Possui personalizações de layout dinâmicos (dark/light mode, ordenação de feeds, idioma preferido, entre outros).

## Identidade visual

- Nome: ChronoFeed (Chrono = tempo; Feed = timeline).
- Cor de marca: o dourado da logo é a cor de acento da identidade. `#c8a04a` no tema escuro e `#8a6a1f` (mais profundo, legível sobre o fundo near-white) no tema claro. É uma cor de marca/acento (logo, wordmark, destaques de onboarding), não a cor `primary` do app — esta segue azul (`#6b9bff` dark / `#3b6fe0` light).
- Implementação: vive como token de paleta `brand` em `src/theme/theme.ts` (com `brandGold` exportado para usos decorativos, ex.: o glow do login). Consumir via `brand.main` / `theme.palette.brand.main` — nunca hardcodar o hex.

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
- Qualquer dado relacionado a JWT não pode ser decodificado. Esse trabalho sempre será exclusividade do backend da aplicação.
- Ao iniciar a aplicação o Context lê o `refresh_token` do `localStorage` e chama `POST /v1/auth/refresh` para reidratar a sessão (obter um `access_token` novo). Sem `refresh_token` válido a aplicação fica em estado de deslogado.

### Fluxo de login:

1. O cliente redireciona para `GET /v1/auth/google?redirect_uri={callback-do-SPA}`.
2. O backend faz o OAuth com o Google e redireciona de volta ao `redirect_uri` com os tokens no `fragment` (`#access_token=...&refresh_token=...&expires_in=...`).
3. A rota de callback do SPA lê o `fragment`, guarda o `access_token` no Context e o `refresh_token` no `localStorage`, e limpa o `fragment` da URL.

Lembrete: a URL de callback do SPA precisa estar cadastrada na allowlist.

## Gerência de estado

- Estado de servidor (feeds, notícias, fontes de notícias, paginação, `is_read`): utiliza-se o TanStack Query por cima do Axios. Responsável por cache, estados de loading/erro, refetch e invalidação (exemplo: invalidar a lista após `PUT /articles/:id/read`).
- Estado global de cliente: React Context, restrito ao pequeno conjunto de coisas realmente globais como sessão/auth, tema (dark/light), ordenação das tabs dos feeds, idioma preferido, entre outros.
- Não usamos Redux/Zustand: com o TanStack Query cuidando do estado de servidor, a superfície de estado global de cliente é pequena o suficiente para o Context.
- O cache do TanStack Query vive em memória (RAM da aba), não em storage persistente: some no reload e é reconstruído buscando na API. Contrasta com o `refresh_token` no `localStorage`, que persiste e reidrata a sessão no boot. Em desenvolvimento, o React Query Devtools (só em `import.meta.env.DEV`) permite inspecionar esse cache.

## Feedback de ações (notificações)

- Toda ação de escrita bem-sucedida do usuário (criar/editar/excluir feed, salvar preferências) dá um
  **toast de sucesso** via **notistack** (`SnackbarProvider` no `App.tsx`). O toast é disparado de
  dentro do hook de mutation, não da tela, para valer em todos os gatilhos e nunca ser esquecido. A
  regra vive em `rules/conventions.md` (seção "Convenções de formulários"). Erros ainda podem ser
  mostrados inline no formulário quando o contexto ajuda.

## Comunicação com a API

- Toda requisição passa por uma instância única do Axios em `raiz/src/services/api/`.
- Interceptors dessa instância:
    - anexam `Authorization: Bearer <access_token>` nas requisições autenticadas;
    - ao receber 401, tentam `POST /v1/auth/refresh` uma vez e repetem a requisição original;
    - ao receber 503 (guard de manutenção global), acionam a tela de manutenção do app.
- Um arquivo de serviço por modelo da API (`auth`, `users`, `sources`, `articles`, `feeds`, `system`, `health`), cada um com uma função por endpoint. Tipos/enums espelham `memory/endpoints.md` e `memory/api-integration.md`.
- Os hooks de TanStack Query ficam em `raiz/src/hooks/` e consomem esses serviços.

## Datas

- Datas da API são sempre UTC e devem ser convertidas para o fuso do usuário na exibição com date-fns e suporte de timezone.

## Internacionalização

- Segue as regras conforme o arquiv `raiz/.claude/rules/conventions.md`.
- A única exceção é o conteúdo da notícia vindo da API é exibido no idioma enviado pela API (não é internacionalizado pelo cliente).
- Uma rota de tradução de notícias sob demanda existe em `GET /articles/{id}/translate` (o idioma-alvo vem da preferência `language_to_translate` do usuário, não da URL).

## Renderização de HTML externos ou de terceiros (redes sociais, mídia, entre outros)

- O conteúdo do artigo vem como HTML já sanitizado no backend.
- Tratamentos extras (mais sanitização ou tratamento de URLs) por enquanto não vai ser necessário.
    - Provavelmente o primeiro que vai ser necessário vai ser em relação ao Instagram, mas vamos lidar com isso depois.

## Guard de manutenção

- O backend pode entrar em manutenção e responder 503 em toda rota (exceto `GET /v1/health` e `PUT /v1/system/app-status`). O cliente trata isso globalmente (interceptor do Axios) exibindo uma tela de manutenção.

## Abas para navegadores

- A convenção de nomenclatura de abas de navegadores deve ser:
    - `{tela_atual} - ChronoFeed`, onde `tela_atual` se refere ao atual setor da aplicação. Por exemplo: se for no login, deve ser `Login - ChronoFeed`.
- Quando a tela exibe um conteúdo nomeável, o nome do conteúdo tem preferência sobre o do setor:
    - `/feeds/:feedId` se torna o nome do feed (`Meu feed - ChronoFeed`).
    - `/articles/:id` se torna o título da notícia (`O Brasil venceu a Argentina... - ChronoFeed`).
    - Enquanto o dado não chega, cai no nome do setor (`Feeds`/`Notícia`).
- Nomes de conteúdo vêm da API e, como toda notícia, não são internacionalizados. Os nomes de setor são (`titles.*`), exceto onde já existe chave própria (404, manutenção).
- Implementação: componente `PageTitle` (`src/components/PageTitle.tsx`), usado por cada página. Apoia-se no suporte nativo a metadados do React 19 (um `<title>` renderizado na árvore é içado para o `<head>`), sem biblioteca tipo `react-helmet`. O `<title>` estático do `index.html` permanece como fallback pré-boot.

## Deploy (Vercel)

- O build é estático (`npm run build` → `dist`), servido pela Vercel. Preset `Vite`.
- Rewrite de SPA obrigatório (`vercel.json`): `/(.*)` → `/index.html`. As rotas do client não existem como arquivo; sem isso, acesso direto, F5 e — o mais grave — o retorno do OAuth em `/auth/callback` dão 404. A Vercel checa o filesystem antes dos rewrites, então os assets continuam sendo servidos normalmente.
- Variáveis (embutidas no bundle em tempo de build, lembrando que ao mudar a variável, tem que refazer o deploy):
    - `VITE_API_URL`: URL pública da API com o `/v1`. Se faltar, `config/env.ts` lança e o app fica em tela branca — o build passa, o erro só aparece no navegador.
    - `VITE_DEV_LOGIN_ENABLED`: não definir em produção (o botão de dev-login jamais pode aparecer lá).
- Use o domínio estável de produção (ex.: `news-feed-client-zeta.vercel.app`), nunca a URL com hash do deploy (`...-xyz-...`), que muda a cada push. O `redirect_uri` do SPA sai de `window.location.origin` (ver `AuthService`), então o domínio pelo qual se navega é o que vai para a allowlist — navegar pela URL com hash reprova na hora.
- Consequência: deploys de preview não funcionam, pois ganham domínio novo a cada vez e as allowlists são exact-match.

### As três allowlists do login (erram em pontos diferentes)

Confundir as três é o que mais custa tempo. Em ordem do fluxo:

1. Backend valida o callback do SPA — `OAUTH_ALLOWED_REDIRECT_URIS` precisa de `https://<dominio-vercel>/auth/callback`. Erro típico: `{"error": "invalid redirect_uri"}` vindo da própria API.
2. Google valida o callback do backend — no Google Cloud Console (Credenciais → URIs de redirecionamento autorizados) precisa da URL pública do backend, ex.: `https://<host-da-api>/v1/auth/google/callback`. Erro típico: tela do Google com `Erro 400: redirect_uri_mismatch`. Nada a ver com a Vercel — quebra quando a API muda de endereço (localhost → túnel/produção). O link "detalhes do erro" mostra a URI exata que o Google recebeu.
3. Backend valida a origem das chamadas — `CORS_ALLOWED_ORIGINS` precisa de `https://<dominio-vercel>`. Erro típico: `Failed to fetch` em toda requisição (parece API fora do ar, mas é CORS).

## Administradores

- Os administradores são usuários identificados através de uma flag.
- A gerência sobre as requisições envolvendo administradores são todas feitas pelo backend, ou seja, os envios de requisições não sofrem mudanças se um usuário é administrador ou não.
- Os administradores tem acesso à um botão que permite alternar entre visualização da aplicação como usuários comuns e administradores.
    - O botão deve ficar ao lado do toggle de tema (light/dark).
    - Caso a mudança ocorra e a página seja exclusiva para administradores, eles devem ser jogados para a página de URL inválida (not found).
    - Usuários comuns que tentam acessar páginas exclusivas para administradores devem ser jogados para a página de URL inválida (not found).
    - Ao entrar na aplicação, o usuário administrador a enxerga como um usuário comum por padrão.
- Os administradores tem alguns acessos exclusivos à algumas funcionalidades extras, mas nem todas pertencem diretamente ao client. As que estão relacionadas ao client são:
    - Criação de notícias (`POST base_url/v1/articles/create`).
        - Acesso para a tela através do menu "..." do feed.
        - A criação de notícias não passa pelo julgamento automaticamente. A ideia desse endpoint na verdade é abrir a futura possibilidade de notícias patrocinadas. Por enquanto ela existe apenas por padronização geral mesmo.
    - Edição de notícias (`PUT base_url/v1/articles/{id}`).
        - Acesso para a tela através do menu '...' no card da listagem.
    - Remoção de notícias (`DELETE base_url/v1/articles/{id}`).
        - Acesso para a tela através do menu '...' no card da listagem.
    - Listagem de fonte de notícias (`GET base_url/v1/sources/`)
        - Acesso através do menu principal do usuário.
    - Criação de fonte de notícias (`POST base_url/v1/sources/create`).
        - Acesso através do menu "..." junto da listagem de fonte de notícias.
    - Descoberta de feeds RSS de um site (`GET base_url/v1/sources/rss-discovery?url=`).
        - Apoio do formulário de fonte: preenche o campo de RSS a partir da URL do site.
        - Não é uma rota exclusiva para administradores, porém é o único local na qual ela é utilizada.
    - Edição de fonte de notícias (`PUT base_url/v1/sources/{id}`).
        - Acesso através do menu "..." junto da listagem de fonte de notícias.
    - Remoção de fonte de notícias (`DELETE base_url/v1/sources/{id}`).
        - Acesso através do menu "..." junto da listagem de fonte de notícias.

### Detalhes de implementação

- A flag vem do `admin` do `GET /users/me` (`useCurrentUser`, já em cache) e é apenas dica de UI: a API reconfere a flag no banco a cada requisição de administrador, então confiar nela no client não libera nada — a rota responde `403` do mesmo jeito. Ela decide apenas o que renderizar.
- O modo de visualização vive em `hooks/adminViewStore.ts` (store + `useSyncExternalStore` + `localStorage`, mesmo padrão da ordenação de feeds), exposto por `useAdminView`. É per-device e puramente visual: a API não tem noção desse modo e nenhuma requisição muda por causa dele.
- O guard é o `routes/AdminRoute.tsx`. Ele renderiza o `NotFoundPage` no lugar em vez de redirecionar, então a URL é preservada e o resultado é indistinguível de qualquer endereço inválido. Enquanto o `GET /users/me` não resolve ele mostra o loader. Sem isso um administrador que recarrega a página veria um 404 piscar.
- `403` não é `401`: O interceptor do Axios só reage a `401` (renova o token) e `503` (manutenção); `403` sobe para quem chamou. Isso é intencional: deslogar em `403` expulsaria um usuário cuja sessão está perfeitamente válida.
