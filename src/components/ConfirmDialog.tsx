import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

interface ConfirmDialogProps {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    // Marks the confirm action as destructive (red button).
    destructive?: boolean
    loading?: boolean
    onConfirm: () => void
    onClose: () => void
}

// Reusable confirmation dialog for irreversible or important actions.
export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel,
    destructive = false,
    loading = false,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    const { t } = useTranslation()

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} color="inherit">
                    {cancelLabel ?? t('common.cancel')}
                </Button>
                <Button
                    onClick={onConfirm}
                    loading={loading}
                    color={destructive ? 'error' : 'primary'}
                    variant="contained"
                >
                    {confirmLabel ?? t('common.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
