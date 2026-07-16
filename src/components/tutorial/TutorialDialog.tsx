import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { TutorialSteps } from './TutorialSteps'
import { TutorialVariant } from './tutorialVariant'

export interface TutorialDialogProps {
    open: boolean
    onClose: () => void
    variant: TutorialVariant
}

export function TutorialDialog({
    open,
    onClose,
    variant,
}: TutorialDialogProps) {
    const { t } = useTranslation()
    const isWelcome = variant === TutorialVariant.Welcome

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isWelcome ? t('tutorial.welcomeTitle') : t('tutorial.title')}
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
                <TutorialSteps />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    variant={isWelcome ? 'contained' : 'text'}
                >
                    {isWelcome ? t('tutorial.start') : t('common.close')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
