# Convenções do código

Aqui estão as convenções de código quie devem ser seguidas para garantir um código limpo, consistente e de fácil manutenção.

- Código estrito, altamente tipado.
- Garanta sempre estar seguindo a filosofia da orientação à objetos.
- Variáveis, comentários e mensagens finais sempre em inglês.
- Garanta que variáveis tenham nomes claros.
- Prefira o uso de Enums em campos de multipla escolha ao invés de string crua.
- Todas as requisições devem ser feitas através do `Axios`.
- Tudo o que for relacionado a texto, seja em label, mensagens, placeholders, etc, deve estar presente no arquivo de internacionalização seguindo as convenções.
- Utilize arquivos de ambiente local (arquivos .env) para guardar informações secretas ou confidenciais.
- Utilize arquivos de ambiente local (arquivos .env) para preferências de modo desenvolvimento, homologação ou produção (Exemplo: ENVIRONMENT, MAILER_ACTIVE, NOTIFICATOR_ACTIVE).

# Convenções de componentização

Aqui estão todas as convenções de componentização da aplicação.

- Componentes devem ser criados na pasta `raiz/src/components/`.
- Siga a filosofia de componentização do React conforme a documentação oficial.
- Você tem liberdade em criar quaisquer tipo de componentes, desde que o motivo seja claro ou a reusabilidade traga benefícios.

# Convenções de internacionalização

Aqui estão todas as convenções de internacionalização.

- Idiomas disponíveis:
    - Inglês
    - Português
- A filosofia base aqui é: tudo se torna internacionalizado, seja em labels, mensagens, etc.
- Você tem liberdade total para decidir como organizar os arquivos de internacionalização, mas deve garantir que eles estejam organizados de forma clara e consistente.
    - Lembrando que a notícia vinda da API deve ser mostrada conforme o envio da API.

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
