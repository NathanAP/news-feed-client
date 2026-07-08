# Roadmap

Este arquivo contém o atual estado de features.
Marcações em 'x' indica o que já está concluído.
Os níveis de tabulação indicam detalhes do assunto.

# Atual versão

0.4.1.0

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
- [ ] Lembrete para a 0.5: o `ArticleResponse` hoje traz só `source_id`, não o nome/url da fonte. Para exibir a fonte no card com dados reais, o backend precisa incluir esse dado no `ArticleResponse` (senão seriam N requisições a `/sources/:id`).

## Versão 0.4.1.0

- [x] Bugfix: o "tempo relativo" do card (`há X min`/`há X h`) estava hardcoded em português nos dados de placeholder e não reagia à troca de idioma. Corrigido com `Intl.RelativeTimeFormat` localizado pelo idioma atual da UI.

## Versão 0.5.0.0

Comunicação com a API — trocar o placeholder por dados reais.

- [ ] `FeedsService` (`GET /feeds`) — abas a partir dos feeds do usuário.
- [ ] `ArticlesService` (`GET /feeds/:id/articles`) — notícias reais na coluna, com `is_read`.
- [ ] Dependência de backend: incluir nome/url da fonte no `ArticleResponse` (ver lembrete da 0.4).
- [ ] A definir depois: detalhe da notícia ao clicar; formulário de criar feed.

## Versão 0.6.0.0

- [ ] Definir testes

## Versão 0.7.0.0

- [ ] Definir Taskfile
