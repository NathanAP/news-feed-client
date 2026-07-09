import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// Callbacks the session layer registers so the client can read the current
// token, refresh it, and react to session expiry / maintenance — without the
// client importing React (avoids a circular dependency).
export interface AuthHandlers {
    getAccessToken: () => string | null
    refreshAccessToken: () => Promise<string | null>
    onSessionExpired: () => void
    onMaintenance: () => void
}

interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

// Base HTTP client wrapping a single Axios instance and the shared interceptors
// (Bearer injection, refresh-on-401, maintenance-on-503). Model services build
// on top of this.
export class ApiClient {
    private readonly instance: AxiosInstance
    private handlers: AuthHandlers | null = null
    private refreshPromise: Promise<string | null> | null = null

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers: { 'Content-Type': 'application/json' },
        })
        this.setupInterceptors()
    }

    setAuthHandlers(handlers: AuthHandlers): void {
        this.handlers = handlers
    }

    async get<T>(url: string): Promise<T> {
        const response = await this.instance.get<T>(url)
        return response.data
    }

    async post<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.instance.post<T>(url, body)
        return response.data
    }

    async put<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.instance.put<T>(url, body)
        return response.data
    }

    async delete<T>(url: string): Promise<T> {
        const response = await this.instance.delete<T>(url)
        return response.data
    }

    private setupInterceptors(): void {
        this.instance.interceptors.request.use((config) => {
            const token = this.handlers?.getAccessToken() ?? null
            if (token !== null) {
                config.headers.set('Authorization', `Bearer ${token}`)
            }
            return config
        })

        this.instance.interceptors.response.use(
            (response) => response,
            (error: unknown) => this.handleResponseError(error),
        )
    }

    private async handleResponseError(error: unknown): Promise<unknown> {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error)
        }

        const status = error.response?.status

        if (status === 503) {
            this.handlers?.onMaintenance()
            return Promise.reject(error)
        }

        const original = error.config as RetryableConfig | undefined
        if (
            status === 401 &&
            original !== undefined &&
            original._retry !== true &&
            this.handlers !== null
        ) {
            original._retry = true
            const newToken = await this.refreshOnce()
            if (newToken !== null) {
                original.headers.set('Authorization', `Bearer ${newToken}`)
                return this.instance(original)
            }
            this.handlers.onSessionExpired()
        }

        return Promise.reject(error)
    }

    // Single-flight refresh: concurrent 401s share one refresh call.
    private refreshOnce(): Promise<string | null> {
        if (this.refreshPromise === null) {
            const handlers = this.handlers
            const run =
                handlers !== null
                    ? handlers.refreshAccessToken()
                    : Promise.resolve<string | null>(null)
            this.refreshPromise = run.finally(() => {
                this.refreshPromise = null
            })
        }
        return this.refreshPromise
    }
}
