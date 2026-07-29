import { useEffect, useState } from 'react'

// Returns a debounced copy of `value` that only updates after `delay` ms have
// passed without a change. Used to throttle keystroke-driven queries (e.g.
// keyword suggestions) so a request goes out once the user pauses, not on every
// change.
export function useDebouncedValue<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
}
