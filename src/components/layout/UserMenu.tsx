import { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../hooks/useSession'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { ProfileDialog } from '../user/ProfileDialog'
import { LazyPreferencesDialog } from '../user/LazyPreferencesDialog'
import { LazyTutorialDialog } from '../tutorial/LazyTutorialDialog'
import { TutorialVariant } from '../tutorial/tutorialVariant'

export function UserMenu() {
    const { t } = useTranslation()
    const { logout } = useSession()
    const { data: user } = useCurrentUser()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [profileOpen, setProfileOpen] = useState(false)
    const [preferencesOpen, setPreferencesOpen] = useState(false)
    const [helpOpen, setHelpOpen] = useState(false)

    const close = () => setAnchorEl(null)

    return (
        <>
            <IconButton
                onClick={(event) => setAnchorEl(event.currentTarget)}
                aria-label={t('menu.open')}
                size="small"
            >
                <Avatar
                    src={user?.picture ?? undefined}
                    slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                    sx={{ width: 34, height: 34 }}
                >
                    {user?.name?.charAt(0) ?? ''}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={anchorEl !== null}
                onClose={close}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {user !== undefined && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', px: 2, py: 1 }}
                    >
                        {user.name}
                    </Typography>
                )}
                <MenuItem
                    onClick={() => {
                        close()
                        setProfileOpen(true)
                    }}
                >
                    <ListItemIcon>
                        <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('menu.profile')}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        close()
                        setPreferencesOpen(true)
                    }}
                >
                    <ListItemIcon>
                        <TuneOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('menu.preferences')}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        close()
                        setHelpOpen(true)
                    }}
                >
                    <ListItemIcon>
                        <HelpOutlineOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('menu.help')}</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => {
                        close()
                        logout()
                    }}
                >
                    <ListItemIcon>
                        <LogoutOutlinedIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText sx={{ color: 'error.main' }}>
                        {t('menu.signOut')}
                    </ListItemText>
                </MenuItem>
            </Menu>

            <ProfileDialog
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
            />
            <LazyPreferencesDialog
                open={preferencesOpen}
                onClose={() => setPreferencesOpen(false)}
            />
            <LazyTutorialDialog
                open={helpOpen}
                onClose={() => setHelpOpen(false)}
                variant={TutorialVariant.Help}
            />
        </>
    )
}
