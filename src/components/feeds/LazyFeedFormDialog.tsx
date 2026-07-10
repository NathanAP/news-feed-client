import { lazy, Suspense } from 'react'
import type { FeedFormDialogProps } from './FeedFormDialog'

const FeedFormDialog = lazy(() =>
    import('./FeedFormDialog').then((m) => ({ default: m.FeedFormDialog })),
)

// Defers the feed form chunk (react-hook-form + zod) until the dialog is opened.
// React.lazy caches the resolved module, so reopening stays instant. Drop-in
// replacement for FeedFormDialog (it only renders while open, so the close
// transition is skipped — an acceptable trade for the deferred chunk).
export function LazyFeedFormDialog(props: FeedFormDialogProps) {
    if (!props.open) {
        return null
    }

    return (
        <Suspense fallback={null}>
            <FeedFormDialog {...props} />
        </Suspense>
    )
}
