import { apiClient } from './client'

export interface Message {
    id: number
    tenant_id: number
    sender_number: string
    recipient_number: string
    text: string
    direction: 'inbound' | 'outbound'
    status: string
    whatsapp_message_id: string | null
    created_at: string
}

export interface MessagesQuery {
    limit?: number
    offset?: number
    direction?: 'inbound' | 'outbound'
}

export const messagesApi = {
    // Get messages with optional filtering
    list: async (query?: MessagesQuery): Promise<Message[]> => {
        const response = await apiClient.get('/messages/', { params: query })
        return response.data
    },
}
