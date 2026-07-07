# Roadmap

Este arquivo contém o atual estado de features.
Marcações em 'x' indica o que já está concluído.
Os níveis de tabulação indicam detalhes do assunto.

# Atual versão

0.2.0.0

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

- [ ] Instância base do Axios em `src/services/api/` + interceptors (Bearer, refresh no 401, 503)
- [ ] Provider do TanStack Query
- [ ] Criar login no Axios
- [ ] Criar tela de login através do Google + callback + erro
    - Pode ser só um botão bem cru por enquanto, depois vamos trazer os elementos de UI para o jogo
- [ ] Após o login, ir para uma tela com os dados básicos do usuário
- [ ] Garantir que o `access_token` e `refresh_token` vieram corretamente

## Versão 0.4.0.0

- [ ] Roteador (React Router) com estrutura de rotas base
- [ ] Material UI + tema (dark/light)
- [ ] react-i18next (PT/EN)

## Versão 0.5.0.0

- [ ] Definir layout básico
- [ ] Definir páginas

## Versão 0.6.0.0

- [ ] Definir testes
