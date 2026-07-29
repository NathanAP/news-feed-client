# Convenções do código

Aqui estão as convenções de código quie devem ser seguidas para garantir um código limpo, consistente e de fácil manutenção.

- Código estrito, altamente tipado.
- Garanta que regras e códigos considerados legados no TypeScript e React não sejam utilizados.
- Garanta sempre estar seguindo a filosofia da orientação à objetos.
    - Dito isso, você tem total incentivo para criar classes herdáveis, interfaces e abstrações para garantir que o código seja reaproveitável.
    - A exceção desta regra é a camada de UI (componentes e roteador), que deve ser declarativa, baseada em funções + hooks. Class components são legado no React e não devem ser usados.
- Variáveis, comentários e mensagens finais sempre em inglês.
- Garanta que variáveis tenham nomes claros.
- Prefira conjuntos de valores fixos e tipados a strings cruas em campos de múltipla escolha. Em vez do `enum` do TypeScript, use um objeto `as const` com um tipo de união derivado (comporta-se como enum, mas é erasável, compatível com `erasableSyntaxOnly` e é a recomendação moderna do TS). Exemplo: `const Theme = { Light: 'light', Dark: 'dark' } as const; type Theme = (typeof Theme)[keyof typeof Theme]`.

- Todas as requisições devem ser feitas através do `Axios`.
- Tudo o que for relacionado a texto, seja em label, mensagens, placeholders, etc, deve estar presente no arquivo de internacionalização seguindo as convenções.
- Utilize arquivos de ambiente local (arquivos .env) para guardar informações secretas ou confidenciais.
- Utilize arquivos de ambiente local (arquivos .env) para preferências de modo desenvolvimento, homologação ou produção (Exemplo: ENVIRONMENT, MAILER_ACTIVE, NOTIFICATOR_ACTIVE).

# Convenções de componentização

Aqui estão todas as convenções de componentização da aplicação.

- Componentes devem ser criados na pasta `raiz/src/components/`.
- Siga a filosofia de componentização do React conforme a documentação oficial.
- Você tem liberdade em criar quaisquer tipo de componentes, desde que o motivo seja claro ou a reusabilidade traga benefícios.
- Componentes e o roteador devem ser declarativos, baseados em funções + hooks. Class components são legado no React e não devem ser usados.

# Convenções de layout

- Utilize os padrões de responsividade do React e CSS para garantir que a aplicação funcione corretamente em qualquer tamanho de tela.
- Elementos como a `badge` (pípulas, boxes ou algum tipo de indicador de quantidade) devem respeitar o tamanho convencional para não ficarem distorcidos, achatados ou esticados. Em caso de valores muito altos, utilize o padrão de "9+" ou "99+" (de acordo com o tamanho do badge) para não quebrar o layout.
- Garanta que o layout da aplicação possa suportar valores muito altos também.
    - Por exemplo, em labels de textos trazidos da API e registrados pelo usuário, garanta que o layout não quebre caso o usuário insira um texto muito grande.
    - Você tem liberdade em decidir como tratar esses casos, seja adicionando "...", "ver mais" ou qualquer outro tipo de solução que não quebre o layout, incluindo limitações via CSS.

# Convenções de formulários

Aqui estão as convenções para formulários e ações de escrita (mutations).

- **Feedback de sucesso obrigatório.** Toda mutation de escrita bem-sucedida que o usuário dispara
  (criar, editar, excluir, salvar) deve dar um feedback visível de confirmação — um toast/snackbar
  de sucesso. O objetivo é o usuário nunca ficar sem saber se a ação funcionou.
- **Onde disparar.** O feedback de sucesso é disparado de dentro do hook de mutation (no `onSuccess`
  do TanStack Query), não da tela. Assim vale para todos os gatilhos daquela ação de uma vez
  (ex.: excluir um feed dá o mesmo toast venha do menu ou de onde for) e não dá para esquecer de
  programar em um caminho novo.
- **Notificação.** A camada de toast é o **notistack** (`SnackbarProvider` montado no `App.tsx`,
  dentro do `ThemeProvider`). Use `useSnackbar().enqueueSnackbar(t('...'), { variant: 'success' })`.
  Erros continuam podendo ser mostrados inline no próprio formulário (ex.: `Alert` no diálogo) quando
  fizer sentido manter o contexto — as duas coisas não se excluem.
- **Texto sempre internacionalizado**, como todo o resto (ver convenções de i18n).

# Convenções de internacionalização

Aqui estão todas as convenções de internacionalização.

- Idiomas disponíveis:
    - Inglês
    - Português
- A filosofia base aqui é: tudo se torna internacionalizado, seja em labels, mensagens, etc.
- Você tem liberdade total para decidir como organizar os arquivos de internacionalização, mas deve garantir que eles estejam organizados de forma clara e consistente.
    - Lembrando que a notícia vinda da API deve ser mostrada conforme o envio da API, independente do idioma.
    - Mais tarde teremos a funcionalidade de tradução que ajudará bastante nesses casos.

# Versionamento

- Utilize a pasta `.claude/versions` para especificar o que foi feito em cada versão por você.
    - Arquivos nesta pasta sempre em formato `md`.
    - A nomenclatura de arquivos nesta pasta deve ser `timestamp_versão`, por exemplo `20260623090000_0.1.0.0.md`.
    - Perceba que este arquivo também é uma ótima fonte de informações para entender as mudanças em qualquer altura da vida útil da aplicação.
    - Pode colocar bastante detalhes caso ache necessário.
- As versões devem seguir o padrão `major.minor.patch.docs`.
    - Subir uma versão também zera todos à sua direita. Ou seja:
        - se a versão `10.5.2.14` sofrer uma atualização `docs`, a nova versão é `10.5.2.15`.
        - se a versão `10.5.2.15` sofrer uma atualização `patch`, a nova versão é `10.5.3.0`.
        - se a versão `10.5.3.0` sofrer uma atualização `minor`, a nova versão é `10.6.0.0`.
        - se a versão `10.6.0.0` sofrer uma atualização `major`, a nova versão é `11.0.0.0`.
- Ao concluir uma alteração major, minor ou patch o agente `test_manager` deve ser acionado para que seja efetuada uma nova rotina de testes. A falha dessa rotina deve impedir a continuidade do processo de desenvolvimento.

# Convenções de workaround

- Workarounds são necessários mas a preferência é no ajuste do código para evitar essas necessidades. Sabemos que um refatoramento é demorado e perigoso, mas quando necessário, tem que ser feito o quanto antes para evitar problemas maiores no futuro.
- Ao notar que um workaround é necessário, sempre avise e explique o motivo e a solução proposta. Caso seja muito grande ou seja considerada uma gambiarra de código, considere parar o processo para falar sobre isso.

# Convenções de arquivos e pastas

- A nomenclatura de arquivos e pastas da aplicação deve seguir a filosofia geral do TypeScript e React.

# Convenções de datas

- As datas vindas da API são sempre em UTC e devem ser convertidas para o fuso horário do usuário antes de serem exibidas.
