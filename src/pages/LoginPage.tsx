import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import GoogleIcon from '@mui/icons-material/Google'
import { useTranslation } from 'react-i18next'
import { authService } from '../services/api'

export function LoginPage() {
    const { t } = useTranslation()

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
        </Box>
    )
}
