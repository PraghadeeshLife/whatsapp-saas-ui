import { apiClient } from './client'

export interface ResourceCreate {
    name: string
    description?: string
    external_id?: string
}

export interface ResourceUpdate {
    name?: string
    description?: string
    external_id?: string
}

export interface Resource {
    id: number
    tenant_id: number
    name: string
    description: string | null
    external_id: string | null
    created_at: string
}

export const resourcesApi = {
    // List all resources
    list: async (): Promise<Resource[]> => {
        const response = await apiClient.get('/resources/')
        return response.data
    },

    // Create a new resource
    create: async (data: ResourceCreate): Promise<Resource> => {
        const response = await apiClient.post('/resources/', data)
        return response.data
    },

    // Delete a resource
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/resources/${id}`)
    }
}
