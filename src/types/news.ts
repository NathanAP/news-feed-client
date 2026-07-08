// View-model consumed by the news card. In 0.5 this is built by mapping the
// API's ArticleResponse (+ its source) into display-ready fields.
export interface NewsCardItem {
    id: string
    title: string
    body: string
    // Minutes elapsed since publication; the card localizes this into a
    // "time ago" label via Intl.RelativeTimeFormat, reacting to language changes.
    minutesAgo: number
    createdAtLabel: string
    sourceName: string
    isRead: boolean
}
