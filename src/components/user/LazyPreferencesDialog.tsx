import { lazy, Suspense } from 'react'

const PreferencesDialog = lazy(() =>
    import('./PreferencesDialog').then((m) => ({
        default: m.PreferencesDialog,
    })),
)

interface LazyPreferencesDialogProps {
    open: boolean
    onClose: () => void
}

// Defers the preferences form chunk (react-hook-form + zod) until opened.
// React.lazy caches the module, so reopening stays instant (the close transition
// is skipped — an acceptable trade for the deferred chunk).
export function LazyPreferencesDialog(props: LazyPreferencesDialogProps) {
    if (!props.open) {
        return null
    }

    return (
        <Suspense fallback={null}>
            <PreferencesDialog {...props} />
        </Suspense>
    )
}
