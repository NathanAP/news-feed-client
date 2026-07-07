import { Outlet } from 'react-router-dom'

// App shell. The real layout (MUI, header, theme toggle) arrives in 0.4.
export function RootLayout() {
    return <Outlet />
}
