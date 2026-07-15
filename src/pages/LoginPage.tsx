import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import GoogleIcon from '@mui/icons-material/Google'
import TerminalIcon from '@mui/icons-material/Terminal'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/api'
import { useSession } from '../hooks/useSession'
import { DEV_LOGIN_ENABLED } from '../config/env'
import { brandGold } from '../theme/theme'
import { Logo } from '../components/Logo'

// The three value props shown on the landing hero. Copy lives in i18n; each
// entry maps an icon to its `landing.features.<key>` translation subtree.
const FEATURES: ReadonlyArray<{ key: string; icon: SvgIconComponent }> = [
    { key: 'personalized', icon: TuneRoundedIcon },
    { key: 'adFree', icon: BlockRoundedIcon },
    { key: 'timeline', icon: AccessTimeRoundedIcon },
]

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
                position: 'relative',
                minHeight: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: { xs: 2, sm: 4 },
                py: { xs: 6, md: 4 },
                overflow: 'hidden',
                bgcolor: 'background.default',
            }}
        >
            {/* Decorative brand-gold glow behind the content. */}
            <Box
                aria-hidden
                sx={(theme) => ({
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background: `radial-gradient(70% 55% at 50% -5%, ${alpha(
                        brandGold.light,
                        0.16,
                    )}, transparent 70%)`,
                    ...theme.applyStyles('dark', {
                        background: `radial-gradient(70% 55% at 50% -5%, ${alpha(
                            brandGold.dark,
                            0.18,
                        )}, transparent 70%)`,
                    }),
                })}
            />

            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 960,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: { xs: 5, md: 8 },
                }}
            >
                {/* Story / brand side */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                            alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                        }}
                    >
                        <Box sx={{ display: 'flex', color: 'brand.main' }}>
                            <Logo size={44} />
                        </Box>
                        <Typography
                            variant="h4"
                            component="span"
                            sx={{ fontWeight: 700, color: 'brand.main' }}
                        >
                            {t('app.name')}
                        </Typography>
                    </Stack>

                    <Typography
                        variant="h5"
                        component="h1"
                        sx={{ fontWeight: 600, mt: 3 }}
                    >
                        {t('app.tagline')}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            mt: 1.5,
                            maxWidth: 460,
                            mx: { xs: 'auto', md: 0 },
                        }}
                    >
                        {t('landing.description')}
                    </Typography>

                    <Stack spacing={2.5} sx={{ mt: 4 }}>
                        {FEATURES.map(({ key, icon: Icon }) => (
                            <Stack
                                key={key}
                                direction="row"
                                spacing={2}
                                sx={{
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    maxWidth: 460,
                                    mx: { xs: 'auto', md: 0 },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexShrink: 0,
                                        width: 40,
                                        height: 40,
                                        borderRadius: 2,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'brand.main',
                                        bgcolor: 'action.hover',
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {t(`landing.features.${key}.title`)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {t(`landing.features.${key}.body`)}
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                {/* Sign-in side */}
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: { xs: 400, md: 360 },
                        p: { xs: 3, sm: 4 },
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 3,
                    }}
                >
                    <Stack spacing={2.5} sx={{ alignItems: 'stretch' }}>
                        <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, textAlign: 'center' }}
                        >
                            {t('landing.signInHint')}
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<GoogleIcon />}
                            onClick={() => {
                                window.location.href =
                                    authService.getGoogleLoginUrl()
                            }}
                        >
                            {t('auth.signInWithGoogle')}
                        </Button>

                        {DEV_LOGIN_ENABLED && (
                            <Stack spacing={1} sx={{ alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
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
                            </Stack>
                        )}
                    </Stack>
                </Paper>
            </Box>
        </Box>
    )
}
