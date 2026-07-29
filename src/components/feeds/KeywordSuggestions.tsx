import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { useKeywordSuggestions } from '../../hooks/useKeywordSuggestions'
import { MAX_KEYWORDS } from './keywords'

interface KeywordSuggestionsProps {
    // Keywords already picked in the form: they steer the query and are filtered
    // out of the suggestions shown.
    selected: string[]
    // Whether the host dialog is open — gates the query so it never runs closed.
    open: boolean
    disabled?: boolean
    onAdd: (keyword: string) => void
}

// A row of clickable chips suggesting keywords for the feed being built. Tapping
// a chip adds that keyword. Suggestions come from the backend and are labelled
// by strategy (related to the current picks, or popular overall). Hidden while
// the keyword limit is reached (nothing more can be added) or when there is
// nothing to suggest.
export function KeywordSuggestions({
    selected,
    open,
    disabled,
    onAdd,
}: KeywordSuggestionsProps) {
    const { t } = useTranslation()
    // No point querying/showing suggestions once the feed is at the keyword cap.
    const enabled = open && selected.length < MAX_KEYWORDS
    const { data } = useKeywordSuggestions(selected, enabled)

    // Defensive: the debounce means a just-added keyword can still be in a stale
    // response for a moment — never suggest one that's already picked.
    const suggestions = (data?.suggestions ?? []).filter(
        (item) => !selected.includes(item.keyword),
    )

    if (!enabled || suggestions.length === 0) {
        return null
    }

    const label =
        data?.strategy === 'related'
            ? t('feedForm.suggestions.related')
            : t('feedForm.suggestions.popular')

    return (
        <Box>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.75 }}
            >
                {label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {suggestions.map((item) => (
                    <Tooltip
                        key={item.keyword}
                        title={t('feedForm.suggestions.articleCount', {
                            count: item.count,
                        })}
                    >
                        <Chip
                            icon={<AddIcon />}
                            label={item.keyword}
                            size="small"
                            variant="outlined"
                            disabled={disabled}
                            onClick={() => onAdd(item.keyword)}
                        />
                    </Tooltip>
                ))}
            </Box>
        </Box>
    )
}
