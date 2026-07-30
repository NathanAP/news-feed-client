import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import { useTranslation } from 'react-i18next'
import { useAdminView } from '../../hooks/useAdminView'
import { AdminViewMode } from '../../hooks/adminViewStore'

// Lets an administrator switch between seeing the app as a regular user (the
// default) and seeing the administrator UI. Renders nothing for everyone else.
// Like the theme toggle, the icon shows the view it switches *to*.
export function AdminViewToggle() {
    const { t } = useTranslation()
    const { isAdmin, isAdminView, setMode } = useAdminView()

    if (!isAdmin) {
        return null
    }

    const label = isAdminView
        ? t('admin.viewToggle.toUser')
        : t('admin.viewToggle.toAdmin')

    return (
        <Tooltip title={label}>
            <IconButton
                onClick={() =>
                    setMode(
                        isAdminView ? AdminViewMode.User : AdminViewMode.Admin,
                    )
                }
                aria-label={label}
                size="small"
                // Tinted while the administrator view is on, so the mode is
                // readable at a glance and not only through the icon. Same token
                // as the viewport frame — indicator and switch speak one
                // language. Via `sx` because `color` only takes the built-in
                // palette slots without extra type augmentation.
                sx={{ color: isAdminView ? 'admin.main' : 'inherit' }}
            >
                {isAdminView ? (
                    <PersonOutlineIcon fontSize="small" />
                ) : (
                    <AdminPanelSettingsOutlinedIcon fontSize="small" />
                )}
            </IconButton>
        </Tooltip>
    )
}
