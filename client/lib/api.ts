import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'user_id';

// Token management
export const tokenStorage = {
    getAccessToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    setAccessToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },
    getRefreshToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },
    setRefreshToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },
    getUserId: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(USER_ID_KEY);
    },
    setUserId: (userId: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USER_ID_KEY, userId);
    },
    clear: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
    },
};

// Create axios instance
export const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add access token
api.interceptors.request.use(
    (config) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = tokenStorage.getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // Try to refresh
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                tokenStorage.setAccessToken(accessToken);

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                tokenStorage.clear();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API types
export interface RegisterRequest {
    email: string;
    password: string;
    tenantName: string;
    tenantSlug: string;
}

export interface RegisterResponse {
    userId: string;
    tenantId: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface Tenant {
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
}

export interface LoginResponse {
    user: {
        id: string;
        email: string;
    };
    tenants: Tenant[];
}

export interface SelectTenantRequest {
    tenantId: string;
}

export interface SelectTenantResponse {
    accessToken: string;
    refreshToken: string;
    roles: string[];
    permissions: string[];
}

export interface RefreshRequest {
    refreshToken: string;
}

export interface RefreshResponse {
    accessToken: string;
}

export interface User {
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    tenantName: string;
    tenantSlug: string;
    tenantId: string;
    roles: string[];
    permissions: string[];
}

export interface InviteUserRequest {
    email: string;
    roleId?: string;
}

export interface InviteUserResponse {
    userId: string;
    email: string;
    membershipId: string;
    status: string;
}

export interface TenantUser {
    membershipId: string;
    userId: string;
    email: string;
    isActive: boolean;
    status: string;
    roles: Array<{
        id: string;
        name: string;
        description: string | null;
    }>;
    createdAt: string;
}

export interface Invitation {
    membershipId: string;
    tenantId: string;
    tenantName: string;
    tenantSlug: string;
    roles: Array<{
        id: string;
        name: string;
        description: string | null;
    }>;
    createdAt: string;
}

export interface RespondInviteRequest {
    membershipId: string;
}

// API functions
export const authApi = {
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    selectTenant: async (
        userId: string,
        data: SelectTenantRequest
    ): Promise<SelectTenantResponse> => {
        const response = await api.post<SelectTenantResponse>(
            '/auth/select-tenant',
            data,
            {
                headers: {
                    'x-user-id': userId,
                },
            }
        );
        return response.data;
    },

    refresh: async (data: RefreshRequest): Promise<RefreshResponse> => {
        const response = await api.post<RefreshResponse>('/auth/refresh', data);
        return response.data;
    },

    logout: async (tenantId: string): Promise<void> => {
        await api.post('/auth/logout', { tenantId });
        tokenStorage.clear();
    },

    me: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    inviteUser: async (data: InviteUserRequest): Promise<InviteUserResponse> => {
        const response = await api.post<InviteUserResponse>('/auth/invite-user', data);
        return response.data;
    },

    listTenantUsers: async (): Promise<TenantUser[]> => {
        const response = await api.get<TenantUser[]>('/auth/tenant-users');
        return response.data;
    },

    getInvitations: async (): Promise<Invitation[]> => {
        const response = await api.get<Invitation[]>('/auth/invitations');
        return response.data;
    },

    acceptInvitation: async (data: RespondInviteRequest): Promise<{ success: boolean; tenantId: string; tenantName: string }> => {
        const response = await api.post<{ success: boolean; tenantId: string; tenantName: string }>('/auth/accept-invitation', data);
        return response.data;
    },

    declineInvitation: async (data: RespondInviteRequest): Promise<{ success: boolean }> => {
        const response = await api.post<{ success: boolean }>('/auth/decline-invitation', data);
        return response.data;
    },
};

export interface Role {
    id: string;
    name: string;
    description: string | null;
    isSystem: boolean;
    tenantId: string;
    grants?: Array<{
        permission: {
            id: string;
            key: string;
            description: string | null;
        };
    }>;
}

export const rolesApi = {
    list: async (): Promise<Role[]> => {
        const response = await api.get<Role[]>('/roles');
        return response.data;
    },
};
