const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
  }) {
    return this.request<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      products: any[];
      pagination: any;
    }>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request<{ product: any }>(`/products/${id}`);
  }

  async addProductReview(productId: string, review: {
    rating: number;
    title?: string;
    comment?: string;
  }) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getProductReviews(productId: string, params?: {
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      reviews: any[];
      pagination: any;
    }>(`/products/${productId}/reviews${queryString ? `?${queryString}` : ''}`);
  }

  // Device endpoints
  async getDevices(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    isOnline?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      devices: any[];
      pagination: any;
    }>(`/devices${queryString ? `?${queryString}` : ''}`);
  }

  async getDevice(id: string) {
    return this.request<{ device: any }>(`/devices/${id}`);
  }

  async addDevice(deviceData: {
    name: string;
    type: string;
    location?: string;
    productId?: string;
  }) {
    return this.request<{ device: any }>('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDevice(id: string, deviceData: {
    name?: string;
    type?: string;
    location?: string;
    status?: string;
    battery?: number;
    tasks?: string;
  }) {
    return this.request<{ device: any }>(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  async deleteDevice(id: string) {
    return this.request(`/devices/${id}`, {
      method: 'DELETE',
    });
  }

  async controlDevice(id: string, action: string, parameters?: any) {
    return this.request<{ device: any }>(`/devices/${id}/control`, {
      method: 'POST',
      body: JSON.stringify({ action, parameters }),
    });
  }

  async getDeviceStats() {
    return this.request<{
      totalDevices: number;
      activeDevices: number;
      onlineDevices: number;
      maintenanceDevices: number;
      lowBatteryDevices: number;
    }>('/devices/stats/overview');
  }

  // Order endpoints
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      orders: any[];
      pagination: any;
    }>(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getOrder(id: string) {
    return this.request<{ order: any }>(`/orders/${id}`);
  }

  async cancelOrder(id: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async updateShippingAddress(id: string, address: any) {
    return this.request<{ order: any }>(`/orders/${id}/shipping-address`, {
      method: 'PUT',
      body: JSON.stringify({ shippingAddress: address }),
    });
  }

  async trackOrder(id: string) {
    return this.request<{ tracking: any }>(`/orders/${id}/tracking`);
  }

  // Payment endpoints
  async createPaymentIntent(orderId: string, amount: number) {
    return this.request<{
      clientSecret: string;
      paymentIntentId: string;
    }>('/payment/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount }),
    });
  }

  async confirmPayment(paymentIntentId: string) {
    return this.request<{ orderId: string }>('/payment/confirm-payment', {
      method: 'POST',
      body: JSON.stringify({ paymentIntentId }),
    });
  }

  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: any;
    billingAddress?: any;
  }) {
    return this.request<{ order: any }>('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Service ticket endpoints
  async getServiceTickets(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      tickets: any[];
      pagination: any;
    }>(`/service/tickets${queryString ? `?${queryString}` : ''}`);
  }

  async getServiceTicket(id: string) {
    return this.request<{ ticket: any }>(`/service/tickets/${id}`);
  }

  async createServiceTicket(ticketData: {
    title: string;
    description: string;
    issueType: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    deviceId?: string;
    scheduledDate?: string;
  }) {
    return this.request<{ ticket: any }>('/service/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  }

  async updateServiceTicket(id: string, ticketData: {
    title?: string;
    description?: string;
    priority?: string;
    scheduledDate?: string;
  }) {
    return this.request<{ ticket: any }>(`/service/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  }

  async cancelServiceTicket(id: string) {
    return this.request(`/service/tickets/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async getServiceStats() {
    return this.request<{
      totalTickets: number;
      openTickets: number;
      inProgressTickets: number;
      completedTickets: number;
      urgentTickets: number;
    }>('/service/stats');
  }

  // Custom build endpoints
  async getCustomBuilds(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    return this.request<{
      builds: any[];
      pagination: any;
    }>(`/custom-build${queryString ? `?${queryString}` : ''}`);
  }

  async getCustomBuild(id: string) {
    return this.request<{ build: any }>(`/custom-build/${id}`);
  }

  async createCustomBuild(buildData: {
    name: string;
    description?: string;
    designFiles?: string[];
    parts: Array<{ productId: string; quantity: number }>;
  }) {
    return this.request<{ build: any }>('/custom-build', {
      method: 'POST',
      body: JSON.stringify(buildData),
    });
  }

  async updateCustomBuild(id: string, buildData: {
    name?: string;
    description?: string;
    designFiles?: string[];
    parts?: Array<{ productId: string; quantity: number }>;
  }) {
    return this.request<{ build: any }>(`/custom-build/${id}`, {
      method: 'PUT',
      body: JSON.stringify(buildData),
    });
  }

  async requestQuote(id: string) {
    return this.request(`/custom-build/${id}/request-quote`, {
      method: 'POST',
    });
  }

  async cancelCustomBuild(id: string) {
    return this.request(`/custom-build/${id}/cancel`, {
      method: 'PUT',
    });
  }

  async deleteCustomBuild(id: string) {
    return this.request(`/custom-build/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload endpoints
  async uploadFile(file: File, type: string = 'general') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/single`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }

  async uploadMultipleFiles(files: File[], type: string = 'general') {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }

  async uploadDesignFiles(files: File[]) {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/upload/design`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return response.json();
  }

  async deleteFile(publicId: string) {
    return this.request(`/upload/${publicId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
