/**
 * Centralized configuration for environment variables
 * This ensures consistent usage across the application
 */

// Get the server URL from environment variables
// VITE_SERVER_URL is the primary variable, with VITE_API_URL as fallback
export const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// API base URL (adds /api to the server URL)
export const API_BASE_URL = `${SERVER_URL}/api`;

// WebSocket URL (converts http to ws, https to wss)
export const WS_URL = SERVER_URL.replace(/^http/, 'ws');

// Export for backward compatibility
export const API_URL = SERVER_URL;

export default {
    SERVER_URL,
    API_BASE_URL,
    WS_URL,
    API_URL,
};
