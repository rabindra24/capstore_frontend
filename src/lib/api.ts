import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await axios.post(`${API_URL}/api/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post("/auth/login", { email, password }),

    register: (name: string, email: string, password: string, role?: string) =>
        api.post("/auth/register", { name, email, password, role }),

    logout: (refreshToken: string) =>
        api.post("/auth/logout", { refreshToken }),
};

// Store API
export const storeAPI = {
    testConnection: (platform: string, credentials: any) =>
        api.post("/stores/test", { platform, credentials }),

    connectStore: (platform: string, name: string, storeUrl: string, credentials: any) =>
        api.post("/stores", { platform, name, storeUrl, credentials }),

    getAllStores: () => api.get("/stores"),

    updateStore: (id: string, updates: any) =>
        api.put(`/stores/${id}`, updates),

    disconnectStore: (id: string) => api.delete(`/stores/${id}`),

    syncStore: (id: string) => api.post(`/stores/${id}/sync`),
};

// Order API
export const orderAPI = {
    getAllOrders: (filters?: any) => api.get("/orders", { params: filters }),

    getOrderById: (id: string) => api.get(`/orders/${id}`),

    updateOrderStatus: (id: string, status: string) =>
        api.put(`/orders/${id}/status`, { status }),

    getRecentOrders: (limit?: number) =>
        api.get("/orders/recent", { params: { limit } }),
};

// Product/Inventory API
export const productAPI = {
    getAllProducts: (filters?: any) => api.get("/products", { params: filters }),

    getProductById: (id: string) => api.get(`/products/${id}`),

    updateProduct: (id: string, updates: any) =>
        api.put(`/products/${id}`, updates),

    getLowStockProducts: () => api.get("/products/inventory/low-stock"),

    updateInventoryStock: (id: string, stock: number, reason?: string) =>
        api.put(`/products/inventory/${id}`, { stock, reason }),
};

// Customer API
export const customerAPI = {
    getAllCustomers: (filters?: any) => api.get("/customers", { params: filters }),

    getCustomerById: (id: string) => api.get(`/customers/${id}`),

    getTopCustomers: (limit?: number) =>
        api.get("/customers/top", { params: { limit } }),
};

// Meeting API
export const meetingAPI = {
    getAllMeetings: (filters?: any) => api.get("/meetings", { params: filters }),

    createMeeting: (meetingData: any) => api.post("/meetings", meetingData),

    updateMeeting: (id: string, updates: any) =>
        api.put(`/meetings/${id}`, updates),

    cancelMeeting: (id: string) => api.delete(`/meetings/${id}`),

    sendInvitations: (id: string) => api.post(`/meetings/${id}/invitations`),

    updateResponse: (id: string, response: string) =>
        api.put(`/meetings/${id}/response`, { response }),
};

// AI API
export const aiAPI = {
    getInventorySuggestions: () => api.post("/ai/inventory-suggestions"),

    getSalesInsights: () => api.post("/ai/sales-insights"),

    getAnalyticsInsights: () => api.post("/ai/analytics-insights"),

    prioritizeTasks: () => api.post("/ai/task-prioritization"),
};

// Settings API
export const settingsAPI = {
    getSettings: () => api.get("/settings"),

    updateNotificationPreferences: (preferences: any) =>
        api.put("/settings/notifications", preferences),

    updateIntegrations: (integrations: any) =>
        api.put("/settings/integrations", integrations),

    updateApiKeys: (apiKeys: any) =>
        api.put("/settings/api-keys", apiKeys),

    getAllApiKeys: () => api.get("/settings/api-keys"),

    createApiKey: (apiKeyData: any) => api.post("/settings/api-keys", apiKeyData),

    updateApiKey: (id: string, updates: any) =>
        api.put(`/settings/api-keys/${id}`, updates),

    deleteApiKey: (id: string) => api.delete(`/settings/api-keys/${id}`),
};

// Analytics API
export const analyticsAPI = {
    getAnalytics: (filters?: any) => api.get("/analytics", { params: filters }),
};

// Employee API
export const employeeAPI = {
    getAllEmployees: () => api.get("/employees"),

    createEmployee: (employeeData: any) => api.post("/employees", employeeData),

    updateEmployee: (id: string, updates: any) =>
        api.put(`/employees/${id}`, updates),

    deleteEmployee: (id: string) => api.delete(`/employees/${id}`),

    // Assign task to employee
    assignTask: (employeeId: string, taskData: any) => {
        console.log("📤 API: Assigning task to employee", employeeId, taskData);
        return api.post(`/employees/assign/${employeeId}`, taskData);
    },

    getEmployeeTasks: (employeeId: string) =>
        api.get(`/employees/${employeeId}/tasks`),

    getEmployeeStats: (employeeId: string) =>
        api.get(`/employees/${employeeId}/stats`),

    getEmployeePerformance: (employeeId: string, days?: number) =>
        api.get(`/employees/${employeeId}/performance`, { params: { days } }),
};

// SMTP Settings API
export const smtpAPI = {
    getSettings: () => api.get("/settings/smtp"),

    updateSettings: (settings: any) => api.put("/settings/smtp", settings),

    testConnection: (settings: any) => api.post("/settings/smtp/test", settings),
};

// Business Settings API
export const businessAPI = {
    getSettings: () => api.get("/settings/business"),

    updateSettings: (settings: any) => api.put("/settings/business", settings),
};

export default api;


// Gemini AI API
export const geminiAI = {
    chatReply: (conversation: any[], tone?: string) =>
        api.post("/ai/chat-reply", { conversation, tone }),
    composeEmail: (context: any) =>
        api.post("/ai/compose-email", context),
    customerInsights: (customerData: any) =>
        api.post("/ai/customer-insights", customerData),
    orderSummary: (orderData: any) =>
        api.post("/ai/order-summary", orderData),
    improveText: (text: string, purpose?: string) =>
        api.post("/ai/improve-text", { text, purpose }),
};
