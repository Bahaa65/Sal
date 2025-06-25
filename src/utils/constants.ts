// Application constants
export const APP_NAME = 'Sal'
export const APP_DESCRIPTION = 'A Q&A platform for developers'

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 50

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

// Validation
export const MIN_PASSWORD_LENGTH = 6
export const MIN_USERNAME_LENGTH = 3
export const MAX_USERNAME_LENGTH = 30
export const MAX_BIO_LENGTH = 500

// UI
export const TOAST_DURATION = 3000
export const TOAST_POSITION = 'top-right' 