import { lazy, Suspense } from 'react'
import type { SourceFormDialogProps } from './SourceFormDialog'

const SourceFormDialog = lazy(() =>
    import('./SourceFormDialog').then((m) => ({ default: m.SourceFormDialog })),
)

// Defers the source form chunk (react-hook-form + zod) until the dialog opens,
// same contract as LazyFeedFormDialog: renders nothing while closed, so the
// chunk is only fetched on the first open.
export function LazySourceFormDialog(props: SourceFormDialogProps) {
    if (!props.open) {
        return null
    }

    return (
        <Suspense fallback={null}>
            <SourceFormDialog {...props} />
        </Suspense>
    )
}
