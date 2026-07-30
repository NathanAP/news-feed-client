# Modo administrador (resumo)

Implementado na `0.18.0.0`. Fonte: `versions/20260729160000_0.18.0.0.md`.
Spec do dono: seção "Administradores" do `PROJECT.md`.

## A flag

- `admin: boolean` em `User`/`UserResponse`, vindo do `GET /users/me` (também existe como claim do
  `access_token` — o client usa o `GET`, via `useCurrentUser`, que já está em cache; nada de decodificar JWT).
- **É dica de UI, não autorização.** A API reconfere a flag no banco a cada requisição de admin:
  usuário comum leva `403` mesmo que o client renderize o botão. Serve só para decidir o que exibir.
- Consequência conhecida: promover alguém vale na API na hora, mas o token/`/users/me` em cache ainda
  diz `false` até renovar. Um `POST /auth/refresh` (ou novo login) resolve.

## Modo de visualização (puramente visual)

- `hooks/adminViewStore.ts`: `AdminViewMode` (`user`|`admin`, objeto `as const` + união) + store
  externo em `localStorage` (`nfc.adminView`), consumido por `useSyncExternalStore` — mesmo padrão do
  [[feed-ordering]] (`feedOrderStore`), mas sem cache de referência: o snapshot é uma string.
- `hooks/useAdminView.ts` → `{ isAdmin, isAdminView, isPending, mode, setMode }`. **A flag do backend
  sempre vence**: `isAdminView = isAdmin && mode === 'admin'`.
- **Per-device**, como a ordenação de feeds e o `tutorialSeen` — o backend não tem campo para isso.
- A API não sabe que esse modo existe: alternar não muda requisição nenhuma.
- Padrão ao entrar: **visão de usuário comum** (decisão do dono, registrada no `PROJECT.md`).

## Guard de rota

- `routes/AdminRoute.tsx` (layout route sem path) **renderiza** `NotFoundPage` no lugar em vez de
  redirecionar → URL preservada, indistinguível de qualquer endereço inválido.
- Um componente cobre os dois casos (usuário comum digitando a URL; admin que troca de visão), porque
  o modo é lido de forma reativa.
- Mostra `PageLoader` enquanto `useCurrentUser` está pendente — senão pisca 404 para o admin que dá F5.
- Fica **dentro** do `AppLayout` (uma instância só). Colocá-lo acima criaria uma segunda árvore com
  `<AppLayout />` e o header **remontaria** ao navegar entre as áreas.
- `NotFoundPage` tem a prop `embedded` (troca `100dvh` por `50dvh`) para esse uso.

## Onde as ações de admin moram (spec do `PROJECT.md`)

Não existe "área de admin" separada — cada ação fica ancorada onde o objeto já vive:

- Criar notícia → menu "..." do feed. Editar/remover notícia → menu "..." do **card da listagem**
  (feito na 0.20; a condição do menu virou `isUnread || isAdminView`).
- Listagem de fontes → menu do usuário (feito). Criar/editar/remover fonte → menu "..." da listagem.

## Sinalização do modo (0.19)

- `AdminViewOutline` no `AppLayout`: moldura `fixed` de 2px em `primary.main` ao redor da viewport
  enquanto a visão admin está ligada. `pointer-events: none` e `zIndex` de tooltip (fica visível com
  diálogo aberto). `aria-hidden` — o estado já é anunciado pelo rótulo do botão.

## Estado atual e o que falta

- Feito na 0.18: flag, toggle (ao lado do `ThemeToggle`), guard, e `/sources` somente leitura.
- Feito na 0.19: **CRUD de fontes** + contorno do modo. `SourceFormDialog` (lazy) com Zod,
  `SourceActionsMenu` ("⋮" por linha), "Nova fonte" no cabeçalho e no estado vazio, descoberta de
  RSS, `ConfirmDialog` com aviso de cascata.
- Feito na 0.20: **CRUD de notícias**. `ArticleFormPage` (`/articles/new` e `/articles/:id/edit`,
  lazy, atrás do `AdminRoute`), `SourcePicker` com busca no servidor, editar/excluir no "⋮" do card.
- **Paginação**: `Pagination` do MUI direto no `SourcesList`, sem wrapper — segue havendo uma só
  listagem paginada (a de notícias da 0.20 não existe; o form não lista). Extrair se aparecer a segunda.
- O conjunto de admin do client está **completo** conforme o `PROJECT.md`. Ver `ROADMAP.md` para o
  que sobra (testes, Taskfile, chunk de vendor).

## Gotchas do CRUD de notícias (0.20)

- **Criar notícia não passa pelo julgamento** (decisão de produto, no `PROJECT.md`): a rota existe
  por padronização e para futuras **notícias patrocinadas**. Logo a notícia não entra em feed nenhum
  — a tela avisa isso, e o `useCreateArticle` **não invalida nada** de propósito.
- `source_id` é **imutável**: só existe na criação (`CreateArticleInput`), some na edição.
- O menu "⋮" do card era `isUnread` (0.13); virou `isUnread || isAdminView`. O espírito continua: só
  aparece quando tem o que oferecer.
- **Largura por rota**: quem precisa de container largo pede pelo `handle` do React Router
  (`routes/routeHandle.ts` + `useMatches` no `AppLayout`), não por sniff de pathname — e sem criar
  uma segunda árvore de `AppLayout`, que remontaria o header.
- **Tipagem do zodResolver**: o _input_ do schema tem que bater com o tipo do formulário. Campo de
  select que começa vazio pede `z.union([z.literal(''), z.enum(X)])` + `refine` com type predicate;
  um `z.string()` simples gera `string` e quebra a atribuição do resolver.
- `Language` mora em `types/language.ts` (dois consumidores) e os nomes dos idiomas em `languages.*`.
- **Devtools do React Query cobrem o canto inferior** em janela pequena e engolem cliques em botão
  de formulário. Se um clique "não faz nada" na verificação, cheque `document.elementFromPoint` antes
  de suspeitar do código.

## Gotchas do CRUD de fontes (0.19)

- **Invalidar só `['sources']` não basta.** Editar muda o nome exibido no rodapé dos cards e excluir
  cascateia soft-delete nas notícias → as duas invalidam `['feedArticles']`; excluir também
  `['unreadCounts']`. O prefixo `['feedArticles']` já cobre `['feedArticles', feedId, 'unreadCount']`.
- **`z.url()`, não `z.string().url()`** — o segundo está `@deprecated` no Zod 4.
- **Campo escrito por `setValue` tem que ser controlado (`Controller`).** O `setValue` escreve direto
  no nó do DOM sem disparar evento de mudança do React, então um `TextField` não controlado do MUI
  segue achando que está vazio e **derruba o rótulo por cima do texto** ao perder o foco (bug da
  0.19.1.0, no campo de RSS preenchido pela descoberta). Campos escritos só pelo `reset` podem
  continuar com `register` — o `reset` roda na montagem, quando o MUI ainda faz sua verificação
  inicial. O `KeywordsInput` nunca sofreu disso porque já era `Controller`.
- Descoberta de RSS é `useMutation` (ação de botão), não query desabilitada com `refetch`.
- `GET /sources/rss-discovery` **não é admin-only** (qualquer autenticado); só o `article-discovery` é.
- Excluir a última linha de uma página > 1 deixa a listagem vazia (API responde `docs: []`, sem
  erro) → a `SourcesPage` volta uma página via callback `onDeleted`.
- O `Alert` de erro da mutation não é limpo ao editar os campos (mesmo comportamento do
  `FeedFormDialog` desde a 0.8) — limpeza candidata para tratar os dois juntos.

## Gotchas

- **`403` ≠ `401`.** O interceptor do `ApiClient` só reage a `401` (renova) e `503` (manutenção);
  `403` sobe para quem chamou. Não deslogar em `403` — a sessão está válida, falta permissão.
- Itens condicionais dentro do `Menu` do MUI devem ser **array com `key`**, não fragmento, senão o
  MUI perde a navegação por teclado.
- Admin **atravessa a manutenção** no backend, mas o client não tem UI para `PUT /system/app-status`
  — não dá para religar a aplicação por aqui (registrado em "Futuro" no `ROADMAP.md`).
- O usuário **dev já é administrador** no banco desde 30/07/2026 (o dono promoveu). Não é mais
  preciso forçar a flag no `UsersService` para verificar a UI de admin — se um dia voltar a `false`,
  esse era o truque (forçar e reverter).
