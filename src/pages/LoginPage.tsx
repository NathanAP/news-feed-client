import { authService } from '../services/api'

export function LoginPage() {
    const handleLogin = () => {
        window.location.href = authService.getGoogleLoginUrl()
    }

    // Raw button for now; real UI (MUI) and i18n arrive in 0.4.
    return (
        <main>
            <h1>news-feed-client</h1>
            <button type="button" onClick={handleLogin}>
                Sign in with Google
            </button>
        </main>
    )
}
