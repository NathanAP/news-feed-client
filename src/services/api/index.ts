import { API_URL } from '../../config/env'
import { ApiClient } from './ApiClient'
import { AuthService } from './AuthService'
import { UsersService } from './UsersService'

// Shared singletons wired together once for the whole app.
export const apiClient = new ApiClient(API_URL)
export const authService = new AuthService(apiClient)
export const usersService = new UsersService(apiClient)
