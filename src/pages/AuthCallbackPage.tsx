import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../hooks/useSession'
import { RoutePath } from '../routes/paths'
import type { AuthTokens } from '../types/auth'

type CallbackResult =
    | { status: 'success'; tokens: AuthTokens }
    | { status: 'error'; reason: string }

function parseTokensFromHash(hash: string): AuthTokens | null {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash
    const params = new URLSearchParams(raw)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const expiresIn = params.get('expires_in')

    if (accessToken === null || refreshToken === null) {
        return null
    }

    return {
        accessToken,
        refreshToken,
        expiresIn: expiresIn !== null ? Number(expiresIn) : 0,
    }
}

// Read the callback outcome once from the URL. Pure read (no side effects), so
// it can run in a useState initializer instead of an effect.
function readCallbackResult(): CallbackResult {
    const errorParam = new URLSearchParams(window.location.search).get('error')
    if (errorParam !== null) {
        return { status: 'error', reason: errorParam }
    }

    const tokens = parseTokensFromHash(window.location.hash)
    if (tokens === null) {
        return { status: 'error', reason: 'missing_tokens' }
    }

    return { status: 'success', tokens }
}

// Lands here after the backend redirects back from Google with tokens in the
// URL fragment (#access_token=...&refresh_token=...&expires_in=...).
export function AuthCallbackPage() {
    const navigate = useNavigate()
    const { login } = useSession()
    const [result] = useState(readCallbackResult)
    // StrictMode runs effects twice in dev; guard against double processing.
    const processed = useRef(false)

    useEffect(() => {
        if (processed.current || result.status !== 'success') {
            return
        }
        processed.current = true

        login(result.tokens)
        // Drop the fragment so tokens don't linger in the URL/history.
        window.history.replaceState(null, '', window.location.pathname)
        navigate(RoutePath.Home, { replace: true })
    }, [result, login, navigate])

    if (result.status === 'error') {
        return (
            <main>
                <h1>Login failed</h1>
                <p>{result.reason}</p>
                <a href={RoutePath.Login}>Back to login</a>
            </main>
        )
    }

    return <p>Signing you in…</p>
}
