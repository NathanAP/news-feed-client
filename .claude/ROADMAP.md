# Roadmap

Este arquivo contém o atual estado de features.
Marcações em 'x' indica o que já está concluído.
Os níveis de tabulação indicam detalhes do assunto.

# Atual versão

0.11.0.0

## Versão 0.1.0.0

- [x] Criar o projeto para o Claude
- [x] Definir arquitetura e padrões técnicos
    - Resolvido: detalhes da stack completados (ver `CLAUDE.md`).
    - Resolvido: sessão do usuário = React Context (`access_token` em memória) + `localStorage` (`refresh_token`), reidratada via `POST /auth/refresh`. Detalhes em `rules/architecture.md`.

## Versão 0.2.0.0

Bootstrap enxuto — sem as libs de feature (que entram nas versões que as usam).

- [x] Configuração inicial do npm, React e Vite (template `react-ts`)
- [x] Configuração do .gitignore
- [x] Configuração do .env (ignorar `.env*` reais; commitar `.env.example` com `VITE_API_URL`)
- [x] Configuração do prettier e eslint (ESLint 10 flat config + Prettier; oxlint removido)
- [x] Permitir ver um "olá mundo" com o Vite de pé usando React

## Versão 0.3.0.0

- [x] Roteador (React Router) com estrutura de rotas base
    - Feito com `createBrowserRouter`, paths centralizados, guardas (Protected/Public) e páginas por rota.
- [x] Instância base do Axios em `src/services/api/` + interceptors (Bearer, refresh no 401, 503)
- [x] Provider do TanStack Query
- [x] Criar login no Axios
- [x] Criar tela de login através do Google + callback + erro
    - Botão cru por enquanto; UI real vem na 0.4.
- [x] Após o login, ir para uma tela com os dados básicos do usuário
- [x] Garantir que o `access_token` e `refresh_token` vieram corretamente

## Versão 0.4.0.0

Casca do app com dados de exemplo (placeholder). Sem comunicação com a API ainda — isso é a 0.5.

- [x] Definir layout básico
    - Barra superior única: marca à esquerda, abas = feeds no centro, avatar à direita com menu (perfil, configurações, idioma, sair).
    - Coluna central de notícias; card com título + tempo relativo no topo, corpo, e no rodapé data de criação + fonte.
    - Título e corpo limitados a 2 linhas cada; indicador de não-lido (`is_read`) na aba e no card.
    - Toggle de tema e switcher de idioma (PT/EN, client-side) no topo/menu; botão "+" nas abas para criar feed (o formulário em si fica para depois).
- [x] Material UI + tema (dark/light)
    - Tema dark-first em grafite azulado (não preto/cinza puro); toggle via `colorSchemes` + `useColorScheme` do MUI (persiste e evita flash).
- [x] react-i18next (PT/EN)
- [x] Lembrete para a 0.5: o `ArticleResponse` hoje traz só `source_id`, não o nome/url da fonte. Para exibir a fonte no card com dados reais, o backend precisa incluir esse dado no `ArticleResponse` (senão seriam N requisições a `/sources/{id}`).
    - Resolvido: `SourceResponse` ganhou `name`, e `GET /feeds/:id/articles` passou a suportar `?with_sources=true`, preenchendo `ArticleResponse.source`.

## Versão 0.4.1.0

- [x] Bugfix: o "tempo relativo" do card (`há X min`/`há X h`) estava hardcoded em português nos dados de placeholder e não reagia à troca de idioma. Corrigido com `Intl.RelativeTimeFormat` localizado pelo idioma atual da UI.

## Versão 0.5.0.0

Comunicação com a API — trocar o placeholder por dados reais.

- [x] `FeedsService` (`GET /feeds`) — abas a partir dos feeds do usuário.
- [x] `ArticlesService` (`GET /feeds/{id}/articles?with_sources=true`) — notícias reais na coluna, com `is_read` e fonte.
- [x] Dependência de backend: incluir nome/url da fonte no `ArticleResponse` (ver lembrete da 0.4) — resolvida.
- [x] Criar tela de detalhe da notícia, que é acionada ao clicar na notícia (`/articles/:id`)
    - Correção do planejamento original: a rota **exige login** (não é pública) — qualquer usuário autenticado pode ver, a notícia é global.
    - Ao abrir, sempre dispara `PUT /articles/:id/read` (marca em todos os feeds do usuário numa chamada só; no-op se a notícia não estiver em nenhum feed).
    - Achado: `GET /articles/:id` não preenche `source` (diferente de `GET /feeds/:id/articles?with_sources=true`) — resolvido com uma chamada extra a `GET /sources/:id` só nesta tela.
    - Achado: DOMPurify remove `<iframe>` por padrão (ex.: embeds do Spotify no conteúdo) — comportamento de segurança esperado, não ajustado.
- [x] Pequena alteração do layout
    - "há X min/h" movido para o rodapé, ao lado da data/hora absoluta; unidades abreviadas via chaves i18n (`min`/`h`, não mais `Intl` no estilo longo).
    - Canto superior direito do card agora é o menu "..." com a opção "Marcar como lido" (quando não lido) — chama `PUT /articles/:id/read` e invalida o cache do feed.
    - Cabeçalho da lista trocado de "Feed: X · Y notícias" para "X novas · Y totais" (contagem de não-lidas via requisição leve `is_read=false&page_size=1`, escopada só ao feed selecionado).

## Versão 0.6.0.0

- [x] Adicionar logo e ícones iniciais
    - Relógio recriado como SVG vetorial (`public/logo.svg`), theme-aware via `currentColor` + `prefers-color-scheme` (dourado no dark, preto no light) — um único arquivo serve os dois modos.
    - `public/logo.png` (512, dourado, transparente) e `public/favicon.ico` (16/32/48/64); favicon religado no `index.html`; `favicon.svg` padrão do Vite removido.
    - `components/Logo.tsx` (SVG inline com `currentColor`) no header, no lugar do ícone genérico, com cor por tema via `theme.applyStyles`.

> O bloco original da 0.7 juntava 4 features (indicador de não-lido, CRUD de feeds, CRUD de
> preferências, dev-login) numa versão só — grande demais para "uma versão por vez" e, pior,
> duas delas estreiam toda a camada de formulários (`react-hook-form` + `zod`). Fatiado em 4 minors
> na sessão de planejamento da 0.7: 0.7 = itens leves (dev-login + indicador); 0.8 = CRUD de feeds;
> 0.9 = CRUD de preferências; testes/Taskfile descem para 0.10/0.11.

## Versão 0.7.0.0

- [x] Colocar botão para logar com o usuário dev
    - Gated por `VITE_DEV_LOGIN_ENABLED` (default off) para nunca aparecer em produção; chama
      `POST /users/dev-login` (rota que o backend só monta em `ENVIRONMENT=development`).
- [x] Indicador de não lido por aba de feed
    - `GET /v1/feeds/check-for-new-articles` (objeto plano `{ feedId: unreadCount }`), consumido por
      `useUnreadCounts` com `refetchInterval` do TanStack Query (polling idiomático, sem timer manual;
      pausa com a aba oculta). Badge por aba no `FeedTabs`; marcar como lido invalida `['unreadCounts']`
      para o badge cair na hora.
    - Mais tarde transformaremos essa rota em SSE ou websocket pra chegar em tempo real.

## Versão 0.7.1.0

- [x] Bugfix: transbordo com textos muito longos.
    - Título/corpo com token longo sem espaços (ex.: URL) causavam recorte no card e, na tela de
      detalhe (`h5` sem guarda), **scroll horizontal da página inteira**. Corrigido com
      `overflowWrap: anywhere` no clamp do `NewsCard`, no título e no corpo HTML da
      `ArticleDetailPage` (+ `pre/code` com `pre-wrap`), e `noWrap`/ellipsis no nome da fonte.
    - Nome de feed muito longo agora trunca com reticências no `FeedTabs` (`maxWidth` + ellipsis),
      evitando abas absurdamente largas.

## Versão 0.8.0.0

- [x] Liberar o modo host do Vite para poder ser acessado via IP local
    - `server: { host: true }` no `vite.config.ts`. Depende do backend liberar a origem LAN em
      `CORS_ALLOWED_ORIGINS` e o callback em `OAUTH_ALLOWED_REDIRECT_URIS` (o dev-login não depende
      do callback).
- [x] CRUD de feeds completo
    - Estreou a camada de formulários: `react-hook-form` + `zod` + `@hookform/resolvers`.
    - Componentes: `KeywordsInput` (chips 5..20, normaliza trim/lowercase/dedupe, contador),
      `FeedFormDialog` (criar/editar, validação Zod), `ConfirmDialog` (exclusão permanente),
      `FeedActionsMenu` (menu "⋮" do feed ativo, no cabeçalho da lista).
    - `FeedTabs`: "+" cria (desabilitado no limite de 5, com tooltip); as abas ficam limpas.
      Editar/excluir vivem no `FeedActionsMenu`, no cabeçalho da lista (oposto ao "X novas · Y
      totais"), então agem sobre o feed aberto. Estado vazio da `HomePage` também cria. Enriqueceu
      o tipo `Feed` com `keywords`.
    - Serviço/hooks: `FeedsService.create/update/remove` (+ `ApiClient.delete`),
      `useCreateFeed`/`useUpdateFeed`/`useDeleteFeed` (invalidam `['feeds']` e `['unreadCounts']`).

## Versão 0.9.0.0

- [x] Usuário (leitura) e preferências (renomeado "Configurações" → "Preferências" no menu)
    - Correção de escopo: **não há endpoint de escrita do usuário** (nome/email/picture vêm do
      Google) — então "CRUD do usuário" virou uma tela de **perfil somente-leitura**; o editável são
      as preferências. `ProfileDialog` (perfil) e `PreferencesDialog` (form) a partir do menu do avatar.
    - `PUT /users/me/preferences` devolve `access_token` novo (prefs vivem no JWT) — `SessionContext`
      ganhou `updateAccessToken` (troca leve), chamado pela mutation.
    - Reconciliação decidida: **`theme` do backend é a fonte da verdade** — o toggle do header aplica
      e persiste; no boot, `useThemeSync` aplica o tema salvo. O `language` do backend é o idioma de
      **tradução de conteúdo** (distinto do switcher PT/EN da UI, que segue client-side).

## Versão 0.10.0.0

- [x] Otimização de bundle (code splitting)
    - Rotas via `React.lazy` (`routes/lazyPages.ts` + `Suspense`/`PageLoader`) e diálogos de
      formulário (`LazyFeedFormDialog`/`LazyPreferencesDialog`) adiados até abrir. Chunk principal
      caiu de ~935 kB para ~488 kB (gzip 295→153 kB) e o aviso de chunk do Vite sumiu. Convenção
      registrada em `rules/performance.md`.

## Versão 0.11.0.0

- [x] Permitir reorganizar abas de feeds
    - Ordem persistida em **localStorage** (por-dispositivo) via um store + `useSyncExternalStore`
      (`hooks/feedOrderStore.ts` + `useOrderedFeeds`); reconcilia feeds novos (fim) e excluídos.
      `FeedTabs`/`HomePage` consomem `useOrderedFeeds`.
    - Diálogo `ReorderFeedsDialog` (arrastar com `@dnd-kit`, carregado _lazy_ via
      `LazyReorderFeedsDialog`), aberto por "Reorganizar feeds" no menu "⋮" do cabeçalho (após um
      divisor; desabilitado com < 2 feeds).
    - Dependência de backend anotada como upgrade futuro: **não há campo de ordem/endpoint** — por
      isso a ordem não sincroniza entre dispositivos por ora.

## Versão 0.12.0.0

- [ ] Revisão

## Versão 0.13.0.0

- [ ] Definir testes
- [ ] Garantir que textos vindos da API e que podem se tornar excessivamente grandes cabem nos elementos corretamente
    - Exemplos: título e corpo da notícia na listagem e selecionador de feed

## Versão 0.14.0.0

- [ ] Definir Taskfile
