# Resumo

Client web em React com TypeScript para um feed de notícias personalizado usando fontes RSS.

# Regras de desenvolvimento

- Siga as convenções e regras presentes na pasta `raiz/.claude/rules/`.
- Leia o arquivo `raiz/.claude/ROADMAP.md` para entender qual sua próxima missão.
- Faça apenas uma versão por vez conforme especificado. Esta regra é restrita.
- Você pode está livre para indicar problemas que versões futuras podem trazer ou estejam mal planejadas.
- Ao desenvolver tente entender um pouco como as próximas versões e as até os planejamentos de longo prazo afetam seu código.
- Você tem liberdade para indicar a mim problemas de planejamento.
- Você tem liberdade para durante a criação de testes unitários, de integração e end-to-end.
- Durante a etapa de criação de testes, não tem problema se houver grande volume de código ou tempo para as tantas diversas situações que podem ocorrer em uma rota ou handler. O importante é garantir que ela cobre a maioria das situações.
- O desenvolvimento deve seguir estas etapas:
    - Entendimento da tarefa.
    - Melhoria da clareza escrita na especificação da tarefa.
    - Planejamento de programação da tarefa.
    - Execução.
    - Atualização do arquivo `raiz/.claude/rules/structure.md` caso necessário.
    - Atualização nos testes unitários, de integração e end-to-end presentes em `raiz/tests/`.
    - Atualização nos scripts de teste presentes em `raiz/cmd/`.
    - Atualização de arquivos de controle de versão.
    - Criar um arquivo na pasta `versions/` para resumir o que foi feito.
    - Atualização de arquivos de controle de memória.
    - Resumir o que foi feito.
    - Explicar a melhor forma de testar o que foi feito (quando aplicável).
- Sempre atualize a versão do arquivo `raiz/.claude/ROADMAP.md` conforme a versão desenvolvida.
- Ao seguir o arquivo `raiz/.claude/ROADMAP.md`, desenvolva uma versão de cada vez e confirme comigo antes de avançar para a próxima etapa.
- Ao analisar as sprints do arquivo `raiz/.claude/ROADMAP.md`, você tem liberdade para criticar ou corrigir tamanho de sprint, altas complexidades de código ou regras de negócio, assim como quebras de fluxos já escritos, conflito de convenções e até mesmo dificuldades futuras. Isso fará com que nós possamos pensar juntos em soluções e deixará a aplicação melhor. Seu papel nisso é fundamental.
- Você tem liberdade para corrigir erros claros de ortografia na documentação, como falta de letras ou acentos.
- Você tem liberdade em decidir que uma revisão de código usando um modelo maior é necessária quando uma nova versão for feita ou muito tempo tenha se passado desde a última revisão.

# Regras de revisão

- Modelo mínimo a ser usado: Claude Opus 4.8. Você deve parar a revisão caso o modelo selecionado tiver sido abaixo deste.
- O revisor deve garantir a qualidade e consistência do código.
- O revisor deve fornecer feedbacks construtivos em qualquer altura, seja sobre o fluxo do código ou até mesmo a documentação.
- O revisor deve garantir que o código segue as regras, convenções e filosofias do projeto.
- O revisor deve indicar quais são as melhorias, os motivos e como fazer elas.
- O revisor deve elencar problemas de fluxo não notados anteriormente (exceções de fluxos ou situações adversas).
- O revisor deve garantir que o versionamento (`raiz/.claude/versions`) está consistente.
- O revisor deve garantir a qualidade de internacionalização através do I18n.
- Alterações causados pelo revisor sobem uma versão de patch (por exemplo, se a revisão `10.1.2.15` gerou um bug e foi consertado, a nova versão deve ser `10.1.3.0`).
- Bugs graves devem ter preferência e podem garantir uma versão única de patch.
- Refatorações estão liberadas conforme necessário, mas faz-se necessário o planejamento junto a mim.
- O revisor tem total incentivo para elencar também os seguintes pontos como problema:
    - Código inutilizado ou morto.
    - Código que gera problemas de performance (exemplo: envio excessivo de requisições).
    - Código que não respeita a filosofia de programação da linguagem (exemplo: alteração em um componente provoca atualização em toda a página).
    - Má aplicação de convenções básicas (exemplo: uso explícito de `any` em TypeScript).
    - Má aplicação da filosofia de componentização, seja ela por ter criado desnecessariamente ou a falta da criação de uma.
    - Internacionalização não utilizada, principalmente textos hardcoded que deveria estar na internacionalização.
        - Valores não utilizados nos arquivos `locale` podem ser mencionados como problema menor.
    - Tipagem errada.
    - Gambiarra explícita.
    - Código considerado depreciado pela biblioteca ou semi-depreciado (ou seja, que vai se tornar depreciado).

## Arquivos e pastas

Você tem liberdade para acessar qualquer arquivo da pasta `.claude`.

- `CLAUDE.md`: contém um resumo geral e técnico do projeto.
- `PROJECT.md`: contém um resumo de como o projeto funciona (filosofia, fluxos, features, restrições, etc).
- `ROADMAP.md`: contém o roadmap do projeto, que também pode ser visto como uma lista de TODO.
- `agents/`: contém os agentes que dão suporte e estão presentes no desenvolvimento do projeto.
- `memory/`: contém um conjunto de resumos criados por você mesmo para ajudar a sua memória ser mais enxuta e não depender de ler todo o projeto toda vez.
- `rules/`: contém um conjunto de regras para ajudar no desenvolvimento do projeto.
- `versions/`: contém um conjunto de arquivos especificando o que foi feito por você em cada versão do projeto.

## Stack

- `TypeScript`: linguagem base.
- `Vite.js`: ferramenta de desenvolvimento.
- `React`: framework base.
- `React router`: gerenciador de rotas.
- `React context + localstorage`: gerenciador de memória e sessão.
- `React hook form`: gerenciador de formulários.
- `React-i18next + i18next`: internacionalização.
- `Material UI`: framework de UI base.
- `Axios`: envio de requisições.
- `Tanstack Query`: gerenciador de queries do servidor.
- `Zod`: validação geral de formulários.
- `DateFNS + tz`: gerenciador de datas.
- `Vitest + React Testing Library + Playwright`: gerenciador de testes.
- `DOMPurify`: sanitização de HTML.
- `ESLint + Prettier`: padronização de código.

## Regras da stack

- Bibliotecas da devem sempre estar na versão mais atualizada possível.
