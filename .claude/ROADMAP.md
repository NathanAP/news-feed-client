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

Fundação da aplicação — instalar e conectar as libs base (providers e app shell).

- [ ] Roteador (React Router) com estrutura de rotas base
- [ ] Material UI + tema (dark/light)
- [ ] Provider do TanStack Query
- [ ] react-i18next (PT/EN)
- [ ] Instância base do Axios em `src/services/api/` + interceptors (Bearer, refresh no 401, 503)

## Versão 0.4.0.0

- [ ] Definir layout básico
- [ ] Definir páginas

## Versão 0.5.0.0

- [ ] Definir testes
