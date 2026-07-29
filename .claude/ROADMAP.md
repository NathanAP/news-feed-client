# Roadmap

Este arquivo contém o atual estado de features.
Marcações em 'x' indica o que já está concluído.
Os níveis de tabulação indicam detalhes do assunto.

# Atual versão

0.18.0.0

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

- [x] Alterar preferências de usuário
    - O controle de tema não é mais feito por lá, a partir de agora é tudo gerenciado por nós aqui no front
    - Os campos de tradução mudaram. Agora há um enum que se chama `language_to_translate`
        - Quando nulo, indica que a pessoa não quer receber traduções
        - Quando quando valor, indica qual é o idioma que a tradução ocorrerá
    - Esse campo continua sendo separado do idioma geral do I18n controlado por aqui
- [x] Colocar o campo de idioma geral do client pra dentro das preferências de usuário ao invés do menu
- [x] Acredito que isso não nos afete, mas agora não é mais necessário passar o idioma a qual queremos fazer a tradução
    - Quem decide isso agora é a rota através dos dados do `access_token`
- [x] Aceitar embeds de YouTube/Twitch (removido o DOMPurify do client; foldado nesta versão)
    - O conteúdo já vem sanitizado do backend (allowlist com iframes YouTube/Twitch, Instagram→link,
      sem class/style/id). O client renderiza direto e não re-sanitiza por ora; iframes ganham CSS
      responsivo (16:9). `dompurify` desinstalado.

## Versão 0.13.0.0

- [x] Revisão
    - Achado 1 (corretude): `ArticleDetailPage` marcava o artigo como lido via ref booleano que
      nunca resetava; navegação artigo→artigo (mesma instância de rota) deixaria de marcar o novo.
      Trocado por rastrear o `id` já marcado. Latente hoje (sem links artigo→artigo), blindado p/ 0.14.
    - Achado 2 (simplificação): efeito de boot do `SessionProvider` reimplementava
      `refreshAccessToken`; passou a reusá-lo (uma fonte de verdade para o refresh).
    - Achado 3 (UX): botão "⋮" do `NewsCard` abria menu vazio em notícia lida; agora só aparece
      enquanto há a ação "Marcar como lido" (não lida).
    - Achado 4 (docs): headers `0.14.0.0` duplicados no ROADMAP — renumeração em cascata.
    - Achado 5 (segurança): registrado em "Futuro" (confiança atual nas fontes/sanitização do backend).

## Versão 0.14.0.0

> Replanejada na sessão de UX da 0.14: a versão original juntava 4 superfícies de UI (login, guia de
> keywords, "Sobre nós", tutorial/Ajuda) — grande demais para "uma versão por vez". Fatiada uma-por-
> versão: **0.14** = fundação de marca + login; **0.15** = tutorial de fluxo (Ajuda + modal de 1º
> acesso); **0.16** = guia de keywords. A tela **"Sobre nós" foi removida do escopo** (sem conteúdo
> útil por ora). Decisão de cor: o dourado da marca (`#c8a04a` dark / `#8a6a1f` light) é **cor de
> marca/acento**, não substitui o `primary` (azul).

- [x] Fundação de marca (dourado como token de tema) + tela de login descritiva
    - Nome do app corrigido para **ChronoFeed** no i18n (`app.name`) — reflete no header e no login.
    - Dourado extraído para um token de paleta `brand` (`theme.ts`): `main` por esquema (dark
      `#c8a04a`, light `#8a6a1f` mais profundo p/ contraste no fundo claro) + `brandGold` exportado
      para usos decorativos. Header deixou de hardcodar o hex (fonte única). Registrado no `PROJECT.md`.
    - `LoginPage` redesenhada como hero: logo + wordmark dourado, tagline, descrição do app e três
      destaques (feeds personalizados, sem anúncios, no seu tempo), + card de login (Google/dev).
      Responsiva (empilha no mobile), theme-aware; cópia nova em PT/EN sob `landing.*` e `app.tagline`.

## Versão 0.14.1.0

- [x] Revisão da cópia da landing + landing movida para `/`
    - Cópia da landing reescrita pelo dono em PT (menos "cara de texto de IA": mais seca, sem
      travessões e sem floreios de marketing); versão EN realinhada ao mesmo registro. Paridade
      PT/EN mantida (84/84 chaves).
    - **Rotas**: login/landing agora em `/` e a área autenticada em `/feeds`. Desenho escolhido pelo
      dono e melhor que a alternativa registrada antes (fazer `/` ser _auth-aware_): aqui `/` é
      puramente pública e `/feeds` puramente protegida, então os guards já existentes resolvem os
      três fluxos só trocando de alvo. `/login` deixou de existir (sem usuários reais ainda).
    - `RoutePath`: `Home`→`Feeds` (`/feeds`), `Login`→`Landing` (`/`). `HomePage` renomeada para
      `FeedsIndexPage` (evita confusão com `FeedPage` em `/feeds/:feedId`). `/auth/callback` **não**
      mudou → allowlist `OAUTH_ALLOWED_REDIRECT_URIS` do backend não precisou de ajuste.
    - Restos de marca corrigidos: `<title>` do `index.html` e `aria-label` do `public/logo.svg`
      ainda diziam "news-feed-client" → "ChronoFeed".
    - **Títulos de aba** conforme a convenção nova do `PROJECT.md` (`{tela_atual} - ChronoFeed`):
      componente `PageTitle` usando o suporte nativo a metadados do React 19 (sem `react-helmet`),
      com os nomes de setor em i18n (`titles.*`).

## Versão 0.15.0.0

- [x] Tutorial de fluxo (como a aplicação funciona)
    - `TutorialSteps` é o conteúdo único (stepper 1—2—3, horizontal no desktop e vertical no
      mobile), embrulhado por `TutorialDialog` em duas variantes: **Ajuda** (entrada nova no menu do
      avatar, título "Como funciona") e **boas-vindas** (automático no primeiro acesso, título
      "Bem-vindo ao ChronoFeed" + botão "Começar"). Uma descrição do fluxo, dois gatilhos.
    - Flag `nfc.tutorialSeen` no `localStorage` (`useTutorialSeen`), montado no `AppLayout` para
      recepcionar onde quer que a pessoa caia na área autenticada. **Por-dispositivo** (o backend não
      tem campo para isso) — mesma limitação da ordenação de feeds da 0.11.
    - Carregado via `LazyTutorialDialog` (chunk de 14.9 kB só ao abrir), já que o `AppLayout` é eager.
    - Números do stepper usam o dourado da marca (identidade prevê o gold em "destaques de
      onboarding").

## Versão 0.15.1.0

- [x] Abas nomeadas pelo conteúdo (feed e notícia)
    - Sugestão levantada na 0.14.1.0 e aceita: com várias abas abertas, o nome do conteúdo
      identifica a aba melhor que o do setor. `/feeds/:feedId` → nome do feed;
      `/articles/:id` → título da notícia. Fallback no nome do setor enquanto o dado não chega.
    - `FeedPage` lê o nome via `useFeeds` (mesma queryKey `['feeds']` que as abas já carregam →
      cache hit, sem requisição nova). Convenção atualizada no `PROJECT.md`.
- [x] Limpeza da dívida de formatação (dobrada nesta versão)
    - `npm run format:check` já falhava no `master` em `NewsCard.tsx` e no `.md` da 0.12.0.0.
      Ambos reformatados (cosmético, sem mudança de comportamento); o check agora passa no repo
      inteiro.

## Versão 0.16.0.0

- [x] Guia didático de como escolher boas palavras-chave
    - `KeywordsGuide` (conteúdo puro, reaproveitável) dentro de um `Accordion` **recolhido** no
      `FeedFormDialog`, logo abaixo do `KeywordsInput` — a orientação fica onde a escolha acontece,
      sem empurrar o formulário.
    - Os 5 conselhos espelham as **regras reais** do julgamento (`memory/api-integration.md`), não
      conselho genérico: escrever **em inglês** (keywords das notícias são canônicas em inglês e não
      são traduzidas), usar bastante palavras (mais amplo), **uma só não basta** (overlap 1 =
      descartado), misturar específico e genérico (casamento exato), e **não é retroativo**.
    - Sem lazy próprio: o `FeedFormDialog` já é lazy, então o guia entra no chunk dele (36→47 kB, só
      ao abrir o formulário). Não sobre-fragmentar.
- [ ] **Achado a decidir**: o campo de keywords não dá nenhuma pista de que os termos devem ser em
      **inglês**, e o guia está recolhido por padrão. Um usuário PT tende a digitar "música" e ficar
      com um feed vazio para sempre, sem erro nenhum. Ver seção "Futuro".

## Versão 0.16.1.0

- [x] `vercel.json` com o rewrite de SPA (primeiro deploy na Vercel)
    - `/(.*)` → `/index.html`. Sem isso, acesso direto/F5 e sobretudo o retorno do OAuth em
      `/auth/callback` dão **404** — o login não completa. A Vercel checa o filesystem antes dos
      rewrites, então os assets seguem servidos normalmente.
    - `PROJECT.md` ganhou a seção **Deploy (Vercel)**, registrando o que custou tempo no primeiro
      deploy: as **três allowlists** do login (backend↔SPA, Google↔backend, CORS) e por que usar o
      domínio **estável** e não a URL com hash do deploy.

## Versão 0.17.0.0

- [x] Tô sentindo falta de uma confirmação tipo "feed salvo com sucesso", "feed atualizado com sucesso", etc. Acredito que seja importante colocar.
    - Quem sabe nas convenções seria importante colocar numa parte de formulários pra sempre ser programado junto né?
    - Estreou a camada de notificação com **notistack** (`SnackbarProvider` no `App.tsx`; toast de
      sucesso disparado de dentro dos hooks de mutation, não das telas, para valer para todos os
      gatilhos de uma vez). Cobre criar/editar/excluir feed (`useFeedMutations`) e salvar
      preferências (`usePreferences`). Nova seção "Convenções de formulários" em `conventions.md`
      registra a regra "toda mutation de escrita bem-sucedida dá feedback visível".
- [x] Trazer as palavras-chave recomendadas a partir da nova rota (ver `endpoints.md`)
    - `GET /feeds/keyword-suggestions?keywords=&limit=` → `{ strategy, suggestions: [{ keyword,
count }] }`. `FeedsService.keywordSuggestions` + `useKeywordSuggestions` (debounce de 400 ms
      via `useDebouncedValue`; re-consulta conforme as keywords mudam — `popular` sem nada escolhido,
      `related` depois). `KeywordSuggestions` mostra chips clicáveis abaixo do `KeywordsInput` no
      `FeedFormDialog`; clicar adiciona a keyword (normalizada). Chip com `count` no tooltip; some ao
      atingir 20 keywords ou quando não há sugestão. Ataca de lado o problema das keywords em inglês
      (item (b) da seção "Futuro"): a pessoa escolhe termos reais em vez de digitar em PT.

> O bloco original da 0.18 juntava a **infraestrutura** de administrador (flag, botão de alternar
> visão, guard de rota) com **seis funcionalidades** — CRUD completo de notícias e de fontes. Isso é
> maior que a 0.8 (CRUD de feeds) inteira, e ainda estreia a paginação no client, que não existia.
> Fatiado na sessão de planejamento da 0.18: **0.18** = infraestrutura + listagem de fontes (somente
> leitura, a menor tela que fecha o circuito e torna o guard verificável); **0.19** = CRUD de fontes;
> **0.20** = CRUD de notícias. Testes/Taskfile/Instagram descem um degrau cada.

## Versão 0.18.0.0

- [x] Criar regras para usuários administradores
    - Flag `admin` do `GET /users/me` no tipo `User` — **dica de UI apenas**: quem autoriza é a API,
      que reconfere a flag no banco a cada requisição de administrador. O client só decide o que
      renderizar.
    - Modo de visualização em `hooks/adminViewStore.ts` (store + `useSyncExternalStore` +
      `localStorage`, no padrão da ordenação de feeds da 0.11), consumido por `useAdminView`. Começa
      sempre em "usuário comum"; a flag do backend sempre vence o valor guardado.
    - `AdminViewToggle` ao lado do `ThemeToggle` no header, visível só para administradores; ícone
      indica a visão de destino (como o toggle de tema) e fica tingido de `primary` na visão admin.
    - `AdminRoute` renderiza o `NotFoundPage` **no lugar** (sem redirecionar, preservando a URL) para
      usuário comum e para admin na visão de usuário. Como o modo é lido de forma reativa, alternar
      a visão estando numa página guardada cai em not-found sozinho.
    - Listagem de fontes (`/sources`, entrada "Fontes" no menu do usuário só na visão admin):
      `SourcesService.list` + `useSources` (`keepPreviousData` para não piscar ao paginar), tela
      lazy. **Estreia a paginação no client** — `Pagination` do MUI direto, sem wrapper próprio até
      haver uma segunda listagem que justifique a abstração.
- [ ] Aviso de bundle voltou (medido, não é regressão de bytes): o chunk `index` foi de 478 kB para
      524 kB porque o Rolldown **fundiu** o chunk compartilhado `Menu` (37 kB) + `useRovingTabIndex`
      (4,8 kB) dentro dele ao rechunkar. O payload eager somado era ~521 kB antes e ~524 kB agora
      (+~2 kB, o custo real desta versão), mas o aviso de 500 kB por chunk voltou. Resolver de
      verdade pede uma estratégia de chunk de vendor (MUI), que merece versão própria — não
      `chunkSizeWarningLimit`, que só esconde (ver `rules/performance.md`).

## Versão 0.19.0.0

- [ ] Será que possível fazer um contorno ao redor de toda a tela pra indicar que estamos no modo administrador? Parece bobo mas acho que esse modo tá muito pouco visível se está ativo ou não apenas pelo botão.
- [ ] CRUD de fontes de notícias (admin)
    - Criar/editar/excluir a partir do menu "..." junto da listagem de fontes (`/sources`).
    - Formulário `{ name (≤120), url, url_rss }`; apoio de `GET /sources/rss-discovery?url=`.
    - Exclusão precisa avisar que **cascateia soft-delete nas notícias da fonte**; tratar 409 (url
      duplicada entre fontes ativas) e 403.

## Versão 0.20.0.0

- [ ] CRUD de notícias (admin)
    - Criação pela tela acessada no menu "..." do feed; edição/remoção pelo menu "..." do card na
      listagem — hoje esse menu **só aparece em notícia não lida** (decisão da 0.13), o que muda para
      administradores.
    - Formulário `{ title, content (HTML cru), url_original, keywords[5..20], source_id,
language_original }`: reusa o `KeywordsInput`, precisa de seletor de fonte e de um conjunto
      tipado para `language_original` (`pt|en|es|fr|de|it`). Sem `source_id` na edição (imutável).

## Versão 0.21.0.0

- [ ] Definir testes
- [ ] Garantir que textos vindos da API e que podem se tornar excessivamente grandes cabem nos elementos corretamente
    - Exemplos: título e corpo da notícia na listagem e selecionador de feed

## Versão 0.22.0.0

- [ ] Definir Taskfile

## Versão 0.23.0.0

- [ ] Tentar transformar URLs de Instagram em link integrado

## Futuro

- [ ] Keywords em inglês: tornar isso impossível de errar (levantado na 0.16.0.0)
    - A camada 1 do julgamento casa por keyword **exata**, e as keywords das notícias são **canônicas
      em inglês** e **não são traduzidas**. Logo, uma keyword em português simplesmente nunca casa —
      o feed fica vazio **para sempre**, sem erro, sem aviso. Como não é retroativo, a pessoa nem
      recupera o que perdeu ao corrigir.
    - Hoje o único aviso é o guia da 0.16, que está **recolhido** por padrão. Ideias, da mais barata
      à mais cara: (a) dizer "em inglês" no label/placeholder do campo; (b) autocomplete com termos
      populares reais vindos da API (a própria `memory/api-integration.md` sugere isso) — resolve de
      vez, porque a pessoa escolhe em vez de digitar; (c) o backend aceitar keywords em qualquer
      idioma e canonizar para inglês na escrita.
    - (b)/(c) dependem de backend. Vale conversar antes de escolher.
    - **Atualização (0.17.0.0):** o item (b) foi entregue — `KeywordSuggestions` traz chips de
      termos reais da API (`related`/`popular`) no `FeedFormDialog`, então a pessoa escolhe em vez de
      digitar em PT. Mitiga bastante, mas não fecha o buraco: quem ignora os chips e digita "música"
      à mão ainda cria um feed vazio sem aviso. Fechar de vez ainda pede (a) dizer "em inglês" no
      label/placeholder ou (c) o backend canonizar na escrita.

- [ ] Estratégia de chunk de vendor (levantado na 0.18.0.0)
    - O payload eager do app já beira 520 kB e é quase todo MUI. Enquanto o Rolldown o distribui em
      chunks compartilhados o aviso some, mas basta ele rechunkar para o `index` estourar 500 kB de
      novo. Um agrupamento explícito de vendor (`build.rolldownOptions.output.advancedChunks`) torna
      o resultado estável e mensurável. Nunca `chunkSizeWarningLimit` (esconde o problema).

- [ ] Religar a aplicação pelo client (levantado na 0.18.0.0)
    - Administradores atravessam a manutenção (o backend não os bloqueia), mas o client **não tem
      como religar a aplicação**: `PUT /system/app-status` é admin e isenta do guard, e não há UI
      para ela. Hoje religar exige chamar a rota fora do client. O `PROJECT.md` não lista essa rota
      entre as funcionalidades de client — decidir se entra.
    - Junto disso: `isUnderMaintenance` no `SessionProvider` **nunca volta para false** depois do
      primeiro 503. Quem estava com a tela de manutenção aberta precisa recarregar mesmo depois de a
      aplicação voltar.

- [ ] Defesa-em-profundidade na renderização de HTML da notícia (`ArticleDetailPage`)
    - Hoje o client renderiza `article.content` via `dangerouslySetInnerHTML` confiando 100% na
      sanitização do backend (bluemonday). Estamos cientes e confiando nas fontes por ora. Se um dia
      as fontes deixarem de ser 100% confiáveis, reintroduzir sanitização client-side (ex.: DOMPurify
      com allowlist de iframes YouTube/Twitch) como segunda camada.
