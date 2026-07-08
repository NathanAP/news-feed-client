import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NewsCard } from './NewsCard'
import { placeholderNews } from '../../data/placeholderNews'

export function NewsList() {
    const { t } = useTranslation()

    return (
        <Box>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1.5, px: 0.5 }}
            >
                {t('feed.prefix')}: Tecnologia ·{' '}
                {t('feed.articles', { count: placeholderNews.length })}
            </Typography>
            {placeholderNews.map((item) => (
                <NewsCard key={item.id} item={item} />
            ))}
        </Box>
    )
}
