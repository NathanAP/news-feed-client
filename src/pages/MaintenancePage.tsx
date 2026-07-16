import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '../components/PageTitle'

export function MaintenancePage() {
    const { t } = useTranslation()

    return (
        <Box
            sx={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                px: 3,
                textAlign: 'center',
                bgcolor: 'background.default',
            }}
        >
            <PageTitle screen={t('maintenance.title')} />
            <Typography variant="h6">{t('maintenance.title')}</Typography>
            <Typography variant="body2" color="text.secondary">
                {t('maintenance.body')}
            </Typography>
        </Box>
    )
}
