import { lazy, Suspense } from 'react'
import type { TutorialDialogProps } from './TutorialDialog'

const TutorialDialog = lazy(() =>
    import('./TutorialDialog').then((m) => ({ default: m.TutorialDialog })),
)

// Defers the tutorial chunk (MUI Stepper) until it's actually opened. Matters
// most for the welcome variant, which is mounted by the always-eager AppLayout.
// Drop-in replacement for TutorialDialog; see LazyFeedFormDialog for the pattern.
export function LazyTutorialDialog(props: TutorialDialogProps) {
    if (!props.open) {
        return null
    }

    return (
        <Suspense fallback={null}>
            <TutorialDialog {...props} />
        </Suspense>
    )
}
