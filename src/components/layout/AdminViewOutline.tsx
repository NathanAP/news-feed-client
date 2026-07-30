import Box from '@mui/material/Box'
import { useAdminView } from '../../hooks/useAdminView'

// Persistent frame around the viewport while the administrator view is on. The
// toggle icon alone is easy to miss, and this mode changes what destructive
// actions are reachable — so the state deserves to be visible at all times,
// not only when the header is in sight.
//
// Fixed and pointer-events-none so it never intercepts a click, and above the
// dialog layer so it stays visible while a form or confirmation is open.
export function AdminViewOutline() {
    const { isAdminView } = useAdminView()

    if (!isAdminView) {
        return null
    }

    return (
        <Box
            // Decorative: the mode is already announced by the toggle's label.
            aria-hidden
            sx={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                border: 2,
                borderColor: 'admin.main',
                zIndex: (theme) => theme.zIndex.tooltip,
            }}
        />
    )
}
