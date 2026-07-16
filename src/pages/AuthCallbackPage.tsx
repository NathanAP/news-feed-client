import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useSession } from '../hooks/useSession'
import { PageTitle } from '../components/PageTitle'
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

const centeredSx = {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    bgcolor: 'background.default',
} as const

export function AuthCallbackPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { login } = useSession()
    const [result] = useState(readCallbackResult)
    const processed = useRef(false)

    useEffect(() => {
        if (processed.current || result.status !== 'success') {
            return
        }
        processed.current = true

        login(result.tokens)
        window.history.replaceState(null, '', window.location.pathname)
        navigate(RoutePath.Feeds, { replace: true })
    }, [result, login, navigate])

    if (result.status === 'error') {
        return (
            <Box sx={centeredSx}>
                <PageTitle screen={t('titles.login')} />
                <Typography variant="h6">{t('auth.loginFailed')}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {result.reason}
                </Typography>
                <Button href={RoutePath.Landing}>
                    {t('auth.backToLogin')}
                </Button>
            </Box>
        )
    }

    return (
        <Box sx={centeredSx}>
            <PageTitle screen={t('titles.login')} />
            <Typography color="text.secondary">
                {t('auth.signingIn')}
            </Typography>
        </Box>
    )
}
