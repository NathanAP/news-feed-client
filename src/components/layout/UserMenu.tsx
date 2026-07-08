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
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { useTranslation } from 'react-i18next'
import { useSession } from '../../hooks/useSession'
import { useCurrentUser } from '../../hooks/useCurrentUser'

export function UserMenu() {
    const { t, i18n } = useTranslation()
    const { logout } = useSession()
    const { data: user } = useCurrentUser()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

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
                <MenuItem onClick={close}>
                    <ListItemIcon>
                        <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('menu.profile')}</ListItemText>
                </MenuItem>
                <MenuItem onClick={close}>
                    <ListItemIcon>
                        <SettingsOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t('menu.settings')}</ListItemText>
                </MenuItem>
                <Divider />
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', px: 2, py: 0.5 }}
                >
                    {t('menu.language')}
                </Typography>
                <MenuItem
                    selected={i18n.resolvedLanguage === 'pt'}
                    onClick={() => {
                        void i18n.changeLanguage('pt')
                        close()
                    }}
                >
                    <ListItemText inset>Português</ListItemText>
                </MenuItem>
                <MenuItem
                    selected={i18n.resolvedLanguage === 'en'}
                    onClick={() => {
                        void i18n.changeLanguage('en')
                        close()
                    }}
                >
                    <ListItemText inset>English</ListItemText>
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
        </>
    )
}
