import { useState } from 'react'

const STORAGE_KEY = 'nfc.tutorialSeen'

function readSeen(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true'
}

// Tracks whether the flow tutorial has already been shown, so the welcome modal
// only greets a first-time visitor.
//
// Persisted per-device in localStorage, like the feed order: the backend has no
// field for it, so the same user on a second device is greeted again. Acceptable
// for a one-off welcome; syncing it server-side is a future upgrade.
export function useTutorialSeen(): { seen: boolean; markSeen: () => void } {
    const [seen, setSeen] = useState(readSeen)

    const markSeen = () => {
        localStorage.setItem(STORAGE_KEY, 'true')
        setSeen(true)
    }

    return { seen, markSeen }
}
