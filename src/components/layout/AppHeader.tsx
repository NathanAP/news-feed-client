import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Logo } from '../Logo'
import { FeedTabs } from './FeedTabs'
import { ThemeToggle } from './ThemeToggle'
import { UserMenu } from './UserMenu'

export function AppHeader() {
    const { t } = useTranslation()

    return (
        <AppBar
            position="sticky"
            elevation={0}
            color="transparent"
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                backdropFilter: 'blur(8px)',
            }}
        >
            <Toolbar sx={{ gap: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <Box
                        sx={(theme) => ({
                            display: 'flex',
                            color: '#141414',
                            ...theme.applyStyles('dark', { color: '#c8a04a' }),
                        })}
                    >
                        <Logo size={30} />
                    </Box>
                    <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{ fontWeight: 500 }}
                    >
                        {t('app.name')}
                    </Typography>
                </Box>

                <FeedTabs />

                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <ThemeToggle />
                    <UserMenu />
                </Box>
            </Toolbar>
        </AppBar>
    )
}
