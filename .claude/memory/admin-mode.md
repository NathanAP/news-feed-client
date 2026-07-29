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
  (que hoje só aparece em notícia **não lida**, decisão da 0.13 — vai precisar mudar p/ admin).
- Listagem de fontes → menu do usuário (feito). Criar/editar/remover fonte → menu "..." da listagem.

## Estado atual e o que falta

- Feito na 0.18: flag, toggle (ao lado do `ThemeToggle`), guard, e `/sources` **somente leitura**
  (`SourcesService.list` + `useSources` com `keepPreviousData`, tela lazy).
- **Estreia da paginação no client**: `Pagination` do MUI direto no `SourcesList`, sem wrapper — só
  há uma listagem paginada até agora. Extrair quando houver a segunda (0.20).
- 0.19 = CRUD de fontes; 0.20 = CRUD de notícias. Ver `ROADMAP.md`.

## Gotchas

- **`403` ≠ `401`.** O interceptor do `ApiClient` só reage a `401` (renova) e `503` (manutenção);
  `403` sobe para quem chamou. Não deslogar em `403` — a sessão está válida, falta permissão.
- Itens condicionais dentro do `Menu` do MUI devem ser **array com `key`**, não fragmento, senão o
  MUI perde a navegação por teclado.
- Admin **atravessa a manutenção** no backend, mas o client não tem UI para `PUT /system/app-status`
  — não dá para religar a aplicação por aqui (registrado em "Futuro" no `ROADMAP.md`).
- O usuário **dev não é administrador** no banco (`admin: false`). Para verificar a UI de admin,
  forçar a flag no `UsersService` temporariamente e reverter.
