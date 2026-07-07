# Roadmap

Este arquivo contém o atual estado de features.
Marcações em 'x' indica o que já está concluído.
Os níveis de tabulação indicam detalhes do assunto.

# Atual versão

0.1.0.0

## Versão 0.1.0.0

- [x] Criar o projeto para o Claude
- [x] Definir arquitetura e padrões técnicos
    - Resolvido: detalhes da stack completados (ver `CLAUDE.md`).
    - Resolvido: sessão do usuário = React Context (`access_token` em memória) + `localStorage` (`refresh_token`), reidratada via `POST /auth/refresh`. Detalhes em `rules/architecture.md`.

## Versão 0.2.0.0

- [ ] Configuração inicial do npm, React e Vite
- [ ] Configuração do .gitignore
- [ ] Configuração do prettier e eslint
- [ ] Permitir ver um "olá mundo" com o Vite de pé usando React

## Versão 0.3.0.0

- [ ] Definir layout básico
- [ ] Definir páginas

## Versão 0.4.0.0

- [ ] Definir testes
