# Perfil e preferências (resumo)

Implementado na `0.9.0.0`; **preferências reformadas na `0.12.0.0`** (backend mudou o contrato).
Fonte: `versions/20260709200000_0.9.0.0.md` e `versions/..._0.12.0.0.md`.

## Usuário é somente-leitura

Não há endpoint de escrita do usuário (`nome`/`email`/`picture` vêm do Google). `ProfileDialog` só
exibe. O editável são as **preferências**.

## Preferências (contrato novo, 0.12)

- API: `GET/PUT /users/me/preferences`. `UserPreferencesResponse = { language_to_translate?,
ai_personality }`. **`theme` saiu da API** (agora é client-only) e o antigo `language` +
  `translate_content` viraram **um único `language_to_translate` anulável** (`null` = tradução off).
  Enums: `language_to_translate` `pt|en|es|fr|de|it` (ou `null`); `ai_personality`
  `fun|mixed|informative`.
- Tipos em `types/preferences.ts` (`Language`/`AiPersonality` como `as const`;
  `UserPreferences = { languageToTranslate: Language | null, aiPersonality }`). `UsersService.
getPreferences/updatePreferences`. Hooks em `hooks/usePreferences.ts` (`usePreferences` query
  `['preferences']` gated por `isAuthenticated`; `useUpdatePreferences` mutation).
- `PUT` re-emite o **access_token** (prefs vivem no JWT) → `SessionContext.updateAccessToken(token)`
  troca só o token em memória (a mutation chama no `onSuccess`, + `setQueryData(['preferences'])`).
- UI: `components/user/ProfileDialog` (read-only) + `PreferencesDialog` (form RHF + zod). O
  `PreferencesDialog` tem: **idioma da interface** (i18next, client-only, aplica na hora — NÃO é do
  form nem do backend); **idioma de tradução** (select com "Desativado" → `null`, via sentinela
  **`'off'`** — o Select do MUI trata `''` como "sem seleção" e não mostra o rótulo, por isso a
  sentinela é não-vazia); e **`ai_personality`**. Abertos pelo `UserMenu` ("Perfil"/"Preferências",
  ícone `TuneOutlined`). O switcher PT/EN saiu do `UserMenu` e virou o "idioma da interface" do
  diálogo (0.12).

## Tema é client-only (0.12)

- O tema (dark/light) **não é mais preferência do backend**. É gerido só pelo `useColorScheme` do
  MUI, que persiste o modo em localStorage sozinho. O `ThemeToggle` só faz `setMode` — **sem `PUT`**.
- Removidos na 0.12: `hooks/useThemeSync.ts` e o acoplamento do `ThemeToggle`/boot com o backend
  (que existiam na 0.9, quando o tema era do backend).

## Gotchas

- `Stack` do MUI nesta versão reclama de `alignItems` como prop direta → usar `sx={{ alignItems }}`.
- Verificação mexe em dados reais do usuário dev — capturar prefs originais e **restaurar** ao final.
- `language_to_translate` nulo = tradução desativada (não existe mais um booleano separado).
