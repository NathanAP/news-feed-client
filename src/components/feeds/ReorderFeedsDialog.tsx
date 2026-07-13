import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useTranslation } from 'react-i18next'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    sortableKeyboardCoordinates,
    arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useOrderedFeeds, useFeedOrder } from '../../hooks/useOrderedFeeds'
import type { Feed } from '../../types/feed'

function SortableFeedRow({ feed }: { feed: Feed }) {
    const { t } = useTranslation()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: feed.id })

    return (
        <ListItem
            ref={setNodeRef}
            disablePadding
            sx={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.5 : 1,
                py: 1,
                px: 1,
                borderRadius: 1,
                bgcolor: 'action.hover',
                mb: 0.5,
            }}
        >
            <ListItemIcon
                {...attributes}
                {...listeners}
                aria-label={t('reorderFeeds.dragHandle', { name: feed.name })}
                sx={{ minWidth: 36, cursor: 'grab', touchAction: 'none' }}
            >
                <DragIndicatorIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
                primary={feed.name}
                slotProps={{ primary: { noWrap: true } }}
            />
        </ListItem>
    )
}

export function ReorderFeedsDialog({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) {
    const { t } = useTranslation()
    const { data: feeds } = useOrderedFeeds()
    const { setOrder } = useFeedOrder()
    // The dialog mounts fresh on open (lazy wrapper), so local order starts from
    // the current tab order.
    const [items, setItems] = useState<Feed[]>(() => feeds ?? [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over === null || active.id === over.id) {
            return
        }
        setItems((current) => {
            const from = current.findIndex((feed) => feed.id === active.id)
            const to = current.findIndex((feed) => feed.id === over.id)
            return arrayMove(current, from, to)
        })
    }

    const handleSave = () => {
        setOrder(items.map((feed) => feed.id))
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>{t('reorderFeeds.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 1.5 }}>
                    {t('reorderFeeds.hint')}
                </DialogContentText>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map((feed) => feed.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <List disablePadding>
                            {items.map((feed) => (
                                <SortableFeedRow key={feed.id} feed={feed} />
                            ))}
                        </List>
                    </SortableContext>
                </DndContext>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    {t('common.cancel')}
                </Button>
                <Button onClick={handleSave} variant="contained">
                    {t('common.save')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
