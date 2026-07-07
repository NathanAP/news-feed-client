# Como encontrar a API

- A API pode ser encontrada através da variável de ambiente `API_URL`.
- O arquivo `raiz/.claude/memory/api.md` contém um resumo de como a API funciona, incluindo os endpoints, métodos, parâmetros e respostas.
- Se em algum momento você precisar de mais informações sobre detalhes da API, você deve me informar para que eu possa garantir mais detalhes no arquivo da memory ou aqui mesmo.

# Regras de programação em conjunto com a API

- Utilize o `Axios` para enviar requisições para a API.
- Tudo relacionado à API deve estar na pasta `raiz/src/services/api/`.
- Cada modelo existente na API deve ter um arquivo de serviço correspondente na pasta `raiz/src/services/api/`, que deve conter funções para cada endpoint relacionado a esse modelo.
- Os modelos devem estar atualizados e espelhados com os dados presentes em `raiz/.claude/memory/api.md`.
- Campos que são claramente um Enum na API devem se tornar um Enum nesta aplicação também.
