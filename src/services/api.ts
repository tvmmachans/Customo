import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  brand: string;
  imageUrl?: string;
  sku?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  shippingAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  battery: number;
  location?: string;
  tasks?: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  logs?: DeviceLog[];
}

interface DeviceLog {
  id: string;
  level: string;
  message: string;
  details?: string;
  timestamp: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
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
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    company?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Registration failed');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/me');
    if (response.success && response.data) {
      return response.data.user;
    }
    throw new Error(response.message || 'Failed to get user');
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.request<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      return response.data.user;
    }
    throw new Error(response.message || 'Profile update failed');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.success) {
      throw new Error(response.message || 'Password change failed');
    }
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    size?: number;
    search?: string;
    category?: string;
    brand?: string;
  }): Promise<{ products: Product[]; totalElements: number; totalPages: number; currentPage: number; size: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.brand) searchParams.append('brand', params.brand);

    const endpoint = searchParams.toString() ? `/products?${searchParams}` : '/products';
    const response = await this.request<{ products: Product[]; totalElements: number; totalPages: number; currentPage: number; size: number }>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch products');
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<{ product: Product }>(`/products/${id}`);
    if (response.success && response.data) {
      return response.data.product;
    }
    throw new Error(response.message || 'Product not found');
  }

  async getCategories(): Promise<string[]> {
    const response = await this.request<{ categories: string[] }>('/products/categories');
    if (response.success && response.data) {
      return response.data.categories;
    }
    throw new Error(response.message || 'Failed to fetch categories');
  }

  async getBrands(): Promise<string[]> {
    const response = await this.request<{ brands: string[] }>('/products/brands');
    if (response.success && response.data) {
      return response.data.brands;
    }
    throw new Error(response.message || 'Failed to fetch brands');
  }

  // Cart methods
  async getCartItems(): Promise<CartItem[]> {
    const response = await this.request<{ cartItems: CartItem[] }>('/cart');
    if (response.success && response.data) {
      return response.data.cartItems;
    }
    throw new Error(response.message || 'Failed to fetch cart items');
  }

  async addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
    const response = await this.request<{ cartItem: CartItem }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });

    if (response.success && response.data) {
      return response.data.cartItem;
    }
    throw new Error(response.message || 'Failed to add item to cart');
  }

  async updateCartItem(cartItemId: string, quantity: number): Promise<CartItem> {
    const response = await this.request<{ cartItem: CartItem }>(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });

    if (response.success && response.data) {
      return response.data.cartItem;
    }
    throw new Error(response.message || 'Failed to update cart item');
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    const response = await this.request(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to remove item from cart');
    }
  }

  async clearCart(): Promise<void> {
    const response = await this.request('/cart', {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to clear cart');
    }
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    const response = await this.request<{ orders: Order[] }>('/orders');
    if (response.success && response.data) {
      return response.data.orders;
    }
    throw new Error(response.message || 'Failed to fetch orders');
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.request<{ order: Order }>(`/orders/${id}`);
    if (response.success && response.data) {
      return response.data.order;
    }
    throw new Error(response.message || 'Order not found');
  }

  async createOrder(orderData: {
    shippingAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    notes?: string;
  }): Promise<Order> {
    const response = await this.request<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });

    if (response.success && response.data) {
      return response.data.order;
    }
    throw new Error(response.message || 'Failed to create order');
  }

  // Device methods (for YourDevices page)
  async getDevices(params?: {
    page?: number;
    size?: number;
    search?: string;
    status?: string;
  }): Promise<{ devices: Device[]; totalElements: number; totalPages: number; currentPage: number; size: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    const endpoint = searchParams.toString() ? `/devices?${searchParams}` : '/devices';
    const response = await this.request<{ devices: Device[]; totalElements: number; totalPages: number; currentPage: number; size: number }>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch devices');
  }

  async getDevice(id: string): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}`);
    if (response.success && response.data) {
      return response.data.device;
    }
    throw new Error(response.message || 'Device not found');
  }

  async createDevice(deviceData: {
    name: string;
    type: string;
    location?: string;
    tasks?: string;
  }): Promise<Device> {
    const response = await this.request<{ device: Device }>('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });

    if (response.success && response.data) {
      return response.data.device;
    }
    throw new Error(response.message || 'Failed to create device');
  }

  async updateDevice(id: string, deviceData: Partial<Device>): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });

    if (response.success && response.data) {
      return response.data.device;
    }
    throw new Error(response.message || 'Failed to update device');
  }

  async deleteDevice(id: string): Promise<void> {
    const response = await this.request(`/devices/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete device');
    }
  }

  async updateDeviceStatus(id: string, status: string): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });

    if (response.success && response.data) {
      return response.data.device;
    }
    throw new Error(response.message || 'Failed to update device status');
  }

  async updateDeviceBattery(id: string, battery: number): Promise<Device> {
    const response = await this.request<{ device: Device }>(`/devices/${id}/battery`, {
      method: 'PUT',
      body: JSON.stringify({ battery }),
    });

    if (response.success && response.data) {
      return response.data.device;
    }
    throw new Error(response.message || 'Failed to update device battery');
  }

  async getLowBatteryDevices(threshold: number = 20): Promise<Device[]> {
    const response = await this.request<{ devices: Device[] }>(`/devices/low-battery?threshold=${threshold}`);
    if (response.success && response.data) {
      return response.data.devices;
    }
    throw new Error(response.message || 'Failed to fetch low battery devices');
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
