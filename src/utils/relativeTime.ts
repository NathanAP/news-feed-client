// Localized "time ago" label (e.g. "12 minutes ago" / "há 12 minutos"),
// driven by the current UI language so it updates when the user switches it.
export function formatRelativeMinutes(
    minutesAgo: number,
    locale: string,
): string {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    if (minutesAgo < 60) {
        return rtf.format(-minutesAgo, 'minute')
    }

    const hoursAgo = Math.round(minutesAgo / 60)
    if (hoursAgo < 24) {
        return rtf.format(-hoursAgo, 'hour')
    }

    const daysAgo = Math.round(hoursAgo / 24)
    return rtf.format(-daysAgo, 'day')
}
