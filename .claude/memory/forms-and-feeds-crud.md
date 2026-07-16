# Camada de formulários + CRUD de feeds (resumo)

Implementado na `0.8.0.0`. Fonte: `versions/20260709180000_0.8.0.0.md`.

## Padrão de formulários (estreou aqui — reusar)

- Stack: `react-hook-form` + `zod` + `@hookform/resolvers` (`zodResolver`).
- Schema recriado por idioma: `useMemo(() => z.object({...}), [i18n.language])` com mensagens vindas
  de `t(...)`, para validação localizada. Campos customizados (não-TextField) via `Controller`.
- Mensagens de validação e labels sempre no i18n (namespaces `common.*` e `feedForm.*`).

## Feeds CRUD

- `Feed` agora é `{ id, name, keywords }`. `FeedInput = { name, keywords }`.
- `FeedsService.create/update/remove`; `ApiClient` ganhou `delete<T>`. `toFeed` já mapeia
  `keywords` (vêm no `FeedResponse`), então a edição pré-preenche sem GET extra.
- Hooks `useCreateFeed/useUpdateFeed/useDeleteFeed` (`hooks/useFeedMutations.ts`) invalidam
  `['feeds']` e `['unreadCounts']`.
- Componentes em `components/feeds/`: `KeywordsInput` (chips via `Autocomplete` multiple/freeSolo;
  5..20; `normalizeKeywords` = trim+lowercase+dedupe+cap), `FeedFormDialog` (criar/editar),
  `FeedActionsMenu` (menu "⋮" do feed ativo). `components/ConfirmDialog.tsx` para exclusão
  (permanente, sem reativação).
- Onde ficam as ações: **criar** = "+" no `FeedTabs` (abas ficam limpas). **Editar/excluir** =
  `FeedActionsMenu` no cabeçalho da `NewsList` (oposto ao "X novas · Y totais"), agindo sobre o feed
  **aberto** — por decisão de UX, para o gatilho ser um `IconButton` normal em vez de aninhado na aba.
- **0.16.0.0**: `KeywordsGuide` (conteúdo puro, 5 conselhos) num `Accordion` recolhido no
  `FeedFormDialog`, abaixo do `KeywordsInput`. Os conselhos espelham as regras reais do julgamento
  (ver `api-integration.md` §2): keywords das notícias são **canônicas em inglês** e não traduzidas
  (keyword em PT nunca casa); overlap 1 = descartado; casamento **exato**; mais keywords = mais
  amplo; **não é retroativo**. Sem lazy próprio — o `FeedFormDialog` já é lazy. **Achado aberto**
  (ROADMAP → Futuro): nada no campo avisa que os termos devem ser em inglês e o guia vem recolhido,
  então dá para condenar um feed a ficar vazio para sempre sem nenhum erro.
- Constantes de negócio: `MIN_KEYWORDS=5`, `MAX_KEYWORDS=20` (em `components/feeds/keywords.ts`, fora
  do componente por causa da regra `react-refresh/only-export-components`); `MAX_ACTIVE_FEEDS=5` no
  `FeedTabs`.

## Gotchas

- Regra ESLint `react-refresh/only-export-components`: um arquivo de componente não pode exportar
  constantes/funções junto — extrair para um módulo `.ts` separado (ex.: `keywords.ts`).
- Não aninhar `<button>` dentro do `Tab` (que já é `<button>`). Foi o motivo de tirar o menu de
  gerenciar de dentro da aba e movê-lo para o cabeçalho da lista (`FeedActionsMenu`), onde vira um
  `IconButton` normal. Evitar recriar gatilhos interativos dentro de `Tab`.
- Botão desabilitado dentro de `Tooltip` precisa de um `<span>` wrapper para o tooltip funcionar.
- Ícone de excluir nesta versão do MUI: `@mui/icons-material/DeleteOutlined` (com "d"); `DeleteOutline`
  não existe — mesmo padrão do `PersonOutlined`.
- Erro 409 do `POST /feeds/create` = limite de 5 feeds ativos; tratar com mensagem própria além de
  desabilitar o "+" proativamente.
- Bundle passou de ~700 kB para ~922 kB (form libs + `Autocomplete`); aviso de chunk do Vite agora
  aparece — candidato a code-splitting.
