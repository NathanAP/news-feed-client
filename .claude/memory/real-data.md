# Dados reais: feeds, notícias, detalhe (resumo)

Implementado na `0.5.0.0`. Fonte: `versions/20260708200000_0.5.0.0.md`.

- **Serviços**: `FeedsService.list()` (`GET /feeds`), `ArticlesService.listByFeed(feedId, {isRead?,
pageSize?})` (`GET /feeds/:id/articles?with_sources=true`), `.getById(id)` (`GET /articles/:id`,
  **não** traz `source`), `.markAsRead(id)` (`PUT /articles/:id/read`, marca em todos os feeds numa
  chamada, no-op se não estiver em nenhum). `SourcesService.getById(id)` (`GET /sources/:id`) —
  usado só na tela de detalhe pra suprir o `source` que `GET /articles/:id` não traz.
- **Rotas**: `/` (redireciona pro primeiro feed ou estado vazio), `/feeds/:feedId` (`FeedPage`),
  `/articles/:id` (`ArticleDetailPage`, **protegida** — exige login, mesmo sendo notícia "global").
  Aba ativa do `FeedTabs` vem da URL (`useParams`), não de estado local.
- **Mutations/cache**: marcar como lido usa `useMutation` + `queryClient.invalidateQueries` com
  prefixo `['feedArticles', feedId]` (cobre lista e contagem de não-lidas de um feed) — na tela de
  detalhe, invalida o prefixo mais amplo `['feedArticles']` (não sabe de qual feed veio).
- **Cabeçalho "X novas · Y totais"**: 2 requisições por feed selecionado (lista completa + uma
  leve `is_read=false&page_size=1` só pra contagem). Indicador por-aba (todas as abas) foi adiado
  pra 0.6.0.0 por custo (N feeds = N requisições extras, sem endpoint de contagem em lote).
- **HTML da notícia**: renderizado direto via `dangerouslySetInnerHTML` (o backend já sanitiza com
  bluemonday; allowlist inclui iframes YouTube/Twitch, Instagram vira link, sem class/style/id).
  **DOMPurify foi removido na 0.12** (o client não re-sanitiza por ora). Estilizar por seletor de
  tag/contexto; iframes têm CSS responsivo (16:9). Ver [[preferences-and-profile]] e a memória de API.
