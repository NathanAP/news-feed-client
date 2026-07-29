import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import { usersService } from '../services/api'
import { useSession } from './useSession'
import type { UserPreferences } from '../types/preferences'

const PREFERENCES_QUERY_KEY = ['preferences'] as const

export function usePreferences() {
    const { isAuthenticated } = useSession()
    return useQuery<UserPreferences>({
        queryKey: PREFERENCES_QUERY_KEY,
        queryFn: () => usersService.getPreferences(),
        enabled: isAuthenticated,
    })
}

// Updates preferences and swaps the re-issued access token (preferences live in
// the JWT). The fresh preferences are written straight into the query cache.
export function useUpdatePreferences() {
    const queryClient = useQueryClient()
    const { updateAccessToken } = useSession()
    const { enqueueSnackbar } = useSnackbar()
    const { t } = useTranslation()
    return useMutation({
        mutationFn: (input: UserPreferences) =>
            usersService.updatePreferences(input),
        onSuccess: (result) => {
            updateAccessToken(result.accessToken)
            queryClient.setQueryData(PREFERENCES_QUERY_KEY, result.preferences)
            enqueueSnackbar(t('preferences.saveSuccess'), {
                variant: 'success',
            })
        },
    })
}
