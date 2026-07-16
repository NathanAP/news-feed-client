// Where the tutorial is being shown from. Both variants render the same steps;
// only the framing (title and dismiss label) differs.
//
// Lives in its own module (not in TutorialDialog.tsx) because a component file
// must not also export runtime values — see rules/performance.md.
export const TutorialVariant = {
    // Opened on purpose from the "Help" menu entry.
    Help: 'help',
    // Shown automatically on the first visit on this device.
    Welcome: 'welcome',
} as const

export type TutorialVariant =
    (typeof TutorialVariant)[keyof typeof TutorialVariant]
