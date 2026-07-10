import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { pt, enUS } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import { useCurrentUser } from '../../hooks/useCurrentUser'

function getDateFnsLocale(language: string): Locale {
    return language.startsWith('pt') ? pt : enUS
}

// Read-only profile view. The user's name/email/picture come from Google and
// have no update endpoint, so nothing here is editable.
export function ProfileDialog({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const { t, i18n } = useTranslation()
    const { data: user } = useCurrentUser()

    const memberSince =
        user !== undefined
            ? format(new Date(user.createdAt), 'dd MMM yyyy', {
                  locale: getDateFnsLocale(i18n.language),
              })
            : ''

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{t('profile.title')}</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ alignItems: 'center', py: 1 }}>
                    <Avatar
                        src={user?.picture ?? undefined}
                        slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                        sx={{ width: 72, height: 72 }}
                    >
                        {user?.name?.charAt(0) ?? ''}
                    </Avatar>
                    <Box sx={{ textAlign: 'center', minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{ overflowWrap: 'anywhere' }}
                        >
                            {user?.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ overflowWrap: 'anywhere' }}
                        >
                            {user?.email}
                        </Typography>
                    </Box>
                    {user !== undefined && (
                        <Typography variant="caption" color="text.secondary">
                            {t('profile.memberSince', { date: memberSince })}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('common.close')}</Button>
            </DialogActions>
        </Dialog>
    )
}
