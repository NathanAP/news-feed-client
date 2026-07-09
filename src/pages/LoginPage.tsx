import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import GoogleIcon from '@mui/icons-material/Google'
import TerminalIcon from '@mui/icons-material/Terminal'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/api'
import { useSession } from '../hooks/useSession'
import { DEV_LOGIN_ENABLED } from '../config/env'

export function LoginPage() {
    const { t } = useTranslation()
    const { login } = useSession()

    const devLoginMutation = useMutation({
        mutationFn: () => authService.devLogin(),
        onSuccess: (tokens) => login(tokens),
    })

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                bgcolor: 'background.default',
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {t('app.name')}
            </Typography>
            <Button
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={() => {
                    window.location.href = authService.getGoogleLoginUrl()
                }}
            >
                {t('auth.signInWithGoogle')}
            </Button>
            {DEV_LOGIN_ENABLED && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<TerminalIcon />}
                        loading={devLoginMutation.isPending}
                        onClick={() => devLoginMutation.mutate()}
                    >
                        {t('auth.signInAsDev')}
                    </Button>
                    {devLoginMutation.isError && (
                        <Typography variant="caption" color="error">
                            {t('auth.devLoginFailed')}
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    )
}
