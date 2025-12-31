import { apiClient } from './client'

export interface TenantCreate {
    name: string
    whatsapp_phone_number_id: string
    whatsapp_access_token: string
    webhook_verify_token?: string
    google_calendar_id?: string
    google_service_account_json?: string
}

export interface TenantUpdate {
    name?: string
    whatsapp_access_token?: string
    webhook_verify_token?: string
    google_calendar_id?: string
    google_service_account_json?: string
}

export interface Tenant {
    id: number
    user_id: string
    name: string
    whatsapp_phone_number_id: string
    whatsapp_access_token: string
    webhook_verify_token: string | null
    google_calendar_id: string | null
    created_at: string
}

export const tenantsApi = {
    // Create a new tenant
    create: async (data: TenantCreate): Promise<Tenant> => {
        const response = await apiClient.post('/tenants/', data)
        return response.data
    },

    // Get current user's tenant
    getMyTenant: async (): Promise<Tenant> => {
        const response = await apiClient.get('/tenants/me')
        return response.data
    },

    // Update current user's tenant
    update: async (data: TenantUpdate): Promise<Tenant> => {
        const response = await apiClient.patch('/tenants/me', data)
        return response.data
    },
}
