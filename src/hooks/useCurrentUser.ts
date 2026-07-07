import { useQuery } from '@tanstack/react-query'
import { usersService } from '../services/api'
import type { User } from '../types/user'

export function useCurrentUser() {
    return useQuery<User>({
        queryKey: ['currentUser'],
        queryFn: () => usersService.getMe(),
    })
}
