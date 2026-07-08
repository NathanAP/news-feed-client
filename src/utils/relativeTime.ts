import type { TFunction } from 'i18next'

// Abbreviated "time ago" label (e.g. "12 min ago" / "há 12 min"), built from
// i18n keys (not Intl's short style) for exact control over the abbreviation.
export function formatRelativeTime(createdAt: Date, t: TFunction): string {
    const diffMinutes = Math.abs(
        Math.round((Date.now() - createdAt.getTime()) / 60000),
    )

    if (diffMinutes < 60) {
        return t('feed.timeAgo.minutes', { count: diffMinutes })
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (diffHours < 24) {
        return t('feed.timeAgo.hours', { count: diffHours })
    }

    const diffDays = Math.round(diffHours / 24)
    return t('feed.timeAgo.days', { count: diffDays })
}
