import { API_URL } from '../../config/env'
import { ApiClient } from './ApiClient'
import { AuthService } from './AuthService'
import { UsersService } from './UsersService'
import { FeedsService } from './FeedsService'
import { ArticlesService } from './ArticlesService'
import { SourcesService } from './SourcesService'

// Shared singletons wired together once for the whole app.
export const apiClient = new ApiClient(API_URL)
export const authService = new AuthService(apiClient)
export const usersService = new UsersService(apiClient)
export const feedsService = new FeedsService(apiClient)
export const articlesService = new ArticlesService(apiClient)
export const sourcesService = new SourcesService(apiClient)
