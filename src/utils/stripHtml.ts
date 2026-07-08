// Plain-text preview of API-provided HTML content, for compact contexts (list
// cards) that don't render markup. The full detail page renders the sanitized
// HTML directly instead.
export function stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent ?? ''
}
