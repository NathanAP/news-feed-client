# Ordenação de abas de feeds (resumo)

Implementado na `0.11.0.0`. Fonte: `versions/20260709230000_0.11.0.0.md`.

## Persistência

- Ordem guardada em **localStorage** (`nfc.feedOrder` = array de ids), **por-dispositivo**. O backend
  **não tem campo de ordem nem endpoint de reorder** — sincronizar entre dispositivos é upgrade futuro.
- `hooks/feedOrderStore.ts`: store externo (`subscribe`/`getSnapshot`/`setOrder`) consumido via
  **`useSyncExternalStore`** — a primitiva idiomática do React p/ assinar estado externo (localStorage
  sozinho não dispara re-render). `getSnapshot` cacheia a referência enquanto o valor não muda.
- `hooks/useOrderedFeeds.ts`: `useFeedOrder()` (assina o store) e `useOrderedFeeds()` (= `useFeeds()`
  reordenado + reconciliado: ordem salva primeiro, feeds novos ao fim, ids inexistentes descartados).
  `FeedTabs` e `HomePage` consomem `useOrderedFeeds`.

## UI

- `components/feeds/ReorderFeedsDialog.tsx`: `@dnd-kit` (`DndContext`+`SortableContext` vertical +
  `useSortable`), Pointer+Keyboard sensors, `arrayMove` no `onDragEnd`, Salvar→`setOrder`.
- `LazyReorderFeedsDialog`: `React.lazy` — o `@dnd-kit` fica num chunk próprio, baixa só ao abrir.
- Aberto por "Reorganizar feeds" no `FeedActionsMenu` (menu "⋮" do cabeçalho), após um `Divider`,
  desabilitado com < 2 feeds.

## Gotchas

- Espalhar `{...query, data}` (como em `useOrderedFeeds`) **perde a narrowing** do TanStack Query →
  consumidores precisam guardar `data !== undefined` (feito no `HomePage`).
- **`@dnd-kit` não é reproduzível na automação do harness** (screenshot/left_click_drag dão timeout;
  keyboard-drag e PointerEvents sintéticos não reordenam). Verificar o mecanismo de ordem via
  localStorage+reload e o Salvar via localStorage; o gesto de arraste exige teste manual.
