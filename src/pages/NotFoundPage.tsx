import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { PageTitle } from '../components/PageTitle'

export function NotFoundPage() {
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
            <PageTitle screen={t('notFound.title')} />
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
                404
            </Typography>
            <Typography variant="body1">{t('notFound.title')}</Typography>
            <Typography variant="body2" color="text.secondary">
                {t('notFound.body')}
            </Typography>
        </Box>
    )
}
