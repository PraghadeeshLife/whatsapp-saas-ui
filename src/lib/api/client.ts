import axios from 'axios'
import { supabase } from '@/lib/supabase/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance with base configuration
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - could redirect to login
            console.error('Unauthorized - please log in')
        }
        return Promise.reject(error)
    }
)
