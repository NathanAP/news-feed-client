import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import { useTranslation } from 'react-i18next'
import { useDeleteSource } from '../../hooks/useSourceMutations'
import { LazySourceFormDialog } from './LazySourceFormDialog'
import { ConfirmDialog } from '../ConfirmDialog'
import type { Source } from '../../types/source'

export interface SourceActionsMenuProps {
    source: Source
    // Lets the page correct the pagination when the page is left empty.
    onDeleted: () => void
}

// Per-row edit/delete menu of the sources listing. Unlike feeds there is no
// "open" source, so the actions hang off each row instead of a header menu.
export function SourceActionsMenu({
    source,
    onDeleted,
}: SourceActionsMenuProps) {
    const { t } = useTranslation()
    const deleteSource = useDeleteSource()

    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleDelete = () => {
        deleteSource.mutate(source.id, {
            onSuccess: () => {
                setConfirmOpen(false)
                onDeleted()
            },
        })
    }

    return (
        <>
            <IconButton
                aria-label={t('admin.sources.manage', { name: source.name })}
                size="small"
                onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu
                anchorEl={menuAnchor}
                open={menuAnchor !== null}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={() => {
                        setEditOpen(true)
                        setMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <EditOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('admin.sources.edit')}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setConfirmOpen(true)
                        setMenuAnchor(null)
                    }}
                >
                    <ListItemIcon>
                        <DeleteOutlinedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>
                        {t('admin.sources.delete')}
                    </ListItemText>
                </MenuItem>
            </Menu>

            <LazySourceFormDialog
                open={editOpen}
                mode="edit"
                source={source}
                onClose={() => setEditOpen(false)}
            />

            <ConfirmDialog
                open={confirmOpen}
                title={t('admin.sources.deleteConfirm.title')}
                // The body spells out the cascade: deleting a source also
                // removes every article already collected from it.
                description={t('admin.sources.deleteConfirm.body', {
                    name: source.name,
                })}
                confirmLabel={t('admin.sources.delete')}
                destructive
                loading={deleteSource.isPending}
                onConfirm={handleDelete}
                onClose={() => setConfirmOpen(false)}
            />
        </>
    )
}
