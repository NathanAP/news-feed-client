import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { MIN_KEYWORDS, MAX_KEYWORDS } from './keywords'

// The tips, in the order they're shown. Copy lives in i18n under
// `keywordsGuide.tips.<key>`. Each one mirrors a real rule of the backend's
// article judgement (see memory/api-integration.md), not generic advice:
//   english   — article keywords are canonical English and are never translated,
//               so a Portuguese keyword simply never matches.
//   quantity  — more keywords, wider reach (the feed takes 5..20).
//   notAlone  — an article matching a single keyword is discarded, so keywords
//               that co-occur are what actually pull articles in.
//   mix       — layer 1 matches exact terms, and articles get both specific and
//               generic ones; mixing both balances empty vs flooded.
//   fromNow   — judgement only happens at discovery, so it isn't retroactive.
const TIP_KEYS = ['english', 'quantity', 'notAlone', 'mix', 'fromNow'] as const

// Content-only, didactic explanation of how to pick feed keywords. Kept apart
// from the form so it can be surfaced elsewhere (e.g. the tutorial) unchanged.
export function KeywordsGuide() {
    const { t } = useTranslation()

    return (
        <Stack spacing={1.5}>
            {TIP_KEYS.map((key) => (
                <Box key={key}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t(`keywordsGuide.tips.${key}.title`)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t(`keywordsGuide.tips.${key}.body`, {
                            min: MIN_KEYWORDS,
                            max: MAX_KEYWORDS,
                        })}
                    </Typography>
                </Box>
            ))}
        </Stack>
    )
}
