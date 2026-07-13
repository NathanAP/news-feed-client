import { lazy, Suspense } from 'react'

const ReorderFeedsDialog = lazy(() =>
    import('./ReorderFeedsDialog').then((m) => ({
        default: m.ReorderFeedsDialog,
    })),
)

interface LazyReorderFeedsDialogProps {
    open: boolean
    onClose: () => void
}

// Defers the reorder dialog chunk (@dnd-kit) until opened. Only renders while
// open, so the drag-and-drop dependency isn't in the initial bundle.
export function LazyReorderFeedsDialog(props: LazyReorderFeedsDialogProps) {
    if (!props.open) {
        return null
    }

    return (
        <Suspense fallback={null}>
            <ReorderFeedsDialog {...props} />
        </Suspense>
    )
}
