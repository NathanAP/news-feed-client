import { useTranslation } from 'react-i18next'

// Sets the browser tab title following the project convention (see PROJECT.md,
// "Abas para navegadores"): `{current screen} - ChronoFeed`.
//
// React 19 hoists a <title> rendered anywhere in the tree into <head>, so no
// metadata library (react-helmet & co.) is needed. The static <title> in
// index.html stays as the pre-boot fallback.
export function PageTitle({ screen }: { screen: string }) {
    const { t } = useTranslation()

    return <title>{`${screen} - ${t('app.name')}`}</title>
}
