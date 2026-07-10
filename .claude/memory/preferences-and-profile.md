# Perfil e preferências (resumo)

Implementado na `0.9.0.0`. Fonte: `versions/20260709200000_0.9.0.0.md`.

## Usuário é somente-leitura

Não há endpoint de escrita do usuário (`nome`/`email`/`picture` vêm do Google). `ProfileDialog` só
exibe. O editável são as **preferências**.

## Preferências

- API: `GET/PUT /users/me/preferences`. `UserPreferencesResponse = { theme, language,
translate_content, ai_personality }`. Enums: `theme` `light|dark`; `language` `pt|en|es|fr|de|it`
  (idioma de **tradução de conteúdo**, NÃO o idioma da UI); `ai_personality` `fun|mixed|informative`.
- Tipos/enums em `types/preferences.ts` (objetos `as const`). `UsersService.getPreferences/
updatePreferences`. Hooks em `hooks/usePreferences.ts` (`usePreferences` query `['preferences']`
  gated por `isAuthenticated`; `useUpdatePreferences` mutation).
- `PUT` re-emite o **access_token** (prefs vivem no JWT) → `SessionContext.updateAccessToken(token)`
  troca só o token em memória (a mutation chama no `onSuccess`, + `setQueryData(['preferences'])`).
- UI: `components/user/ProfileDialog` + `PreferencesDialog` (form RHF + `z.enum` sobre os enums;
  selects via `TextField select`, switch para `translate_content`). Abertos pelo `UserMenu`
  ("Perfil" / "Preferências" — este renomeado de "Configurações", ícone `TuneOutlined`).

## Reconciliação de tema (backend = fonte da verdade)

- `hooks/useThemeSync.ts` aplica `preferences.theme` via `useColorScheme().setMode`; chamado em
  `App.AppContent`. O MUI mantém o último modo em localStorage → sem flash no boot.
- `ThemeToggle` aplica na hora (`setMode`) **e** persiste (`updatePreferences({ ...prefs, theme })`)
  quando as prefs já carregaram. Medido: 1 clique = 1 PUT (sem duplo disparo).
- O switcher PT/EN da UI (i18n) continua client-side, **separado** do `language` do backend.

## Gotchas

- `Stack` do MUI nesta versão reclama de `alignItems` como prop direta → usar `sx={{ alignItems }}`.
- Warning MUI "popover too tall" nos testes = artefato do viewport 0 do preview do harness, não bug.
- Verificação mexe em dados reais do usuário dev — capturar prefs originais e **restaurar** ao final.
